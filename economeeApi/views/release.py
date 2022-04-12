from django.db.models import Q
from django.http import JsonResponse, HttpResponse
from django_rest.permissions import IsAuthenticated
from rest_framework import authentication, viewsets
from rest_framework.decorators import action

from economeeApi.models import Release, Account, RecurringRelease, Balance, Card, Invoice
from economeeApi.serializers import ReleaseRRSerializer
from economeeApi.utils import *


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
        account_id = int(request.data.get('account_id'))
        user_id = self.request.user.id

        account = Account.objects.filter(id=account_id, owner_id=user_id).first()

        if account:
            invoices = []
            balances = []

            release_value = float(request.data.get('value'))
            release_type = int(request.data.get('type'))
            release_date = Utils.date_to_database_format(request.data.get('date_release'))
            installment_times = int(request.data.get('installment_times'))
            installment_value = release_value / installment_times
            is_paid = bool(request.data.get('is_paid'))

            """CARD"""
            "Date parse - check if the release will be in actual or next month"
            card_id = request.data.get('card_id')
            card = Card.objects.filter(id=card_id, account=account).first()

            if card_id:
                if (release_date - card.pay_date).days <= 10:
                    release_date = release_date + relativedelta(months=+ 1)

                """INVOICE"""
                for n in range(installment_times):
                    date_reference_invoice = Utils.date_replace_and_add_month(release_date, card.pay_date.day, n)

                    invoice = Invoice.objects.filter(
                        card_id=card_id,
                        date_reference=date_reference_invoice
                    ).first()

                    if invoice is None:
                        # if invoice does not exist, create a new one
                        invoice = Invoice.objects.create(
                            date_reference=date_reference_invoice,
                            card_id=int(card_id),
                            is_paid=False
                        )

                    Utils.update_invoice_total(invoice, release_type, installment_value)

                    invoices.append(invoice)

            """BALANCE"""
            "Check if there's a balance created for the actual month of the release, " \
            "if it has just update the total values"
            for n in range(installment_times):
                # Balance day must always be the 1º day of the month
                date_reference_balance = Utils.date_replace_and_add_month(release_date, 1, n)

                # check if there's a balance already created for that month
                balance = Balance.objects.filter(account=account, date_reference=date_reference_balance).first()

                # If balance does not exist, create a new one with the value, else just add the expense or
                # income value
                if balance is None:
                    balance = Balance.objects.create(
                        date_reference=date_reference_balance,
                        account_id=account_id
                    )

                if is_paid:
                    Utils.update_balance_total(balance, release_type, installment_value)

                balances.append(balance)

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
                is_paid=is_paid if not card_id else False,
                release=release,
                balance=balances[i],
                invoice=invoices[i] if card_id else None,
            ) for i in range(installment_times)]

            RecurringRelease.objects.bulk_create(recurring_releases)

            if is_paid:
                Utils.update_account_total(account, release_type, installment_value)

            rr = RecurringRelease.objects.filter(
                release_id=release.id
            ).first()

            return JsonResponse(ReleaseRRSerializer(rr).data)
        else:
            return HttpResponse("This account isn't yours", content_type="application/json")

    def destroy(self, request, *args, **kwargs):
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

        for recurring_release in recurring_releases:
            if recurring_release.is_paid:
                Utils.update_account_total(account, 1 if release.type == 0 else 0,
                                           recurring_release.installment_value)

            balance = Balance.objects.filter(
                id=recurring_release.balance_id
            ).first()
            if recurring_release.is_paid:
                Utils.update_balance_total(balance, release.type, -recurring_release.installment_value)

            invoice = Invoice.objects.filter(
                id=recurring_release.invoice_id
            ).first()

            if invoice and recurring_release.is_paid:
                Utils.update_invoice_total(invoice, release.type, -recurring_release.installment_value)

            recurring_release.delete()

        release.delete()

        return JsonResponse({'success': 'release deleted'}, status=200)

    def update(self, request, **kwargs):
        # try:
        release_id = kwargs.get('pk')

        release = Release.objects.filter(
            id=release_id
        ).first()

        value = request.data.get('value')

        if release.value != value:
            Utils.update_release_value(release_id, request.user.id, value, release.type)

        # Make available the possibility for user mark all future recurring releases as paid
        # if request.data.get('is_paid') is not None:
        #     Utils.update_recurring_releases_paid(release_id, request.data.get('is_paid'), release.type)

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
        # except Exception:
        #     return JsonResponse({'error': 'something bad'}, status=400)

    @classmethod
    def update_release_value(cls, release_id, user_id, value, release_type):
        recurring_releases = RecurringRelease.objects.filter(
            release_id=release_id
        ).all()

        account = Account.objects.filter(
            owner_id=user_id
        ).first()

        cls.update_account_total(account, release_type, -recurring_releases[0].installment_value)
        cls.update_account_total(account, release_type, recurring_releases[0].installment_value)

        installment_value = value / recurring_releases[0].installment_times

        for recurring_release in recurring_releases:
            balance = Balance.objects.filter(
                id=recurring_release.balance_id
            ).first()

            cls.update_balance_total(balance, release_type, -recurring_release.installment_value)
            cls.update_balance_total(balance, release_type, recurring_release.installment_value)

            invoice = Invoice.objects.filter(
                id=recurring_release.invoice_id
            ).first()

            if invoice:
                cls.update_invoice_total(invoice, release_type, -recurring_release.installment_value)
                cls.update_invoice_total(invoice, release_type, recurring_release.installment_value)

            RecurringRelease.objects.update(
                installment_value=installment_value
            )

    @action(detail=False, methods=['patch'], url_path='pay/release/(?P<recurring_release_id>[^/.]+)')
    def pay_release(self, request, **kwargs):
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

        # Update all recurring releases of a specific invoice and changing the status of the is_paid,
        # also update the account total and balance total

    @action(detail=False, methods=['patch'], url_path='pay/invoice/(?P<invoice_id>[^/.]+)')
    def pay_invoice(self, request):
        # Get the invoice id
        invoice_id = request.path_params['invoice_id']

        recurring_releases = RecurringRelease.objects.filter(
            invoice_id=invoice_id
        ).all()

        # Get the release type from the recurring release
        release_type = recurring_releases[0].release.release_type

        # Update is_paid of recurring releases that have the date greater than now
        for recurring_release in recurring_releases:
            if recurring_release.date_release > datetime.now().date():
                # Update the account total available
                Utils.update_account_total(
                    recurring_release.balance.account.id,
                    release_type,
                    recurring_release.installment_value,
                )

                # update the balance total values
                Utils.update_balance_total(
                    recurring_release.balance.id,
                    release_type,
                    recurring_release.installment_value,
                )

                # update the status of the actual recurring release
                recurring_release.is_paid = True
                recurring_release.save()

        # Update the status of invoice is_paid
        invoice = Invoice.objects.get(id=invoice_id)
        invoice.is_paid = True
        invoice.save()

    """QUERIES"""

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

    # Method to update the date_release of a recurring release, changing also the balance id and the invoice id,if necessary, this has to update the values of the balance and the account as well
    # @classmethod
    # def update_recurring_release(cls, recurring_release, release_type, date_release):
    #     # Get the balance and the account of the recurring release
    #     balance = recurring_release.balance
    #     account = balance.account
    #
    #     # Get the invoice of the recurring release
    #     invoice = recurring_release.invoice
    #
    #     # Get the installment value of the release
    #     installment_value = recurring_release.installment_value
    #
    #     # Get the installment total of the release
    #     installment_total = recurring_release.installment
    #
    #     # Get the installment number of the release
    #     installment_number = recurring_release.installment_number
    #
    #     #
