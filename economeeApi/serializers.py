# serializers.py
from rest_framework import serializers

from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'dob', 'first_name', 'last_name']


class CurrencySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Currency
        fields = ['id', 'country', 'currency', 'code', 'symbol']


class ReleaseCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReleaseCategory
        fields = ['id', 'name', 'color', 'owner_id']


class AccountSerializer(serializers.HyperlinkedModelSerializer):
    currency = CurrencySerializer(allow_null=False)

    class Meta:
        model = Account
        fields = ['id', 'name', 'total_available', 'currency', 'is_main_account']


class BalanceSerializer(serializers.HyperlinkedModelSerializer):
    reference_date = serializers.DateField()

    class Meta:
        model = Balance
        fields = ['id', 'reference_date', 'total_expenses', 'total_incomes', 'account_id']


class CardSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'name', 'credit', 'pay_date', 'account_id']


class InvoiceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Invoice
        fields = ['id', 'reference_date', 'total_value', 'card_id', 'is_paid']


class RecurringReleaseSerializer(serializers.HyperlinkedModelSerializer):
    date_release = serializers.DateField()

    class Meta:
        model = RecurringRelease
        fields = [
            'is_paid',
            'date_release',
            'installment_times',
            'installment_number',
            'installment_value',
            'release_id',
            'balance_id',
            'invoice_id'
        ]


class ReleaseSerializer(serializers.HyperlinkedModelSerializer):
    recurring_release = RecurringReleaseSerializer()

    class Meta:
        model = Release
        fields = [
            'id',
            'type',
            'value',
            'place',
            'description',
            'date_creation',
            'category_id',
            'recurring_release',
        ]


class ReleaseRRSerializer(serializers.HyperlinkedModelSerializer):
    release_id = serializers.PrimaryKeyRelatedField(source='release.id', read_only=True)
    type = serializers.IntegerField(source='release.type', read_only=True)
    value = serializers.FloatField(source='release.value', read_only=True)
    place = serializers.StringRelatedField(source='release.place', read_only=True)
    description = serializers.StringRelatedField(source='release.description', read_only=True)
    date_creation = serializers.DateField(source='release.date_creation', read_only=True)
    category_id = serializers.StringRelatedField(source='release.category_id', read_only=True)

    class Meta:
        model = RecurringRelease
        fields = [
            'id',
            'release_id',
            'type',
            'value',
            'place',
            'description',
            'date_creation',
            'category_id',
            'is_paid',
            'date_release',
            'installment_times',
            'installment_number',
            'installment_value',
            'balance_id',
            'invoice_id'
        ]


class BalanceReleasesSerializer(serializers.HyperlinkedModelSerializer):
    reference_date = serializers.DateField()
    releases = ReleaseSerializer(many=True)

    class Meta:
        model = Balance
        fields = ['id', 'reference_date', 'total_expenses', 'total_incomes', 'releases']


class InvoiceReleasesSerializer(serializers.HyperlinkedModelSerializer):
    reference_date = serializers.DateField()
    releases = RecurringReleaseSerializer(many=True)

    class Meta:
        model = Invoice
        fields = ['id', 'reference_date', 'is_paid', 'card_id', 'releases']


class FullBalanceSerializer(serializers.HyperlinkedModelSerializer):
    reference_date = serializers.DateField()
    releases = ReleaseSerializer(many=True)
    invoices = InvoiceReleasesSerializer(many=True)

    class Meta:
        model = Balance
        fields = ['id', 'reference_date', 'total_expenses', 'total_incomes', 'releases', 'invoices']


class FullAccountSerializer(serializers.HyperlinkedModelSerializer):
    balances = BalanceSerializer(many=True)
    cards = CardSerializer(many=True)
    currency = CurrencySerializer(allow_null=False)

    class Meta:
        model = Account
        fields = ['id', 'name', 'total_available', 'currency', 'is_main_account', 'balances', 'cards']
