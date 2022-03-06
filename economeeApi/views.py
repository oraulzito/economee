import json
from datetime import datetime, date

from dateutil.relativedelta import relativedelta
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from pygments.token import Token
from rest_framework import viewsets, authentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny

from .permissions import IsObjOwner, IsAccountOwner, IsAdmin, Deny
from .serializers import *


# TODO make user delete work (delete everything related to the user, make possible to download all the data as well)
class UserView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = UserSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create' or self.action == 'check_email' or self.action == 'check_username':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        if UserView.compare_passwords(request.data.get('password'), request.data.get('repeat_password')):
            try:
                user = User.objects.create(
                    email=request.data.get('email'),
                    password=make_password(request.data.get('password')),
                    username=request.data.get('username'),
                    first_name=request.data.get('first_name'),
                    last_name=request.data.get('last_name'),
                    dob=request.data.get('dob'),
                    photo=None
                )

                account = AccountView.create_account(
                    name=request.data.get('account_name'),
                    currency_id=request.data.get('currency_id'),
                    owner=user
                )

                BalanceView.create_balance(account)

                return JsonResponse({'key': str(Token.objects.get_or_create(user=user)[0])})
            except Exception:
                return HttpResponse('Something went wrong', content_type="application/json")
        else:
            return HttpResponse('The password don\'t match', content_type="application/json")

    @classmethod
    def create_token(cls, user):
        return str(Token.objects.get_or_create(user=user)[0])

    @classmethod
    def compare_passwords(cls, password1, password2):
        return password1 == password2

    @classmethod
    def check_username(cls, username):
        return bool(User.objects.filter(username).first())

    @classmethod
    def check_email(cls, email):
        return bool(User.objects.filter(email).first())

    @action(detail=False, methods=['GET'])
    def check_username(self, request):
        return JsonResponse(
            {'username_exists': User.check_username(request.query_params.get('username'))})

    @action(detail=False, methods=['GET'])
    def check_email(self, request):
        return JsonResponse(
            {'email_exists': User.check_email(request.query_params.get('email'))})


