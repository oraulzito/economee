# Generated by Django 3.1.5 on 2021-02-20 18:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import partial_date.fields


class Migration(migrations.Migration):

    dependencies = [
        ('economeeApi', '0006_auto_20210110_2152'),
    ]

    operations = [
        migrations.AlterField(
            model_name='card',
            name='card_pay_date',
            field=partial_date.fields.PartialDateField(),
        ),
        migrations.AlterField(
            model_name='release',
            name='balance',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='economeeApi.balance'),
        ),
        migrations.AlterField(
            model_name='release',
            name='invoice',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='economeeApi.invoice'),
        ),
        migrations.AlterField(
            model_name='release',
            name='release_category',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.DO_NOTHING, to='economeeApi.releasecategory'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='releasecategory',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
    ]
