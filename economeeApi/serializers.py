# serializers.py
from rest_framework import serializers

from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'photo', 'dob', 'first_name', 'last_name', 'gender', 'password']
        # TODO review if this don't make password changes unavailable
        extra_kwargs = {
            'password': {'write_only': True},
        }


class CurrencySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Currency
        fields = ['country', 'currency', 'code', 'symbol']


class AccountSerializer(serializers.HyperlinkedModelSerializer):
    currency = CurrencySerializer(allow_null=False)

    class Meta:
        model = Account
        fields = ['id', 'name', 'currency', 'is_main_account']


class BalanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Balance
        fields = ['id', 'date_reference', 'total_income', 'total_expense', 'account_id']


class CardSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'name', 'credit', 'credit_spent', 'pay_date', 'account_id']


class ReleaseCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReleaseCategory
        fields = ['name', 'id']


class InvoiceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Invoice
        fields = ['id', 'total', 'date_reference', 'is_paid', 'card_id']


class ReleaseSerializer(serializers.HyperlinkedModelSerializer):
    category = ReleaseCategorySerializer()

    class Meta:
        model = Release
        fields = [
            'id', 'description', 'value', 'date_release',
            'installment_number', 'date_repeat', 'repeat_times',
            'is_release_paid', 'type', 'category']
