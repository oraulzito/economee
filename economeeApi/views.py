from datetime import date
from datetime import datetime

from dateutil.relativedelta import relativedelta
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from partial_date import PartialDate
from rest_framework import viewsets, authentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny

from .permissions import IsObjOwner, IsAccountOwner, Deny, IsAdmin
from .serializers import *


# Create your views here.
# FIXME make user delete work
class UserView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = UserSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        user = User
        account = Account
        balance = Balance
        if request.data.get('password') == request.data.get('repeat_password'):
            # try:
            user = User.objects.create(
                email=request.data.get('email'),
                password=make_password(request.data.get('password')),
                username=request.data.get('username'),
                first_name=request.data.get('first_name'),
                last_name=request.data.get('last_name'),
                dob=request.data.get('dob'),
                # photo=request.data.get('photo'),
            )

            account = Account.objects.create(
                name=request.data.get('account_name'),
                currency_id=request.data.get('currency_id'),
                is_main_account=True,
                user=user,
            )

            date_reference = str(date.today())
            date_reference = datetime.strptime(date_reference, '%Y-%m-%d').date()
            date_reference = date_reference.replace(day=1)
            date_reference = PartialDate(date_reference)

            balance = Balance.objects.create(
                date_reference=date_reference,
                account=account
            )
            return JsonResponse({'key': str(Token.objects.get_or_create(user=user)[0])})
            # except Exception:
            #     return HttpResponse('Something went wrong', content_type="application/json")
        else:
            return HttpResponse('The password don\'t match', content_type="application/json")


# TODO test CRUD
# TODO lock delete action if it's the main account or the only account of the user.
class AccountView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = AccountSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list' or self.action == 'patch' or self.action == 'delete':
            permission_classes = [IsAccountOwner, IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user.id).all()

    def create(self, request, *args, **kwargs):
        account = Account.objects.create(
            name=request.data.get('name'),
            currency_id=request.data.get('currency'),
            is_main_account=request.data.get('is_main_account'),
            user=self.request.user,
        )

        return HttpResponse(account, content_type="application/json")


