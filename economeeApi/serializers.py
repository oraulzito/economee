# serializers.py
from rest_framework import serializers

from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'photo', 'dob', 'first_name', 'last_name', 'gender', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }


class AccountSerializer(serializers.HyperlinkedModelSerializer):
    owner = UserSerializer(allow_null=True)

    class Meta:
        model = Account
        fields = ['id', 'account_name', 'total_available', 'currency', 'is_main_account', 'owner']


class BalanceSerializer(serializers.HyperlinkedModelSerializer):
    account = AccountSerializer(allow_null=True)

    class Meta:
        model = Balance
        fields = ['id', 'balance_month_year', 'total_income', 'total_expense', 'account']


class CardSerializer(serializers.HyperlinkedModelSerializer):
    account = AccountSerializer(allow_null=True)

    class Meta:
        model = Card
        fields = ['id', 'card_name', 'card_credit', 'card_credit_spent', 'card_pay_date', 'account']


class ReleaseCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReleaseCategory
        fields = ['category_name', 'id']


class InvoiceSerializer(serializers.HyperlinkedModelSerializer):
    card = CardSerializer(allow_null=True)

    class Meta:
        model = Invoice
        fields = ['id', 'total', 'invoice_month_year', 'is_invoice_paid', 'card']


class ReleaseSerializer(serializers.HyperlinkedModelSerializer):
    release_category = ReleaseCategorySerializer()

    class Meta:
        model = Release
        fields = [
            'id', 'description', 'value', 'date_release', 'repeat_times', 'repeat_date', 'repeat_times',
            'is_release_paid', 'release_type', 'release_category', 'invoice_id', 'balance_id']
