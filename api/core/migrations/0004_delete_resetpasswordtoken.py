# Generated by Django 3.2.18 on 2023-04-22 23:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20230422_1729'),
    ]

    operations = [
        migrations.DeleteModel(
            name='ResetPasswordToken',
        ),
    ]