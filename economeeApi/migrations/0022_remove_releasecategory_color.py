# Generated by Django 3.2.7 on 2021-09-21 21:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('economeeApi', '0021_releasecategory_color'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='releasecategory',
            name='color',
        ),
    ]
