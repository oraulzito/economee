from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now
from partial_date import PartialDateField

from economee import settings


# Create your models here.
class User(AbstractUser):
    dob = models.DateField(default=now)
    photo = models.ImageField(upload_to='uploads', blank=True, null=True)

    GENDER_MALE = 'M'
    GENDER_FEMALE = 'F'
    GENDER_OTHER = 'O'
    GENDER_CHOICES = [
        (GENDER_MALE, "Male"),
        (GENDER_FEMALE, "Female"),
        (GENDER_OTHER, "Other"),
    ]

    gender = models.CharField(
        max_length=1, blank=True, choices=GENDER_CHOICES,
        verbose_name="gender",
    )

    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']


def __str__(self):
    return '{}'.format(self.username)


class Account(models.Model):
    account_name = models.CharField(max_length=24)
    total_available = models.FloatField(default=0)
    # TODO make currency an ENUM
    currency = models.CharField(max_length=2)
    is_main_account = models.BooleanField(default=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=settings.AUTH_USER_MODEL)

    REQUIRED_FIELDS = ['account_name', 'owner', 'currency']

    def __str__(self):
        return '{}'.format(self.account_name)


class Balance(models.Model):
    balance_month_year = PartialDateField()
    total_income = models.FloatField()
    total_expense = models.FloatField()
    account = models.ForeignKey(Account, on_delete=models.CASCADE)

    REQUIRED_FIELDS = ['balance_month_year', 'account']

    def __str__(self):
        return '{}'.format(self.balance_month_year)


class Card(models.Model):
    card_name = models.CharField(max_length=24)
    card_credit = models.FloatField()
    card_credit_spent = models.FloatField()
    card_pay_date = PartialDateField()
    account = models.ForeignKey(Account, on_delete=models.CASCADE)

    REQUIRED_FIELDS = ['card_name', 'card_pay_date', 'account']

    def __str__(self):
        return '{}'.format(self.card_name)


class ReleaseCategory(models.Model):
    category_name = models.CharField(max_length=24)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)

    REQUIRED_FIELDS = ['category_name', 'owner']

    def __str__(self):
        return '{}'.format(self.category_name)


class Invoice(models.Model):
    total = models.FloatField(default=0)
    invoice_month_year = PartialDateField()
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    is_invoice_paid = models.BooleanField(default=False)

    REQUIRED_FIELDS = ['invoice_month_year', 'card', 'balance']

    def __str__(self):
        return '{}'.format(self.total)


class Release(models.Model):
    description = models.CharField(max_length=140)
    value = models.FloatField()
    date_release = models.DateField()
    repeat_date = models.DateField()
    installment_number = models.IntegerField(default=1)
    repeat_times = models.IntegerField(default=1)
    is_release_paid = models.BooleanField(default=False)

    EXPENSE_RELEASE = 'ER'
    INCOME_RELEASE = 'IR'
    RELEASE_CHOICES = [
        (EXPENSE_RELEASE, "Expense"),
        (INCOME_RELEASE, "Income"),
    ]

    # TODO make release_type an enum
    release_type = models.CharField(
        max_length=2, blank=True, choices=RELEASE_CHOICES,
        verbose_name="Release Type",
    )

    release_category = models.ForeignKey(ReleaseCategory, on_delete=models.DO_NOTHING)
    invoice = models.ForeignKey(Invoice, null=True, blank=True, on_delete=models.DO_NOTHING)
    balance = models.ForeignKey(Balance, null=True, blank=True, on_delete=models.DO_NOTHING)

    REQUIRED_FIELDS = ['description', 'value', 'release_type', 'date_release', 'release_type',
                       'is_release_paid', 'release_category', 'balance']

    def __str__(self):
        return '{}'.format(self.description)