# TODO test CRUD
class BalanceView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = BalanceSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list':
            permission_classes = [IsObjOwner, IsAuthenticated]
        elif self.action == 'post' or self.action == 'delete':
            permission_classes = [Deny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.request.data.get('date_reference') is not None:
            date_reference = datetime.strptime(self.request.data.get('date_reference'), '%Y-%m-%d').date()
            date_reference = date_reference.replace(day=1)
            date_reference = PartialDate(date_reference)
            # FIXME return only the object, not an array
            return Balance.objects.filter(id=self.get_object().id,
                                          date_reference=date_reference).all()
        else:
            return Balance.objects.filter(account__user=self.request.user.id).all()

    def create(self, request, *args, **kwargs):
        #  CHECK IF THE USER IT's THE ACCOUNT OWNER
        account = Account.objects.filter(id=int(request.data.get('account_id')), user_id=request.user.id).first()
        if account:
            date_reference = datetime.strptime(self.request.data.get('date_reference'), '%Y-%m-%d').date()
            date_reference = date_reference.replace(day=1)
            date_reference = PartialDate(date_reference)

            balanceExists = Balance.objects.filter(account_id=self.request.data.get('account_id'),
                                                   date_reference=date_reference).first()

            if balanceExists is None and balanceExists != False:
                balance = Balance.objects.create(
                    date_reference=date_reference,
                    account_id=self.request.data.get('account_id'),
                )
                return HttpResponse(balance, content_type="application/json")
            else:
                return HttpResponse("Your user already has a balance for this month", content_type="application/json")
        else:
            return HttpResponse('This account isn\`t yours', content_type="application/json")


# TODO test CRUD
class CardView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = CardSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list' or self.action == 'post' or self.action == 'delete':
            permission_classes = [IsObjOwner, IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return Card.objects.filter(account__user_id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        card = Card.objects.create(
            name=self.request.data.get('name'),
            credit=self.request.data.get('credit'),
            pay_date=self.request.data.get('pay_date'),
            account_id=self.request.data.get('account_id'),
        )
        return HttpResponse(card, content_type="application/json")


# FIXME make release category read only
class ReleaseCategoryView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = ReleaseCategorySerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list' or self.action == 'post' or self.action == 'delete':
            permission_classes = [IsObjOwner, IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return ReleaseCategory.objects.filter(Q(user_id=self.request.user.id) | Q(user_id=None))

    def create(self, request, *args, **kwargs):
        releaseCategory = ReleaseCategory.objects.create(name=self.request.data.get('name'),
                                                         user_id=self.request.user.id, )
        return HttpResponse(releaseCategory, content_type="application/json")


# FIXME if the date change it has to change the balance/invoice ID as well
class ReleaseView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = ReleaseSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list' or self.action == 'post' or self.action == 'delete':
            permission_classes = [IsObjOwner, IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        date_reference = self.request.query_params.get('date_reference')
        month_by_month = self.request.query_params.get('month_by_month')
        balance_id = self.request.query_params.get('balance_id')
        invoice_id = self.request.query_params.get('invoice_id')
        category_id = self.request.query_params.get('category_id')

        # Get ALL releases of a month
        if date_reference is not None:
            date_reference_init = datetime.strptime(date_reference, '%Y-%m-%d').replace(day=1).date()

            if date_reference_init.month == 2:
                date_reference_final = datetime.strptime(date_reference, '%Y-%m-%d').replace(day=28).date()
            elif date_reference_init.month in {1, 3, 5, 7, 8, 10, 12}:
                date_reference_final = datetime.strptime(date_reference, '%Y-%m-%d').replace(day=31).date()
            else:
                date_reference_final = datetime.strptime(date_reference, '%Y-%m-%d').replace(day=30).date()

            return Release.objects.filter(
                Q(invoice__card__account__user=self.request.user) | Q(balance__account__user=self.request.user),
                date_release__range=(date_reference_init, date_reference_final)).all()
            # elif month_by_month is not None:
            # TODO Gabriel Queries
            # Description at:
            # https://trello.com/c/Sm11PuHO/25-cria%C3%A7%C3%A3o-de-queries-para-gr%C3%A1ficos-de-lan%C3%A7amentos-e-gastos
            # elif releases_by_category is not None:
            # TODO Gabriel Queries
            # Description at:
            # https://trello.com/c/Sm11PuHO/25-cria%C3%A7%C3%A3o-de-queries-para-gr%C3%A1ficos-de-lan%C3%A7amentos-e-gastos
        elif balance_id is not None:
            # Get releases of a specific balance
            return Release.objects.filter(
                balance__account__user=self.request.user,
                balance_id=balance_id).all()
        elif invoice_id is not None:
            # Get releases of a specific invoice
            return Release.objects.filter(invoice__card__account__user=self.request.user, invoice_id=invoice_id).all()
        elif category_id is not None:
            # Get releases of specific category
            return Release.objects.filter(
                Q(invoice__card__account__user=self.request.user) | Q(balance__account__user=self.request.user),
                category_id=invoice_id).all()
        else:
            # Get all releases
            return Release.objects.filter(
                Q(invoice__card__account__user=self.request.user) | Q(balance__account__user=self.request.user)).all()

    # FIXME if date_repeat is not sent use date_release
    def create(self, request, *args, **kwargs):
        card_id = request.data.get('card_id')
        account_id = request.data.get('account_id')

        #  CHECK IF THE USER IT's THE ACCOUNT OWNER
        account = Account.objects.filter(id=account_id, user_id=request.user.id).first()

        if account:
            card = None
            pay_date = datetime
            date_reference_invoice = datetime
            invoices = []
            balances = []
            installments = []
            repeat_times = int(request.data.get('repeat_times'))

            # Change date repeat to STR, to then change the day to the correct invoice and balance day
            date_repeat = datetime.strptime(request.data.get('date_repeat'), '%Y-%m-%d').date()
            date_release = datetime.strptime(request.data.get('date_release'), '%Y-%m-%d').date()

            # If it's an card release
            if card_id is not None:
                # check if the card is from user, and if it exists
                card = Card.objects.filter(id=card_id, account=account).first()

                if card is not None:
                    # format the pay date to datetime and replace the release day to the invoice pay date
                    pay_date = datetime.strptime(str(card.pay_date), '%Y-%m-%d').date()
                    pay_date = pay_date.replace(month=datetime.now().month)
                else:
                    return HttpResponse('This card isn\`t yours', content_type="application/json")

            repeat_times_balance = repeat_times
            if card_id:
                if (date_repeat - pay_date).days < 10:
                    repeat_times_balance = repeat_times + 2
                else:
                    repeat_times_balance = repeat_times + 1

            for n in range(repeat_times_balance):
                """BALANCE"""
                # add the month
                # Balance day must always be the 1º day of the month
                date_reference_balance = date_release.replace(day=1)
                date_reference_balance = PartialDate(date_reference_balance + relativedelta(months=+n))

                # check if there's an balance already created for that month
                balance = Balance.objects.filter(account=account, date_reference=date_reference_balance).first()

                # If balance does not exist, create a new one with the value, else just add the expense or
                # income value
                if balance is None:
                    balance = Balance.objects.create(
                        date_reference=date_reference_balance,
                        account_id=int(request.data.get('account_id'))
                    )
                    balance.save()

                balances.append(balance)
                installments.append(n + 1)

            # Card releases, create or add values to the invoice
            if card is not None:
                """INVOICE"""
                # check if there's a invoice already created for that month
                # if the purchase is done 10 days before the pay date the release will just be released 40 days
                # after (or the next next invoice)
                if (pay_date - date_release).days < 10:
                    date_reference_invoice = date_release.replace(day=pay_date.day)
                    date_reference_invoice = PartialDate(date_reference_invoice + relativedelta(months=+2))
                    date_release = date_release + relativedelta(months=+2)
                    date_repeat = date_repeat + relativedelta(months=+2)
                else:
                    date_reference_invoice = date_release.replace(day=pay_date.day)
                    date_reference_invoice = PartialDate(date_reference_invoice + relativedelta(months=+1))
                    date_release = date_release + relativedelta(months=+1)
                    date_repeat = date_repeat + relativedelta(months=+1)

                for n in range(repeat_times):
                    date_reference_invoice.MONTH = + n

                    invoice = Invoice.objects.filter(card_id=card_id,
                                                     date_reference=date_reference_invoice).first()

                    if invoice is None:
                        # if invoice does not exist, create a new one
                        invoice = Invoice.objects.create(
                            date_reference=date_reference_invoice,
                            card_id=int(card_id),
                            is_paid=False,
                            balance=balances[n]
                        )
                        invoice.save()
                    invoices.append(invoice)

            # Create the release
            releases = [Release(
                description=request.data.get('description'),
                place=request.data.get('place'),
                value=float(request.data.get('value')),
                value_installment=float(request.data.get('value')) / repeat_times,
                date_creation=datetime.now(),
                date_release=date_release + relativedelta(months=+i),
                # TODO if date_repeat is different than date_release it has to have a code adjusment
                date_repeat=date_repeat + relativedelta(months=+i + 2),
                repeat_times=int(request.data.get('repeat_times')),
                installment_number=i + 1,
                type=request.data.get('type'),
                is_release_paid=bool(request.data.get('is_release_paid')),
                category_id=int(request.data.get('category_id')),
                balance=balances[i] if card_id is None else None,
                invoice=invoices[i] if card_id is not None else None
            ) for i in range(repeat_times)]

            created_releases = Release.objects.bulk_create(releases)

            return HttpResponse(created_releases, content_type="application/json")
        else:
            return HttpResponse('This account isn\`t yours', content_type="application/json")


# TODO test CRUD
class InvoiceView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = InvoiceSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list':
            permission_classes = [IsObjOwner, IsAuthenticated]
        elif self.action == 'post' or self.action == 'delete':
            permission_classes = [Deny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        card_id = self.request.query_params.get('card_id')

        if card_id is not None:
            return Invoice.objects.filter(card__account__user=self.request.user, card_id=card_id).all()
        else:
            return Invoice.objects.filter(card__account__user=self.request.user).all()


class CurrencyView(viewsets.ModelViewSet):
    serializer_class = CurrencySerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'list':
            permission_classes = [AllowAny]
        elif self.action == 'create' or self.action == 'post' or self.action == 'delete':
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return Currency.objects.all()
