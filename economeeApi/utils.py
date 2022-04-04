from dateutil.relativedelta import relativedelta
from django.utils.datetime_safe import datetime


class Utils:

    @classmethod
    def date_replace_and_add_month(cls, date_reference, day, n):
        date_reference_invoice = date_reference.replace(day=day)
        return date_reference_invoice + relativedelta(months=+n)

    @classmethod
    def date_to_database_format(cls, from_date):
        from_date = str(from_date).split("T")[0]
        return datetime.strptime(from_date, '%Y-%m-%d').date()
