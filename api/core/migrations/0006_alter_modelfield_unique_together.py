# Generated by Django 3.2.18 on 2023-05-04 01:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_auto_20230502_2042'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='modelfield',
            unique_together={('order', 'project_model'), ('name', 'project_model')},
        ),
    ]
