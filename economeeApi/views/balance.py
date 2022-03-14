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
