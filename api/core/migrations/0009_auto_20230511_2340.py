# Generated by Django 3.2.18 on 2023-05-12 04:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_datatype_input_type'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='inputtype',
            options={'verbose_name': 'Input Type', 'verbose_name_plural': 'Input Types'},
        ),
        migrations.AlterModelTable(
            name='inputtype',
            table='InputType',
        ),
    ]