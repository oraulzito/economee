from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now

from economee import settings

RELEASE_CHOICES = [
    (0, "Expense"),
    (1, "Income"),
]


# Create your models here.
class User(AbstractUser):
    dob = models.DateField(default=now)
    photo = models.ImageField(upload_to='uploads', blank=True, null=True)

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
    total_available = models.FloatField(default=0.0)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=settings.AUTH_USER_MODEL)

    REQUIRED_FIELDS = ['name', 'is_main_account', 'currency']

    def __str__(self):
        return '{}'.format(self.name)


class Balance(models.Model):
    date_reference = models.DateField()
    total_expenses = models.FloatField(default=0.0)
    total_incomes = models.FloatField(default=0.0)
    account = models.ForeignKey(Account, related_name='balances', on_delete=models.CASCADE)

    REQUIRED_FIELDS = ['date_reference', 'account']

    def __str__(self):
        return '{}'.format(self.date_reference)


class Card(models.Model):
    name = models.CharField(max_length=24)
    credit = models.FloatField(default=0.0)
    pay_date = models.DateField()
    account = models.ForeignKey(Account, related_name='cards', on_delete=models.CASCADE)

    REQUIRED_FIELDS = ['name', 'credit', 'pay_date', 'account']

    def __str__(self):
        return '{}'.format(self.name)


# TODO create default release categories
class ReleaseCategory(models.Model):
    name = models.CharField(max_length=124)
    color = models.CharField(max_length=124)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING, null=True)

    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return '{}'.format(self.name)


# TODO send a notification in the pay_date of the card, confirming if it's paid
class Invoice(models.Model):
    date_reference = models.DateField()
    is_paid = models.BooleanField(default=False)
    total_value = models.FloatField(default=0.0)
    card = models.ForeignKey(Card, related_name='invoices', on_delete=models.CASCADE)

    REQUIRED_FIELDS = ['date_reference', 'card']

    def __str__(self):
        return '{}'.format(self.date_reference)


class Release(models.Model):
    value = models.FloatField(default=0.0)
    description = models.CharField(max_length=280)
    place = models.CharField(max_length=280, default='')
    date_creation = models.DateField(auto_now_add=True)

    category = models.ForeignKey(ReleaseCategory, related_name='releases', on_delete=models.DO_NOTHING)

    type = models.IntegerField(
        choices=RELEASE_CHOICES,
        verbose_name="Release Type",
    )

    REQUIRED_FIELDS = ['description', 'value', 'type', 'date_release', 'is_paid', 'place', 'category']

    def __str__(self):
        return self


class RecurringRelease(models.Model):
    date_release = models.DateField()
    is_paid = models.BooleanField(default=False)
    installment_number = models.IntegerField(default=1)
    installment_times = models.IntegerField(default=1)
    installment_value = models.FloatField(default=0.0)

    release = models.ForeignKey(Release, related_name='recurring_release', on_delete=models.CASCADE)
    balance = models.ForeignKey(Balance, related_name='recurring_release', on_delete=models.CASCADE)
    invoice = models.ForeignKey(Invoice, related_name='recurring_release', on_delete=models.CASCADE, null=True)

    REQUIRED_FIELDS = ['release', 'balance', 'installment']

    def __str__(self):
        return self
