# Generated by Django 3.2.7 on 2022-03-06 18:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('economeeApi', '0035_auto_20220305_2232'),
    ]

    operations = [
        migrations.RenameField(
            model_name='recurringrelease',
            old_name='installment_total',
            new_name='installment_times',
        ),
    ]
