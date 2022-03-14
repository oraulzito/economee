# TODO lock delete action if it's the main account or the only account of the user.
from django.http import JsonResponse, HttpResponse
from django_rest.permissions import IsAuthenticated
from rest_framework import viewsets, authentication
from rest_framework.decorators import action

from economeeApi.models import Account
from economeeApi.permissions import IsAccountOwner
from economeeApi.serializers import FullAccountSerializer, AccountSerializer


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
