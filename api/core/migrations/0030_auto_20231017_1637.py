# Generated by Django 3.2.22 on 2023-10-17 21:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0029_alter_modelfield_model_field_relation'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appmodel',
            name='is_active',
        ),
        migrations.RemoveField(
            model_name='customer',
            name='is_active',
        ),
        migrations.RemoveField(
            model_name='modelfield',
            name='is_active',
        ),
        migrations.RemoveField(
            model_name='project',
            name='is_active',
        ),
        migrations.RemoveField(
            model_name='validatorvalue',
            name='is_active',
        ),
    ]
