# serializers.py
from rest_framework import serializers

from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username', 'dob', 'first_name', 'last_name']
        # fields = ['email', 'username', 'photo', 'dob', 'first_name', 'last_name']


class CurrencySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Currency
        fields = ['id', 'country', 'currency', 'code', 'symbol']


class ReleaseCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReleaseCategory
        fields = ['id', 'name', 'color']


class ReleaseSerializer(serializers.HyperlinkedModelSerializer):
    category = ReleaseCategorySerializer()

    class Meta:
        model = Release
        fields = [
            'id', 'description', 'value', 'place',
            'date_repeat', 'date_release',
            'installment_number', 'repeat_times',
            'is_release_paid', 'type', 'category', 'balance_id', 'invoice_id']


class InvoiceSerializer(serializers.HyperlinkedModelSerializer):
    releases = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'card_id', 'date_reference', 'is_paid', 'releases']


class BalanceSerializer(serializers.HyperlinkedModelSerializer):
    invoices = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    releases = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Balance
        fields = ['id', 'account_id', 'date_reference', 'invoices', 'releases']


class CardSerializer(serializers.HyperlinkedModelSerializer):
    invoices = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Card
        fields = ['id', 'account_id', 'name', 'credit', 'pay_date', 'invoices']


class AccountSerializer(serializers.HyperlinkedModelSerializer):
    currency = CurrencySerializer(allow_null=False)
    cards = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    balances = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Account
        fields = ['id', 'name', 'currency', 'is_main_account', 'cards', 'balances']
