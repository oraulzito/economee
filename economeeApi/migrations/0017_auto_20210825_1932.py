# Generated by Django 3.1.5 on 2021-08-25 22:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('economeeApi', '0016_remove_user_photo'),
    ]

    operations = [
        migrations.AddField(
            model_name='release',
            name='place',
            field=models.CharField(default='', max_length=280),
        ),
        migrations.AlterField(
            model_name='release',
            name='description',
            field=models.CharField(max_length=280),
        ),
    ]
