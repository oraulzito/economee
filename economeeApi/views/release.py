from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.http import JsonResponse, HttpResponse
from django.utils.datetime_safe import datetime, date
from django_rest.permissions import IsAuthenticated
from rest_framework import authentication, viewsets
from rest_framework.decorators import action

from economeeApi.models import Release, Account, RecurringRelease, Balance, Card, Invoice
from economeeApi.serializers import ReleaseRRSerializer


class ReleaseView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = ReleaseRRSerializer

    def get_permissions(self):
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
                            self.update_invoice_total(invoice, release_type, installment_value)
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
                is_paid=bool(request.data.get('is_paid')) if not card_id else False,
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

    @classmethod
    def update_invoice_total(cls, invoice, release_type, value):
        if release_type == 0:
            invoice.total_value += value
        elif release_type == 1:
            invoice.total_value -= value
        invoice.save()

    @classmethod
    def update_balance_total(cls, balance, release_type, value):
        if release_type == 0:
            balance.total_expenses += value
        elif release_type == 1:
            balance.total_incomes += value
        balance.save()

    @classmethod
    def update_account_total(cls, account, release_type, value):
        if release_type == 0:
            account.total_available -= value
        elif release_type == 1:
            account.total_available += value
        account.save()

    # FIXME REFACTOR
    @classmethod
    def date_replace_and_add_month(cls, date_reference, day, n):
        date_reference_invoice = date_reference.replace(day=day)
        return date_reference_invoice + relativedelta(months=+n)

    @classmethod
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

    @action(detail=False, methods=['patch'], url_path='pay/(?P<recurring_release_id>[^/.]+)')
    def pay(self, request, **kwargs):
        try:
            instance = kwargs.get('recurring_release_id')

            recurring_releases = RecurringRelease.objects.filter(
                id=instance
            ).first()

            recurring_releases.is_paid = not recurring_releases.is_paid

            recurring_releases.save()

            if recurring_releases.is_paid:
                return JsonResponse({'success': 'release paid'}, status=200)
            else:
                return JsonResponse({'success': 'release unpaid'}, status=200)
        except Exception:
            return JsonResponse({'error': 'something bad'}, status=400)

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
                self.update_balance_total(balance, release.type, -recurringRelease.installment_value)
                recurringRelease.delete()

            release.delete()
            return JsonResponse({'success': 'release deleted'}, status=200)
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

                installment_value = value / release.installment_times

                for recurringRelease in recurring_releases:
                    balance = Balance.objects.filer(
                        id=recurringRelease.balance_id
                    ).first()
                    self.update_balance_total(balance, recurringRelease.type, recurringRelease.installment_value)

                    # Create the recurring release
                    RecurringRelease.objects.update(
                        installment_value=installment_value,
                        is_paid=bool(request.data.get('is_paid')),
                    )

                    # TODO update those fields will require specific logic
                    # installment_times = installment_times,
                    # date_release = release_date + relativedelta(months=+i),

                # Create the release
                Release.objects.update(
                    value=value,
                    type=request.data.get('type') if release.type != request.data.get('type') else release.type,
                    description=request.data.get('description') if release.description != request.data.get(
                        'description') else release.description,
                    category_id=int(request.data.get('category_id')) if release.category_id != request.data.get(
                        'category_id') else release.category_id,
                    place=request.data.get('place') if release.place != request.data.get('place') else release.place
                )
            return JsonResponse({'success': 'release updated'}, status=200)
        except Exception:
            return JsonResponse({'error': 'something bad'}, status=400)
