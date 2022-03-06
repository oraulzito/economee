# Generated by Django 3.2.7 on 2022-03-02 19:22

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('economeeApi', '0033_auto_20220302_1547'),
    ]

    operations = [
        migrations.AlterField(
            model_name='balance',
            name='date_reference',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='card',
            name='pay_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='invoice',
            name='date_reference',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='recurringrelease',
            name='date_release',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='release',
            name='date_creation',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='dob',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
