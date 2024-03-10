from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.http import JsonResponse, HttpResponse
from django_rest.permissions import IsAuthenticated
from rest_framework import authentication, viewsets
from rest_framework.decorators import action

from economeeApi.models import Release, Account, RecurringRelease, Balance, Card, Invoice
from economeeApi.serializers import ReleaseRRSerializer
from economeeApi.utils import Utils


class ReleaseView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = ReleaseRRSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if 'balance_id' in self.request.query_params:
            return self.balance()
        elif 'invoice_id' in self.request.query_params:
            return self.invoice()
        elif 'category_id' in self.request.query_params:
            return self.category()
        elif 'reference_date' in self.request.query_params:
            return self.reference_date()
        else:
            return self.all_releases()

    def create(self, request, *args, **kwargs):
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

            card_id = request.data.get('card_id')
            card = Card.objects.filter(id=card_id, account=account).first()

            if card_id:
                release_date = self.adjust_release_date(release_date, card.pay_date)

                invoices = self.create_or_update_invoices(card_id, release_date, installment_times, installment_value)
            
            balances = self.create_or_update_balances(account, release_date, installment_times, installment_value, is_paid)

            release = self.create_release(request, release_value, release_type)

            recurring_releases = self.create_recurring_releases(
                release, installment_times, release_date, is_paid, balances, invoices
            )

            self.update_account_total(account, release_type, installment_value, release_date)

            return JsonResponse(ReleaseRRSerializer(recurring_releases[0]).data)
        else:
            return HttpResponse("This account isn't yours", content_type="application/json")

    def adjust_release_date(self, release_date, pay_date):
        if (release_date - pay_date).days <= 10:
            release_date = release_date + relativedelta(months=1)
        return release_date

    def create_or_update_invoices(self, card_id, release_date, installment_times, installment_value):
        invoices = []

        for n in range(installment_times):
            reference_date_invoice = Utils.date_replace_and_add_month(release_date, card.pay_date.day, n)

            invoice = Invoice.objects.filter(
                card_id=card_id,
                reference_date=reference_date_invoice
            ).first()

            if invoice is None:
                invoice = Invoice.objects.create(
                    reference_date=reference_date_invoice,
                    card_id=int(card_id),
                    is_paid=False
                )

            Utils.update_invoice_total(invoice, release_type, installment_value)

            invoices.append(invoice)

        return invoices

    def create_or_update_balances(self, account, release_date, installment_times, installment_value, is_paid):
        balances = []

        for n in range(installment_times):
            reference_date_balance = Utils.date_replace_and_add_month(release_date, 1, n)

            balance = Balance.objects.filter(account=account, reference_date=reference_date_balance).first()

            if balance is None:
                balance = Balance.objects.create(
                    reference_date=reference_date_balance,
                    account_id=account.id
                )

            if is_paid:
                Utils.update_balance_total(balance, release_type, installment_value)

            balances.append(balance)

        return balances

    def create_release(self, request, release_value, release_type):
        return Release.objects.create(
            value=release_value,
            type=release_type,
            date_creation=datetime.now(),
            description=request.data.get('description'),
            category_id=int(request.data.get('category_id')),
            place=request.data.get('place') if request.data.get('place') is not None else ""
        )

    def create_recurring_releases(self, release, installment_times, release_date, is_paid, balances, invoices):
        recurring_releases = [RecurringRelease(
            installment_number=i + 1,
            installment_value=installment_value,
            installment_times=installment_times,
            date_release=release_date + relativedelta(months=i),
            is_paid=is_paid if not card_id else False,
            release=release,
            balance=balances[i],
            invoice=invoices[i] if card_id else None,
        ) for i in range(installment_times)]

        return RecurringRelease.objects.bulk_create(recurring_releases)

    def update_account_total(self, account, release_type, installment_value, release_date):
        if is_paid and release_date.year == datetime.now().year and release_date.month == datetime.now().month:
            Utils.update_account_total(account, release_type, installment_value)

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
            self.handle_recurring_release(recurring_release, release)

        release.delete()

        return JsonResponse({'success': 'release deleted'}, status=200)

    def handle_recurring_release(self, recurring_release, release):
        if recurring_release.is_paid:
            Utils.update_account_total(account, 1 if release.type == 0 else 0, recurring_release.installment_value)

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

    def update(self, request, **kwargs):
        release_id = kwargs.get('pk')

        release = Release.objects.filter(
            id=release_id
        ).first()

        value = request.data.get('value')

        if release.value != value:
            self.update_release_value(release_id, request.user.id, value, release.type)

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

    def update_release_value(self, release_id, user_id, value, release_type):
        recurring_releases = RecurringRelease.objects.filter(
            release_id=release_id
        ).all()

        account = Account.objects.filter(
            owner_id=user_id
        ).first()

        self.update_account_total(account, release_type, -recurring_releases[0].installment_value)

        installment_value = value / recurring_releases[0].installment_times

        for recurring_release in recurring_releases:
            balance = Balance.objects.filter(
                id=recurring_release.balance_id
            ).first()

            Utils.update_balance_total(balance, release_type, -recurring_release.installment_value)

            invoice = Invoice.objects.filter(
                id=recurring_release.invoice_id
            ).first()

            if invoice:
                Utils.update_invoice_total(invoice, release_type, -recurring_release.installment_value)

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

    @action(detail=False, methods=['patch'], url_path='pay/invoice/(?P<invoice_id>[^/.]+)')
    def pay_invoice(self, request):
        invoice_id = request.path_params['invoice_id']

        recurring_releases = RecurringRelease.objects.filter(
            invoice_id=invoice_id
        ).all()

        release_type = recurring_releases[0].release.type

        for recurring_release in recurring_releases:
            if recurring_release.date_release > datetime.now().date():
                Utils.update_account_total(
                    recurring_release.balance.account.id,
                    release_type,
                    recurring_release.installment_value,
                )

                Utils.update_balance_total(
                    recurring_release.balance.id,
                    release_type,
                    recurring_release.installment_value,
                )

                recurring_release.is_paid = True
                recurring_release.save()

        invoice = Invoice.objects.get(id=invoice_id)
        invoice.is_paid = True
        invoice.save()

    def balance(self):
        balance_id = self.request.query_params.get('balance_id')
        return Release.objects.filter(
            recurring_release__balance__account__owner=self.request.user,
            recurring_release__balance_id=balance_id,
            recurring_release__invoice_id=None
        ).all().distinct()

    def invoice(self):
        invoice_id = self.request.query_params.get('invoice_id')
        return Release.objects.filter(
            recurring_release__invoice__card__account__owner=self.request.user,
            recurring_release__invoice_id=invoice_id
        ).all().distinct()

    def category(self):
        category_id = self.request.query_params.get('category_id')
        return Release.objects.filter(
            Q(recurring_release__invoice__card__account__owner=self.request.user) |
            Q(recurring_release__balance__account__owner=self.request.user),
            category_id=category_id
        ).all().distinct()

    def reference_date(self):
        reference_date = self.request.query_params.get('reference_date')
        reference_date_init = datetime.strptime(reference_date, '%Y-%m-%d').replace(day=1).date()

        if reference_date_init.month == 2:
            reference_date_final = datetime.strptime(reference_date, '%Y-%m-%d').replace(day=28).date()
        elif reference_date_init.month in {1, 3, 5, 7, 8, 10, 12}:
            reference_date_final = datetime.strptime(reference_date, '%Y-%m-%d').replace(day=31).date()
        else:
            reference_date_final = datetime.strptime(reference_date, '%Y-%m-%d').replace(day=30).date()

        return Release.objects.filter(
            Q(recurring_release__invoice__card__account__owner=self.request.user) |
            Q(recurring_release__balance__account__owner=self.request.user),
            recurring_release__date_release__range=(reference_date_init, reference_date_final)
        ).all().distinct()

    def all_releases(self):
        return Release.objects.filter(
            recurring_release__balance__account__owner=self.request.user
        ).all().distinct()

    @classmethod
    def update_recurring_release(cls, recurring_release, release_type, date_release):
        balance = recurring_release.balance
        account = balance.account
        invoice = recurring_release.invoice
        installment_value = recurring_release.installment_value
        installment_total = recurring_release.installment_times
        installment_number = recurring_release.installment_number

        # Update date_release of the recurring release
        recurring_release.date_release = date_release
        recurring_release.save()

        # Update balance and account values
        Utils.update_balance_total(balance, release_type, -installment_value)
        Utils.update_account_total(account, release_type, -installment_value)

        # Update balance and account values with the new date_release
        new_reference_date_balance = Utils.date_replace_and_add_month(date_release, 1, installment_number - 1)
        new_balance = Balance.objects.filter(account=account, reference_date=new_reference_date_balance).first()

        if new_balance is None:
            new_balance = Balance.objects.create(reference_date=new_reference_date_balance, account_id=account.id)

        Utils.update_balance_total(new_balance, release_type, installment_value)

        # Update the invoice if it exists
        if invoice:
            Utils.update_invoice_total(invoice, release_type, -installment_value)

            new_reference_date_invoice = Utils.date_replace_and_add_month(date_release, account.card.pay_date.day,
                                                                          installment_number - 1)
            new_invoice = Invoice.objects.filter(card_id=account.card.id,
                                                 reference_date=new_reference_date_invoice).first()

            if new_invoice is None:
                new_invoice = Invoice.objects.create(date_reference=new_date_reference_invoice, card_id=account.card.id,
                                                     is_paid=False)

            Utils.update_invoice_total(new_invoice, release_type, installment_value)

        # Update the balance and account with the new date_release values
        Utils.update_balance_total(new_balance, release_type, installment_value)
        Utils.update_account_total(account, release_type, installment_value)
