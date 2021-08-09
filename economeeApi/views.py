from datetime import date
from datetime import datetime

from dateutil.relativedelta import relativedelta
from django.contrib.auth.hashers import make_password
from django.http import HttpResponse
from partial_date import PartialDate
from rest_framework import viewsets, authentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny

from .permissions import IsOwner, IsObjOwner, IsAccountOwner
from .serializers import *


# Create your views here.
# TODO test CRUD
class UserView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = UserSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsOwner]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        # global response
        if request.data.get('password') == request.data.get('repeat_password'):
            user = User.objects.create(
                email=request.data.get('email'),
                password=make_password(request.data.get('password')),
                username=request.data.get('username'),
                first_name=request.data.get('first_name'),
                last_name=request.data.get('last_name'),
                dob=request.data.get('dob'),
                photo=request.data.get('photo'),
                gender=request.data.get('gender'),
            )
            account = Account.objects.create(
                name=request.data.get('account_name'),
                currency=request.data.get('currency'),
                total_available=request.data.get('total_available'),
                is_main_account=True,
                id_user=user,
            )
            Balance.objects.create(
                date_reference=PartialDate(date.today(), precision=PartialDate.MONTH),
                total_expense=0.0,
                total_income=0.0,
                id_account=account
            )

            response = Token.objects.get_or_create(user=user)
            return HttpResponse(response, content_type="application/json")


# TODO test CRUD
# TODO lock delete action if it's the main account or the only account of the user.
class AccountView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = AccountSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list' or self.action == 'post' or self.action == 'delete':
            permission_classes = [IsAccountOwner, IsAuthenticated]
        return [permission() for permission in permission_classes]

    # FIXME Adjust return, remove boolean flag when http code 200
    def get_queryset(self):
        return Account.objects.filter(owner=self.request.user).all()


# TODO test CRUD
class BalanceView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = BalanceSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list' or self.action == 'post' or self.action == 'delete':
            permission_classes = [IsObjOwner, IsAuthenticated]
        return [permission() for permission in permission_classes]

    # FIXME get only the balance of the required month
    def get_queryset(self):
        return Balance.objects.filter(account_id_user=self.request.user).all()


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
        return Card.objects.filter(account__owner=self.request.user)


# TODO test CRUD
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
        return ReleaseCategory.objects.filter(owner=self.request.user)


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
        precision_date = self.request.query_params.get('month_year_view')

        if precision_date is not None and precision_date != '':
            precision_date = datetime.strptime(precision_date, '%Y-%m').date()
            precision_date = precision_date.replace(day=1)
            precision_date = PartialDate(precision_date, precision=PartialDate.MONTH)
            balance = Balance.objects.filter(account__owner=self.request.user, balance_month_year=precision_date).all()
        else:
            balance = Balance.objects.filter(account__owner=self.request.user).all()

        return Release.objects.filter(balance__in=balance).all()

    # FIXME
    def create(self, request, *args, **kwargs):
        balances = []
        installments = []
        invoices = []
        n = 0
        total = int(request.data.get('repeat_times'))

        repeat_date = datetime.strptime(request.data.get('date_repeat'), '%Y-%m-%d').date()
        repeat_date = repeat_date.replace(day=1)

        while n < total:
            # credit card shopping releases will be released only in the next month after the shopping
            precision_date = PartialDate(repeat_date + relativedelta(months=+n), precision=PartialDate.MONTH)

            invoice = Invoice()
            # If it's an id_card release
            if request.data.get('id_card') is not None:
                invoice = \
                    Invoice.objects.filter(card_id=int(request.data.get('id_card')),
                                           invoice_month_year=precision_date).first()
                # FIXME if the card don't exist send a 400 error
                card = Card.objects.filter(id=int(request.data.get('id_card'))).first()
                # if invoice does not exist
                if invoice is None:
                    # if the purchase is done in the last billing day of the month the release will be done only in the next next month
                    if (repeat_date - card.pay_date).days < 10:
                        repeat_date = repeat_date + relativedelta(months=+ 1)
                        precision_date = PartialDate(repeat_date, precision=PartialDate.MONTH)

                    invoice = Invoice.objects.create(
                        invoice_month_year=precision_date,
                        card_id=int(request.data.get('id_card')),
                        total=float(request.data.get('value')),
                        is_invoice_paid=False
                    )
                else:
                    invoice.total = invoice.total + float(request.data.get('value'))
                    invoice.save()

            balance = Balance.objects.filter(account_id=int(request.data.get('id_account')),
                                             balance_month_year=precision_date).first()
            # If balance does not exist
            if balance is None:
                balance = Balance.objects.create(
                    balance_month_year=precision_date,
                    total_expense=float(request.data.get('value')),
                    total_income=0,
                    account_id=int(request.data.get('account_id'))
                )
            else:
                # FIXME add the earned value or the expense value
                balance.total_expense = balance.total_expense + float(request.data.get('value'))
                balance.save()

            balances.append(balance)
            invoices.append(invoice)
            installments.append(n + 1)
            n = n + 1

        params = zip(balances, invoices, installments)

        date_release = datetime.strptime(request.data.get('date_release'), '%Y-%m-%d').date()
        if date_release != repeat_date:
            is_release_paid = False
        else:
            is_release_paid = bool(request.data.get('is_release_paid'))

        releases = [Release(
            balance=p[0],
            invoice=p[1],
            description=request.data.get('description'),
            value=float(request.data.get('value')),
            date_release=date_release,
            repeat_date=date_release + relativedelta(months=+p[2]),
            repeat_times=int(request.data.get('repeat_times')),
            installment_number=p[2],
            release_type=request.data.get('type'),
            is_release_paid=is_release_paid,
            release_category_id=int(request.data.get('release_category_id'))) for p in params]
        Release.objects.bulk_create(releases)

        return HttpResponse(releases, content_type="application/json")


# TODO test CRUD
class InvoiceView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = InvoiceSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list' or self.action == 'post' or self.action == 'delete':
            permission_classes = [IsObjOwner, IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return Invoice.objects.filter(card__account__owner=self.request.user).all()


class CurrencyView(viewsets.ModelViewSet):
    serializer_class = CurrencySerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'list':
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return Currency.objects.all()
