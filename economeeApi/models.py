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

    REQUIRED_FIELDS = ['email', 'password', 'first_name']

    def __str__(self):
        return '{}'.format(self.username)


class Account(models.Model):
    name = models.CharField(max_length=24)
    # TODO make currency an ENUM
    currency = models.CharField(max_length=2)
    is_main_account = models.BooleanField(default=False)
    total_available = models.FloatField()
    # Owner attribute according to the class diagram
    id_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=settings.AUTH_USER_MODEL)
    
    REQUIRED_FIELDS = ['name', 'id_user', 'currency']

    def __str__(self):
        return '{}'.format(self.name)


class Balance(models.Model):
    # Month reference, expected format MM/YYYY
    date_reference = PartialDateField()
    id_account = models.ForeignKey(Account, on_delete=models.CASCADE)
    total_income = models.FloatField()
    total_expense = models.FloatField()
    REQUIRED_FIELDS = ['date_reference', 'id_account']

    def __str__(self):
        return '{}'.format(self.date_reference)


class Card(models.Model):
    name = models.CharField(max_length=24)
    credit = models.FloatField()
    credit_spent = models.FloatField()
    pay_date = PartialDateField()
    id_account = models.ForeignKey(Account, on_delete=models.CASCADE)

    REQUIRED_FIELDS = ['name', 'credit', 'credit_spent', 'pay_date', 'id_account']

    def __str__(self):
        return '{}'.format(self.name)


class ReleaseCategory(models.Model):
    name = models.CharField(max_length=24)
    # Owner according to class diagram
    id_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)

    REQUIRED_FIELDS = ['name', 'id_user']

    def __str__(self):
        return '{}'.format(self.name)


class Invoice(models.Model):
    date_reference = PartialDateField()
    id_card = models.ForeignKey(Card, on_delete=models.CASCADE)
    # TODO send a notification in the pay_date of the card, confirming if it's paid
    is_paid = models.BooleanField(default=False)
    total = models.FloatField()
    REQUIRED_FIELDS = ['date_reference', 'id_card', 'is_paid']

    def __str__(self):
        return '{}'.format(self.date_reference)


class Release(models.Model):
    description = models.CharField(max_length=140)
    value = models.FloatField()
    date_release = models.DateField()
    date_repeat = models.DateField()
    installment_number = models.IntegerField(default=1)
    repeat_times = models.IntegerField(default=1)
    is_release_paid = models.BooleanField(default=False)
    category = models.ForeignKey(ReleaseCategory, on_delete=models.DO_NOTHING)

    # TODO study this idea
    # Projection release will not be used on the 'oficial' sum of the balance, it will be used only in simulation on month expenses
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
        return '{}'.format(self.description)


class InvoiceRelease(models.Model):
    id_invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    id_release = models.ForeignKey(Release, on_delete=models.CASCADE)

    REQUIRED_FIELDS = ['id_invoice', 'id_release']

    def __str__(self):
        return '{}'.format(self)


class BalanceRelease(models.Model):
    id_balance = models.ForeignKey(Balance, on_delete=models.CASCADE)
    id_release = models.ForeignKey(Release, on_delete=models.CASCADE)

    REQUIRED_FIELDS = ['id_balance', 'id_release']

    def __str__(self):
        return '{}'.format(self)
