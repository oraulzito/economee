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
                user=user,
            )
            Balance.objects.create(
                date_reference=PartialDate(date.today(), precision=PartialDate.MONTH),
                total_expense=0.0,
                total_income=0.0,
                account=account
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
        return Account.objects.filter(user=self.request.user.id).all()

    def create(self, request, *args, **kwargs):
        account = Account.objects.create(
            name=request.data.get('name'),
            currency_id=request.data.get('currency'),
            total_available=request.data.get('total_available'),
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
        elif self.action == 'list' or self.action == 'post' or self.action == 'delete':
            permission_classes = [IsObjOwner, IsAuthenticated]
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
            return Balance.objects.filter(id=self.get_object().id,).all()

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
                    total_expense=self.request.data.get('total_expense'),
                    total_income=self.request.data.get('total_income'),
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
        return Card.objects.filter(account__user=self.request.user)

    def create(self, request, *args, **kwargs):
        card = Card.objects.create(
            name=self.request.data.get('name'),
            credit=self.request.data.get('credit'),
            credit_spent=self.request.data.get('credit_spent'),
            pay_date=self.request.data.get('pay_date'),
            account_id=self.request.data.get('account_id'),
        )
        return HttpResponse(card, content_type="application/json")


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
        return ReleaseCategory.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        releaseCategory = ReleaseCategory.objects.create(name=self.request.data.get('name'),
                                                         user_id=self.request.user.id)
        return HttpResponse(releaseCategory, content_type="application/json")


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
        date_release = self.request.query_params.get('month_year_view')

        # if date_release is not None and date_release != '':
        #     date_release = datetime.strptime(date_release, '%Y-%m').date()
        #     date_release = date_release.replace(day=1)
        #     date_release = PartialDate(date_release, precision=PartialDate.MONTH)
        #
        # else:
        #     balance = Balance.objects.filter(account__user=self.request.user.id).all()

        return Release.objects.all()

    # FIXME
    def create(self, request, *args, **kwargs):
        card_id = request.data.get('card_id')
        account_id = request.data.get('account_id')

        #  CHECK IF THE USER IT's THE ACCOUNT OWNER
        account = Account.objects.filter(id=account_id, user_id=request.user.id).first()

        if account:
            card = None
            pay_date = datetime
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
                else:
                    return HttpResponse('This card isn\`t yours', content_type="application/json")

            for n in range(repeat_times):

                """INVOICE"""
                invoice = Invoice()
                # Card releases, create or add values to the invoice
                if card is not None:

                    # check if there's a invoice already created for that month
                    date_reference_invoice = date_release.replace(day=pay_date.day)

                    if (date_repeat - pay_date).days < 10:
                        # if the purchase is done 10 days before the pay date the release will just be released 40 days
                        # after (or the next next invoice)
                        date_reference_invoice = date_reference_invoice + relativedelta(months=+ 2)
                    else:
                        date_reference_invoice = date_reference_invoice + relativedelta(months=+ 1)

                    date_reference_invoice = PartialDate(date_reference_invoice, precision=PartialDate.MONTH)
                    invoice = Invoice.objects.filter(card_id=card_id, date_reference=date_reference_invoice).first()

                    if invoice is not None:
                        # if invoice exist, just add or remove the value from it
                        if request.data.get('type') == 'ER':
                            # If it's an expanse
                            invoice.total = invoice.total + float(request.data.get('value'))
                        elif request.data.get('type') == 'IR':
                            # If it's an restitution
                            invoice.total = invoice.total - float(request.data.get('value'))
                        invoice.save()
                    else:
                        # if invoice does not exist, create a new one
                        invoice = Invoice.objects.create(
                            date_reference=date_reference_invoice,
                            card_id=int(card_id),
                            total=float(request.data.get('value')),
                            is_paid=False
                        )

                """BALANCE"""
                # check if there's an balance already created for that month
                date_reference_balance = date_release.replace(day=1)

                # Balance day must always be the 1º day of the month
                date_reference_balance = PartialDate(date_reference_balance + relativedelta(months=+n),
                                                     precision=PartialDate.MONTH)

                balance = Balance.objects.filter(account=account, date_reference=date_reference_balance).first()

                # If balance does not exist, create a new one with the value, else just add the expense or
                # income value
                if balance is not None:
                    if request.data.get('type') == 'ER':
                        balance.total_expense = balance.total_expense + float(request.data.get('value'))
                    elif request.data.get('type') == 'IR':
                        balance.total_income = balance.total_income + float(request.data.get('value'))
                    balance.save()
                else:
                    balance = Balance.objects.create(
                        date_reference=date_reference_balance,
                        total_expense=float(request.data.get('value')) if request.data.get('type') == 'ER' else 0.0,
                        total_income=float(request.data.get('value')) if request.data.get('type') == 'IR' else 0.0,
                        account_id=int(request.data.get('account_id'))
                    )

                balances.append(balance)
                invoices.append(invoice)
                installments.append(n + 1)

            # Create the release
            releases = [Release(
                description=request.data.get('description'),
                value=float(request.data.get('value')),
                date_release=date_release + relativedelta(months=+i) if repeat_times > 1 else date_release,
                date_repeat=date_repeat + relativedelta(months=+i) if repeat_times > 1 else date_repeat,
                repeat_times=int(request.data.get('repeat_times')),
                installment_number=i,
                type=request.data.get('type'),
                is_release_paid=bool(request.data.get('is_release_paid')),
                category_id=int(request.data.get('category_id'))) for i in installments]

            created_releases = Release.objects.bulk_create(releases)

            #  Create the relationships between releases, invoices or balances
            if card is not None:
                ir = [InvoiceRelease(
                    release_id=created_releases[index].id,
                    invoice_id=invoices[index].id
                ) for index in range(repeat_times)]

                bi = [BalanceInvoice(
                    balance_id=balances[index].id,
                    invoice_id=invoices[index].id
                ) for index in range(repeat_times) if (BalanceInvoice.objects.filter(balance_id=balances[index].id,
                                                                                     invoice_id=invoices[
                                                                                         index].id).first() is None)]

                if ir is not None:
                    InvoiceRelease.objects.bulk_create(ir)

                if bi is not None:
                    BalanceInvoice.objects.bulk_create(bi)
            else:
                br = [BalanceRelease(
                    release_id=created_releases[index].id,
                    balance_id=balances[index].id
                ) for index in range(repeat_times)]
                if br is not None:
                    BalanceRelease.objects.bulk_create(br)

            return HttpResponse(releases, content_type="application/json")
        else:
            return HttpResponse('This account isn\`t yours', content_type="application/json")

    def destroy(self, request, *args, **kwargs):
        account = Account.objects.filter(id=int(request.data.get('account_id')), user_id=request.user.id).first()
        if account:
            release_id = int(self.get_object().id)
            release = Release.objects.filter(id=release_id).first()

            balanceRelease = BalanceRelease.objects.filter(release_id=release_id).first()
            if balanceRelease is not None:
                balance = Balance.objects.filter(id=balanceRelease.balance_id).first()
                if release.type == 'ER':
                    balance.total_expense = balance.total_expense - release.value
                elif release.type == 'IR':
                    balance.total_income = balance.total_income - release.value
                balance.save()

            releaseInvoice = InvoiceRelease.objects.filter(release_id=release_id).first()
            if releaseInvoice is not None:
                invoice = Invoice.objects.filter(id=releaseInvoice.invoice_id).first()
                invoice.total = invoice.total - release.value
                invoice.save()

            release.delete()
            return HttpResponse(1, content_type="application/json")
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
        elif self.action == 'list' or self.action == 'post' or self.action == 'delete':
            permission_classes = [IsObjOwner, IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return Invoice.objects.filter(card__account__user=self.request.user.id).all()


class CurrencyView(viewsets.ModelViewSet):
    serializer_class = CurrencySerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'list':
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return Currency.objects.all()
