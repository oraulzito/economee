# Generated by Django 4.2.10 on 2024-03-08 20:44

from django.db import migrations, models
from django.utils.datetime_safe import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('economeeApi', '0039_rename_date_reference_balance_reference_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='dob',
            field=models.DateField(default=datetime.now()),
            preserve_default=False,
        ),
    ]