# TODO lock delete action if it's the main account or the only account of the user.
class AccountView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]

    def get_serializer_class(self):
        if 'full' in self.request.query_params:
            return FullAccountSerializer
        else:
            return AccountSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list' or self.action == 'patch' or self.action == 'delete':
            permission_classes = [IsAccountOwner, IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return Account.objects.filter(owner=self.request.user).all()

    @action(detail=False, methods=['GET'])
    def main_account(self, request):
        account = Account.objects.filter(owner=self.request.user, is_main_account=True).first()
        account_serializer = FullAccountSerializer(account, many=False)
        return JsonResponse(account_serializer.data)

    # todo check if the user has already a main account, if it has change it
    def create(self, request, *args, **kwargs):
        account = Account.objects.create(
            name=request.data.get('name'),
            currency_id=request.data.get('currency'),
            is_main_account=request.data.get('is_main_account'),
            user=self.request.user,
        )

        return HttpResponse(account, content_type="application/json")

    @classmethod
    def create_account(cls, name, currency_id, owner):
        return Account.objects.create(
            name=name,
            currency_id=currency_id,
            is_main_account=True,
            owner=owner,
        )


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

    @classmethod
    def create_balance(cls, account, date_reference=None):
        if date_reference is None:
            date_reference = str(date.today())
            date_reference = datetime.strptime(date_reference, '%Y-%m-%d').date()
            date_reference = date_reference.replace(day=1)

        return Balance.objects.create(
            date_reference=date_reference,
            account=account
        ).save()

    @action(detail=False, methods=['GET'])
    def full_balance(self, request):
        date_reference = self.request.query_params.get('date_reference')
        balance = Balance.objects.filter(
            account__owner=self.request.user,
            date_reference=date_reference
        ).first()

        releases = RecurringRelease.objects.filter(
            balance_id=balance.id
        ).all().distinct()

        invoices = Invoice.objects.filter(
            ~Q(recurring_release__invoice_id=None),
            recurring_release__balance_id=balance.id
        ).all().distinct()

        return JsonResponse({
            'id': balance.id,
            'date_reference': balance.date_reference,
            'total_expenses': balance.total_expenses,
            'total_incomes': balance.total_incomes,
            'releases': ReleaseRRSerializer(releases, many=True).data,
            'invoices': InvoiceSerializer(invoices, many=True).data
        })


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
        return Card.objects.filter(account__owner_id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        card = Card.objects.create(
            name=self.request.data.get('name'),
            credit=self.request.data.get('credit'),
            pay_date=self.request.data.get('pay_date'),
            account_id=self.request.data.get('account_id'),
        )
        return HttpResponse(card, content_type="application/json")

    # FIXME make release category default read only


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
        return ReleaseCategory.objects.filter(Q(owner_id=self.request.user.id) | Q(owner_id=None))

    def create(self, request, *args, **kwargs):
        releaseCategory = ReleaseCategory.objects.create(name=self.request.data.get('name'),
                                                         owner_id=self.request.user.id, )
        return HttpResponse(releaseCategory, content_type="application/json")

    # FIXME make release category default read only


class RecurringReleaseView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = RecurringReleaseSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list' or self.action == 'post' or self.action == 'delete':
            permission_classes = [IsObjOwner, IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return RecurringRelease.objects.filter(balance__account__owner_id=self.request.user.id).all()

    # TODO - Update release if the date of the release change, it has to change the balance/invoice ID as well


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
            card_id = request.data.get('card_id')

            invoices = []
            balances = []

            value = float(request.data.get('value'))
            release_type = request.data.get('type')
            installment_times = int(request.data.get('installment_times')) if request.data.get(
                'installment_times') is not None else 1
            installment_value = float(request.data.get('value')) / installment_times
            date_release = self.date_to_database_format(request.data.get('date_release'))

            """CARD"""
            "Date parse - check if the release will enter in actual, next or two months ahead"
            if card_id is not None:
                if (date_release - today_date).days < 10:
                    date_release = date_release + relativedelta(months=+ 1)

            """BALANCE"""
            "Check if there's a balance created for the actual month of the release, " \
            "if it has just update the total values"
            for n in range(installment_times):
                # Balance day must always be the 1º day of the month
                date_reference_balance = self.date_replace_and_add_month(date_release, 1, n)

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
                        date_reference_invoice = self.date_replace_and_add_month(date_release, card.pay_date.day, n)

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
                value=value,
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
                date_release=date_release + relativedelta(months=+i),
                is_paid=bool(request.data.get('is_paid')) if card_id and i == 0 is not None else False,
                release=release,
                balance=balances[i],
                invoice=invoices[i] if card_id is not None else None,
            ) for i in range(installment_times)]

            RecurringRelease.objects.bulk_create(recurring_releases)

            self.update_account_total(account, release_type, installment_value)

            date_release.replace(day=1)

            rr = RecurringRelease.objects.filter(
                release_id=release.id,
                balance__date_reference=date_release
            ).first()

            return JsonResponse(ReleaseRRSerializer(rr).data)
        else:
            return HttpResponse("This account isn't yours", content_type="application/json")

    @classmethod
    def update_balance_total(cls, balance, release_type, installment_value):
        if release_type == 0:
            balance.total_expenses += installment_value
        elif release_type == 1:
            balance.total_incomes += installment_value
        balance.save()

    @classmethod
    def update_account_total(cls, account, release_type, installment_value):
        if release_type == 0:
            account.total_available -= installment_value
        elif release_type == 1:
            account.total_available += installment_value
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

    @action(detail=False, methods=['GET'])
    def monthly_graphic(self, request):
        income = []
        expense = []

        # TODO check if it`s necessary add the user id on this query
        for e in Balance.objects.raw("""
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
                                           """, [self.request.query_params.get('account_id')]):
            expense.append({'id': e.id, 'date_reference': str(e.date_reference), 'total': e.total})

        # TODO check if it`s necessary add the user id on this query
        for i in Balance.objects.raw("""
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
                        group by bal.id
                        order by bal.date_reference;
                        """, [self.request.query_params.get('account_id')]):
            income.append({'id': i.id, 'date_reference': str(i.date_reference), 'total': i.total})

        return JsonResponse({'incomes': income, 'expenses': expense})

    @action(detail=False, methods=['GET'])
    def category_graphic(self, request):
        r = []

        for e in Balance.objects.raw("""
                                select rc.id, rc.name, sum(rr.installment_value) as total
                                from "economeeApi_release" r
                                         INNER JOIN "economeeApi_recurringrelease" rr on r.id = rr.release_id
                                         INNER JOIN "economeeApi_balance" b on b.id = rr.balance_id
                                         INNER JOIN "economeeApi_account" a on a.id = %s
                                         INNER JOIN "economeeApi_releasecategory" rc on rc.id = r.category_id
                                where a.owner_id = %s
                                  and balance_id = %s
                                GROUP BY rc.id, rc.name;
                                           """,
                                     [
                                         self.request.query_params.get('account_id'),
                                         self.request.user.id,
                                         self.request.query_params.get('balance_id')
                                     ]
                                     ):
            r.append({"id": e.id, "name": e.name, "total": e.total})
        return HttpResponse(json.dumps(r))


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

        if card_id != None:
            return Invoice.objects.filter(card__account__owner=self.request.user, card_id=card_id).all()
        else:
            return Invoice.objects.filter(card__account__owner=self.request.user).all()


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
