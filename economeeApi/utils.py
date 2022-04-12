from dateutil.relativedelta import relativedelta
from django.utils.datetime_safe import datetime


class Utils:

    @classmethod
    def date_replace_and_add_month(cls, date_reference, day, n):
        date_reference_invoice = date_reference.replace(day=day)
        return date_reference_invoice + relativedelta(months=+n)

    @classmethod
    def month_replace_and_add_month(cls, date_reference, day, n):
        date_reference_invoice = date_reference.replace(day=day)
        return date_reference_invoice + relativedelta(months=+n)

    @classmethod
    def year_replace_and_add_month(cls, date_reference, day, n):
        date_reference_invoice = date_reference.replace(day=day)
        return date_reference_invoice + relativedelta(months=+n)

    @classmethod
    def date_to_database_format(cls, from_date):
        from_date = str(from_date).split("T")[0]
        return datetime.strptime(from_date, '%Y-%m-%d').date()

    @classmethod
    def update_invoice_total(cls, invoice, release_type, value):
        print(invoice)
        print(release_type)
        print(value)
        if release_type == 0:
            invoice.total_value += value
        elif release_type == 1:
            invoice.total_value -= value
        invoice.save()

    @classmethod
    def update_balance_total(cls, balance, release_type, value):
        if release_type == 0:
            balance.total_expenses += value
        elif release_type == 1:
            balance.total_incomes += value
        balance.save()

    @classmethod
    def update_account_total(cls, account, release_type, value):
        if release_type == 0:
            account.total_available -= value
        elif release_type == 1:
            account.total_available += value
        account.save()
