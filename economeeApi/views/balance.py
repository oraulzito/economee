from datetime import date

from django.db.models import Q
from django.http import JsonResponse
from django.utils.datetime_safe import datetime
from django_rest.permissions import IsAuthenticated
from rest_framework import viewsets, authentication
from rest_framework.decorators import action

from economeeApi.models import Balance, RecurringRelease, Invoice
from economeeApi.permissions import IsObjOwner, Deny
from economeeApi.serializers import BalanceSerializer, ReleaseRRSerializer, InvoiceSerializer


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
    def create_balance(cls, account, reference_date=None):
        if reference_date is None:
            reference_date = str(date.today())
            reference_date = datetime.strptime(reference_date, '%Y-%m-%d').date()
            reference_date = reference_date.replace(day=1)

        return Balance.objects.create(
            reference_date=reference_date,
            account=account
        ).save()

    @action(detail=False, methods=['GET'])
    def full_balance(self, request):
        reference_date = self.request.query_params.get('reference_date')
        balance = Balance.objects.filter(
            account__owner=self.request.user,
            reference_date=reference_date
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
            'reference_date': balance.reference_date,
            'total_expenses': balance.total_expenses,
            'total_incomes': balance.total_incomes,
            'releases': ReleaseRRSerializer(releases, many=True).data,
            'invoices': InvoiceSerializer(invoices, many=True).data
        })
