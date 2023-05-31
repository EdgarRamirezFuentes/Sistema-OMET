# Generated by Django 3.2.20 on 2023-09-18 05:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0026_auto_20230725_1911'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ProjectModel',
            new_name='AppModel',
        ),
        migrations.AlterModelOptions(
            name='appmodel',
            options={'verbose_name': 'App Model', 'verbose_name_plural': 'App Models'},
        ),
        migrations.RenameField(
            model_name='modelfield',
            old_name='project_model',
            new_name='app_model',
        ),
        migrations.AlterUniqueTogether(
            name='modelfield',
            unique_together={('order', 'app_model'), ('name', 'app_model')},
        ),
        migrations.AlterModelTable(
            name='appmodel',
            table='AppModel',
        ),
    ]