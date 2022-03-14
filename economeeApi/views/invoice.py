from django_rest.permissions import IsAuthenticated
from rest_framework import viewsets, authentication

from economeeApi.models import Invoice
from economeeApi.permissions import IsObjOwner, Deny
from economeeApi.serializers import InvoiceSerializer


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
