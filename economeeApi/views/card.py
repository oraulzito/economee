from django.http import HttpResponse
from django_rest.permissions import IsAuthenticated
from rest_framework import viewsets, authentication

from economeeApi.models import Card
from economeeApi.permissions import IsObjOwner
from economeeApi.serializers import CardSerializer


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
