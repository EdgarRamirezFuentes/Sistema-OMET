# Generated by Django 3.2.18 on 2023-05-15 23:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0017_configvalues_model_field'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='datatype',
            name='config_fields',
        ),
        migrations.RemoveField(
            model_name='datatype',
            name='input_type',
        ),
        migrations.RemoveField(
            model_name='modelfield',
            name='config_fields',
        ),
        migrations.DeleteModel(
            name='InputType',
        ),
    ]