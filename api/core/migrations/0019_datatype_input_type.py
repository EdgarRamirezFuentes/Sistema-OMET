# Generated by Django 3.2.18 on 2023-05-15 23:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0018_auto_20230515_1831'),
    ]

    operations = [
        migrations.AddField(
            model_name='datatype',
            name='input_type',
            field=models.CharField(choices=[('text', 'Text'), ('int', 'Integer'), ('float', 'Float'), ('checkbox', 'Checkbox'), ('select', 'Select')], default='text', max_length=255),
            preserve_default=False,
        ),
    ]