# Generated by Django 3.1.5 on 2021-08-21 21:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('economeeApi', '0014_remove_card_credit_spent'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='gender',
        ),
    ]
