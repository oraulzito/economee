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


class AccountSerializer(serializers.HyperlinkedModelSerializer):
    owner = UserSerializer(allow_null=True)

    class Meta:
        model = Account
        fields = ['id', 'name', 'currency', 'is_main_account', 'id_user']


class BalanceSerializer(serializers.HyperlinkedModelSerializer):
    account = AccountSerializer(allow_null=True)

    class Meta:
        model = Balance
        fields = ['id', 'date_reference', 'id_account']


class CardSerializer(serializers.HyperlinkedModelSerializer):
    account = AccountSerializer(allow_null=True)

    class Meta:
        model = Card
        fields = ['id', 'name', 'credit', 'credit_spent', 'pay_date', 'id_account']


class ReleaseCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReleaseCategory
        fields = ['name', 'id']


class InvoiceSerializer(serializers.HyperlinkedModelSerializer):
    card = CardSerializer(allow_null=True)

    class Meta:
        model = Invoice
        fields = ['id', 'total', 'date_reference', 'is_paid', 'id_card']


class ReleaseSerializer(serializers.HyperlinkedModelSerializer):
    release_category = ReleaseCategorySerializer()

    class Meta:
        model = Release
        fields = [
            'id', 'description', 'value', 'date_release', 'repeat_times', 'date_repeat', 'repeat_times',
            'is_release_paid', 'type', 'category']


class CurrencySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Currency
        fields = ['country', 'currency', 'code', 'symbol']
