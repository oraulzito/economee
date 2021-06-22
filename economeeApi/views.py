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
        global response
        if request.data.get('password') == request.data.get('password'):
            user = User.objects.create(
                email=request.data.get('email'),
                password=make_password(request.data.get('password')),
                username=request.data.get('username'),
                first_name=request.data.get('firstName'),
                last_name=request.data.get('lastName'),
                dob=request.data.get('dob'),
                photo=request.data.get('photo'),
                gender=request.data.get('gender'),
            )
            account = Account.objects.create(
                account_name=request.data.get('account_name'),
                total_available=float(request.data.get('total_available')),
                currency=request.data.get('currency'),
                is_main_account=True,
                owner=user,
            )
            Balance.objects.create(
                balance_month_year=PartialDate(date.today(), precision=PartialDate.MONTH),
                total_expense=0,
                total_income=float(request.data.get('total_available')),
                account_id=account.id
            )

            response = Token.objects.get_or_create(user=user)
            return HttpResponse(response, content_type="application/json")


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

    def get_queryset(self):
        return Account.objects.filter(owner=self.request.user).all()


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

    def get_queryset(self):
        return Balance.objects.filter(account__owner=self.request.user).all()


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

    def create(self, request, *args, **kwargs):
        balances = []
        installments = []
        invoices = []
        n = 0
        total = int(request.data.get('repeat_times'))

        repeat_date = datetime.strptime(request.data.get('repeat_date'), '%Y-%m-%d').date()
        repeat_date = repeat_date.replace(day=1)

        while n < total:
            precision_date = PartialDate(repeat_date + relativedelta(months=+n), precision=PartialDate.MONTH)

            invoice = Invoice()
            # If it's an card release
            if request.data.get('card_id') is not None:
                invoice = \
                    Invoice.objects.filter(card_id=int(request.data.get('card_id')),
                                           invoice_month_year=precision_date).first()
                card = Card.objects.filter(id=int(request.data.get('card_id'))).first()
                # if invoice does not exist
                if invoice is None:
                    if (repeat_date - card.card_pay_date).days < 11:
                        repeat_date = repeat_date + relativedelta(months=+ 1)
                        precision_date = PartialDate(repeat_date, precision=PartialDate.MONTH)

                    invoice = Invoice.objects.create(
                        invoice_month_year=precision_date,
                        card_id=int(request.data.get('card_id')),
                        total=float(request.data.get('value')),
                        is_invoice_paid=False
                    )
                else:
                    invoice.total = invoice.total + float(request.data.get('value'))
                    invoice.save()

            balance = Balance.objects.filter(account_id=int(request.data.get('account_id')),
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
            release_type=request.data.get('release_type'),
            is_release_paid=is_release_paid,
            release_category_id=int(request.data.get('release_category_id'))) for p in params]
        Release.objects.bulk_create(releases)

        return HttpResponse(releases, content_type="application/json")


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
