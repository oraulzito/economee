from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.utils.datetime_safe import datetime
from django_rest.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets, authentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action

# TODO make user delete work (delete everything related to the user, make possible to download all the data as well)
from economeeApi.models import User
from economeeApi.serializers import UserSerializer
from economeeApi.utils import Utils
from economeeApi.views.account import AccountView
from economeeApi.views.balance import BalanceView


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
            # try:
            user = User.objects.create(
                email=request.data.get('email'),
                password=make_password(request.data.get('password')),
                username=request.data.get('username'),
                first_name=request.data.get('first_name'),
                last_name=request.data.get('last_name'),
                dob=Utils.date_to_database_format(request.data.get('dob'))
            )

            account = AccountView.create_account(
                name=request.data.get('account_name'),
                currency_id=request.data.get('currency_id'),
                owner=user
            )

            BalanceView.create_balance(account, datetime.now())

            return JsonResponse({'key': str(Token.objects.get_or_create(user=user)[0])})
        # except Exception:
        #     return HttpResponse('Something went wrong', content_type="application/json")
        else:
            return JsonResponse('The password don\'t match', content_type="application/json", code=400)

    @action(detail=False, methods=['GET'])
    # check if username is available
    def check_username(self, request):
        username = self.request.query_params.get('username')
        return JsonResponse({'available': self.is_username_in_use(username)})

    @action(detail=False, methods=['GET'])
    # check if email is available
    def check_email(self, request):
        email = self.request.query_params.get('email')
        return JsonResponse({'available': self.is_email_in_use(email)})

    @classmethod
    def create_token(cls, user):
        return str(Token.objects.get_or_create(user=user)[0])

    @classmethod
    def compare_passwords(cls, password1, password2):
        return password1 == password2

    # check if username is already in use
    @classmethod
    def is_username_in_use(cls, username):
        return not User.objects.filter(username=username).exists()

    @classmethod
    def is_email_in_use(cls, email):
        return not User.objects.filter(email=email).exists()
