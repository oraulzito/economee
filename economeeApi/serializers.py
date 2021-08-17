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


class ReleaseCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReleaseCategory
        fields = ['id', 'name']


class ReleaseSerializer(serializers.HyperlinkedModelSerializer):
    category = ReleaseCategorySerializer()

    class Meta:
        model = Release
        fields = [
            'id', 'description', 'value',
            'date_repeat', 'date_release',
            'installment_number', 'repeat_times',
            'is_release_paid', 'type', 'category']


class InvoiceSerializer(serializers.HyperlinkedModelSerializer):
    releases = ReleaseSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'card_id', 'date_reference', 'is_paid', 'releases']


class BalanceSerializer(serializers.HyperlinkedModelSerializer):
    invoices = InvoiceSerializer(many=True, read_only=True)
    releases = ReleaseSerializer(many=True, read_only=True)

    class Meta:
        model = Balance
        fields = ['id', 'account_id', 'date_reference', 'invoices', 'releases']


class CardSerializer(serializers.HyperlinkedModelSerializer):
    invoices = InvoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Card
        fields = ['id', 'account_id', 'name', 'credit', 'pay_date', 'invoices']


class AccountSerializer(serializers.HyperlinkedModelSerializer):
    currency = CurrencySerializer(allow_null=False)
    cards = CardSerializer(many=True, read_only=True)
    balances = BalanceSerializer(many=True, read_only=True)

    class Meta:
        model = Account
        fields = ['id', 'name', 'currency', 'is_main_account', 'cards', 'balances']
