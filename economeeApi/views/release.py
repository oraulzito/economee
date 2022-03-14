from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.http import JsonResponse, HttpResponse
from django.utils.datetime_safe import datetime, date
from django_rest.permissions import IsAuthenticated
from rest_framework import authentication, viewsets
from rest_framework.decorators import action
from rest_framework.utils import json

from economeeApi.models import Release, Account, RecurringRelease, Balance, Card, Invoice
from economeeApi.serializers import ReleaseRRSerializer


class ReleaseView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = ReleaseRRSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if 'balance_id' in self.request.query_params:
            return self.balance()
        elif 'invoice_id' in self.request.query_params:
            return self.invoice()
        elif 'category_id' in self.request.query_params:
            return self.category()
        elif 'date_reference' in self.request.query_params:
            return self.date_reference()
        else:
            return self.all_releases()

    def create(self, request, *args, **kwargs):
        #  CHECK IF THE USER IT's THE ACCOUNT OWNER
        account_id = request.data.get('account_id')
        account = Account.objects.filter(id=account_id, owner_id=request.user.id).first()

        if account:
            today_date = date.today()

            invoices = []
            balances = []

            release_value = float(request.data.get('value'))
            release_type = request.data.get('type')
            release_date = self.date_to_database_format(request.data.get('date_release'))
            installment_times = int(request.data.get('installment_times')) if request.data.get(
                'installment_times') is not None else 1
            installment_value = float(request.data.get('value')) / installment_times

            """CARD"""
            "Date parse - check if the release will be in actual or next month"
            card_id = request.data.get('card_id')
            if card_id is not None:
                if (release_date - today_date).days <= 10:
                    release_date = release_date + relativedelta(months=+ 1)

            """BALANCE"""
            "Check if there's a balance created for the actual month of the release, " \
            "if it has just update the total values"
            for n in range(installment_times):
                # Balance day must always be the 1º day of the month
                date_reference_balance = self.date_replace_and_add_month(release_date, 1, n)

                # check if there's a balance already created for that month
                balance = Balance.objects.filter(account=account, date_reference=date_reference_balance).first()

                # If balance does not exist, create a new one with the value, else just add the expense or
                # income value
                if balance is None:
                    balance = Balance.objects.create(
                        date_reference=date_reference_balance,
                        account_id=int(request.data.get('account_id'))
                    )

                self.update_balance_total(balance, release_type, installment_value)

                balances.append(balance)

            # Card releases, create or add values to the invoice
            if card_id is not None:

                # check if the card is from user, and if it exists
                card = Card.objects.filter(id=card_id, account=account).first()

                if card:
                    """INVOICE"""
                    for n in range(installment_times):
                        date_reference_invoice = self.date_replace_and_add_month(release_date, card.pay_date.day, n)

                        invoice = Invoice.objects.filter(
                            card_id=card_id,
                            date_reference=date_reference_invoice
                        ).first()

                        if invoice is None:
                            # if invoice does not exist, create a new one
                            invoice = Invoice.objects.create(
                                date_reference=date_reference_invoice,
                                card_id=int(card_id),
                                is_paid=False,
                                total_value=installment_value
                            )
                        else:
                            invoice.total_value += installment_value
                        invoice.save()
                        invoices.append(invoice)

            # Create the release
            release = Release.objects.create(
                value=release_value,
                type=release_type,
                date_creation=datetime.now(),
                description=request.data.get('description'),
                category_id=int(request.data.get('category_id')),
                place=request.data.get('place') if request.data.get('place') is not None else ""
            )

            # Create the recurring release
            recurring_releases = [RecurringRelease(
                installment_number=i + 1,
                installment_value=installment_value,
                installment_times=installment_times,
                date_release=release_date + relativedelta(months=+i),
                is_paid=bool(request.data.get('is_paid')) if card_id and i == 0 != None else False,
                release=release,
                balance=balances[i],
                invoice=invoices[i] if card_id is not None else None,
            ) for i in range(installment_times)]

            RecurringRelease.objects.bulk_create(recurring_releases)

            self.update_account_total(account, release_type, installment_value)

            rr = RecurringRelease.objects.filter(
                release_id=release.id
            ).first()

            return JsonResponse(ReleaseRRSerializer(rr).data)
        else:
            return HttpResponse("This account isn't yours", content_type="application/json")

    def update_balance_total(cls, balance, release_type, installment_value):
        if release_type == 0:
            balance.total_expenses += installment_value
        elif release_type == 1:
            balance.total_incomes += installment_value
        balance.save()

    def update_account_total(cls, account, release_type, installment_value):
        if release_type == 0:
            account.total_available -= installment_value
        elif release_type == 1:
            account.total_available += installment_value
        account.save()

    # FIXME REFACTOR
    def date_replace_and_add_month(cls, date_reference, day, n):
        date_reference_invoice = date_reference.replace(day=day)
        return date_reference_invoice + relativedelta(months=+n)

    def date_to_database_format(cls, from_date):
        from_date = str(from_date).split("T")[0]
        return datetime.strptime(from_date, '%Y-%m-%d').date()

    def balance(self):
        balance_id = self.request.query_params.get('balance_id')
        # Get releases of a specific balance
        return Release.objects.filter(
            recurring_release__balance__account__owner=self.request.user,
            recurring_release__balance_id=balance_id,
            recurring_release__invoice_id=None
        ).all().distinct()

    def invoice(self):
        invoice_id = self.request.query_params.get('invoice_id')
        # Get releases of a specific invoice
        return Release.objects.filter(
            recurring_release__invoice__card__account__owner=self.request.user,
            recurring_release__invoice_id=invoice_id
        ).all().distinct()

    def category(self):
        category_id = self.request.query_params.get('category_id')
        # Get releases of specific category
        return Release.objects.filter(
            Q(recurring_release__invoice__card__account__owner=self.request.user) |
            Q(recurring_release__balance__account__owner=self.request.user),
            category_id=category_id
        ).all().distinct()

    def date_reference(self):
        date_reference = self.request.query_params.get('date_reference')
        date_reference_init = datetime.strptime(date_reference, '%Y-%m-%d').replace(day=1).date()

        if date_reference_init.month == 2:
            date_reference_final = datetime.strptime(date_reference, '%Y-%m-%d').replace(day=28).date()
        elif date_reference_init.month in {1, 3, 5, 7, 8, 10, 12}:
            date_reference_final = datetime.strptime(date_reference, '%Y-%m-%d').replace(day=31).date()
        else:
            date_reference_final = datetime.strptime(date_reference, '%Y-%m-%d').replace(day=30).date()

        return Release.objects.filter(
            Q(recurring_release__invoice__card__account__owner=self.request.user) |
            Q(recurring_release__balance__account__owner=self.request.user),
            recurring_release__date_release__range=(date_reference_init, date_reference_final)
        ).all().distinct()

    def all_releases(self):
        return Release.objects.filter(
            recurring_release__balance__account__owner=self.request.user
        ).all().distinct()

    @action(detail=False, methods=['GET'])
    def graphics_monthly(self, request):
        income = []
        expense = []
        results_expenses = Balance.objects.raw("""
                                select bal.id,
                                       bal.date_reference,
                                       sum(rr.installment_value) as total
                                from "economeeApi_release" as rel
                                         left join "economeeApi_recurringrelease" as rr
                                                   on rel.id = rr.release_id
                                         inner join "economeeApi_balance" as bal
                                                    on rr.balance_id = bal.id
                                where rel.type = 0
                                  and bal.account_id = %s
                                group by bal.id
                                order by bal.date_reference;
                                           """, [self.request.query_params.get('account_id')])
        # TODO check if it`s necessary add the user id on this query
        for e in results_expenses:
            expense.append({'id': e.id, 'date_reference': str(e.date_reference), 'total': e.total})

        results_incomes = Balance.objects.raw("""
                        select bal.id,
                               bal.date_reference,
                               sum(rr.installment_value) as total
                        from "economeeApi_release" as rel
                                 left join "economeeApi_recurringrelease" as rr
                                           on rel.id = rr.release_id
                                 inner join "economeeApi_balance" as bal
                                            on rr.balance_id = bal.id
                        where rel.type = 1
                          and bal.account_id = %s
                          and a.owner_id = %s
                        group by bal.id
                        order by bal.date_reference;
                        """,
                                              [
                                                  self.request.query_params.get('account_id'),
                                                  self.request.user.id
                                              ])
        # TODO check if it`s necessary add the user id on this query
        for i in results_incomes:
            income.append({'id': i.id, 'date_reference': str(i.date_reference), 'total': i.total})

        return JsonResponse({'incomes': income, 'expenses': expense})

    @action(detail=False, methods=['GET'])
    def graphics_category(self, request):
        result = []
        results = Balance.objects.raw("""
                                        select rc.id, rc.name, sum(rr.installment_value) as total
                                        from "economeeApi_release" r
                                                 INNER JOIN "economeeApi_recurringrelease" rr on r.id = rr.release_id
                                                 INNER JOIN "economeeApi_balance" b on b.id = rr.balance_id
                                                 INNER JOIN "economeeApi_account" a on a.id = %s
                                                 INNER JOIN "economeeApi_releasecategory" rc on rc.id = r.category_id
                                        where a.id = %s
                                          and balance_id = %s
                                          and a.owner_id = %s
                                        GROUP BY rc.id, rc.name;
                                                   """,
                                      [
                                          self.request.query_params.get('account_id'),
                                          self.request.query_params.get('balance_id'),
                                          self.request.user.id
                                      ])
        for result in results:
            result.append({"id": result.id, "name": result.name, "total": result.total})
        return HttpResponse(json.dumps(result))

    @action(detail=False, methods=['GET'])
    def graphics_timeline(self, request):
        result = []
        results = Balance.objects.raw("""
                                select b.id, b.date_reference, b.total_expenses, b.total_incomes
                                    from "economeeApi_balance" b
                                             INNER JOIN "economeeApi_account" a on a.id = b.account_id
                                where a.owner_id = %s
                                  and a.id = %s
                                  and b.date_reference BETWEEN (current_date - interval '5 months')
                                    and (current_date + interval '6 months')
                                           """,
                                      [
                                          self.request.user.id,
                                          self.request.query_params.get('account_id')
                                      ])
        for r in results:
            result.append({
                "date_reference": str(r.date_reference),
                "total_expenses": r.total_expenses,
                "total_incomes": r.total_incomes
            })
        return HttpResponse(json.dumps(result))

    def destroy(self, request, *args, **kwargs):
        try:
            instance = kwargs.get('pk')

            recurring_releases = RecurringRelease.objects.filter(
                release_id=instance
            ).all()

            release = Release.objects.filter(
                id=instance
            ).first()

            account = Account.objects.filter(
                owner_id=self.request.user.id
            ).first()
            self.update_account_total(account, 1 if release.type == 0 else 0, recurring_releases[0].installment_value)

            for recurringRelease in recurring_releases:
                balance = Balance.objects.filter(
                    id=recurringRelease.balance_id
                ).first()
                self.update_balance_total(balance, 1 if release.type == 0 else 0, recurringRelease.installment_value)
                recurringRelease.delete()

            release.delete()
            return JsonResponse({'suceess': 'release deleted'}, status=200)
        except Exception:
            return JsonResponse({'error': 'something bad'}, status=400)


def update(self, request, **kwargs):
    try:
        instance = kwargs.get('pk')

        release = Release.objects.filter(
            id=instance
        ).first()

        value = request.data.get('value')

        if release.value != value:
            recurring_releases = RecurringRelease.objects.filter(
                release_id=instance
            ).all()

            account = Account.objects.filter(
                owner_id=self.request.user.id
            ).first()
            self.update_account_total(account, recurring_releases[0].type, recurring_releases[0].installment_value)

            for recurringRelease in recurring_releases:
                balance = Balance.objects.filer(
                    id=recurringRelease.balance_id
                ).first()
                self.update_balance_total(balance, recurringRelease.type, recurringRelease.installment_value)

        release.update(request)
        return JsonResponse({'suceess': 'release updated'}, status=200)
    except Exception:
        return JsonResponse({'error': 'something bad'}, status=400)
