from django.contrib.auth.hashers import make_password
from django.http import JsonResponse, HttpResponse
from django_rest.permissions import IsAuthenticated, AllowAny
from economeeApi.views.account import AccountView
from economeeApi.views.balance import BalanceView
from jinja2.lexer import Token
from rest_framework import viewsets, authentication
from rest_framework.decorators import action

# TODO make user delete work (delete everything related to the user, make possible to download all the data as well)
from economeeApi.models import User
from economeeApi.serializers import UserSerializer


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
