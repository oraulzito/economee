from django_rest.permissions import AllowAny
from rest_framework import viewsets

from economeeApi.models import Currency
from economeeApi.permissions import IsAdmin
from economeeApi.serializers import CurrencySerializer


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
