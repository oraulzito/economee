from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now
from partial_date import PartialDateField

from economee import settings


# Create your models here.
class User(AbstractUser):
    dob = models.DateField(default=now)
    # photo = models.ImageField(upload_to='uploads', blank=True, null=True)

    REQUIRED_FIELDS = ['email', 'password', 'first_name']

    def __str__(self):
        return '{}'.format(self.username)


class Currency(models.Model):
    country = models.CharField(max_length=100)
    currency = models.CharField(max_length=100)
    code = models.CharField(max_length=100)
    symbol = models.CharField(max_length=100)

    def __str__(self):
        return '{}'.format(self)


class Account(models.Model):
    name = models.CharField(max_length=24)
    is_main_account = models.BooleanField(default=False)
    # Owner attribute according to the class diagram
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=settings.AUTH_USER_MODEL)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)

    REQUIRED_FIELDS = ['name', 'is_main_account', 'currency']

    def __str__(self):
        return '{}'.format(self.name)


class Balance(models.Model):
    # Month reference, expected format MM/YYYY
    date_reference = PartialDateField()
    account = models.ForeignKey(Account, related_name='balances', on_delete=models.CASCADE)
    REQUIRED_FIELDS = ['date_reference', 'account']

    def __str__(self):
        return '{}'.format(self.date_reference)


class Card(models.Model):
    name = models.CharField(max_length=24)
    credit = models.FloatField(default=0.0)
    pay_date = PartialDateField()
    account = models.ForeignKey(Account, related_name='cards', on_delete=models.CASCADE)

    REQUIRED_FIELDS = ['name', 'credit', 'pay_date', 'account']

    def __str__(self):
        return '{}'.format(self.name)


# TODO create default release categories
class ReleaseCategory(models.Model):
    name = models.CharField(max_length=124)
    type = models.IntegerField(default=0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING, null=True)

    REQUIRED_FIELDS = ['name', 'type']

    def __str__(self):
        return '{}'.format(self.name)


class Invoice(models.Model):
    date_reference = PartialDateField()
    # TODO send a notification in the pay_date of the card, confirming if it's paid
    is_paid = models.BooleanField(default=False)
    card = models.ForeignKey(Card, related_name='invoices', on_delete=models.CASCADE)

    REQUIRED_FIELDS = ['date_reference', 'card', 'is_paid']

    def __str__(self):
        return '{}'.format(self.date_reference)


class Release(models.Model):
    description = models.CharField(max_length=280)
    value = models.FloatField(default=0.0)
    value_installment = models.FloatField(default=0.0)
    date_creation = models.DateField()
    date_release = models.DateField()
    date_repeat = models.DateField()
    installment_number = models.IntegerField(default=1)
    repeat_times = models.IntegerField(default=1)
    place = models.CharField(max_length=280, default='')
    is_release_paid = models.BooleanField(default=False)
    category = models.ForeignKey(ReleaseCategory, on_delete=models.DO_NOTHING)
    balance = models.ForeignKey(Balance, related_name='releases', on_delete=models.DO_NOTHING, null=True)
    invoice = models.ForeignKey(Invoice, related_name='releases', on_delete=models.DO_NOTHING, null=True)

    # TODO study this idea Projection release will not be used on the 'oficial' sum of the balance, it will be used
    #  only in simulation on month expenses
    PROJECTION_RELEASE = 'PR'
    EXPENSE_RELEASE = 'ER'
    INCOME_RELEASE = 'IR'
    RELEASE_CHOICES = [
        (PROJECTION_RELEASE, "Projection"),
        (EXPENSE_RELEASE, "Expense"),
        (INCOME_RELEASE, "Income"),
    ]

    # TODO make type an enum
    type = models.CharField(
        max_length=2, blank=True, choices=RELEASE_CHOICES,
        verbose_name="Release Type",
    )

    REQUIRED_FIELDS = ['description', 'value', 'type', 'date_release', 'type', 'is_release_paid', 'category']

    def __str__(self):
        return self
