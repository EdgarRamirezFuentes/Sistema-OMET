from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from core.tasks import (
    data_type_insertion_log,
    data_type_update_log,
)

from .classes import (
    DataTypeInsertionLog,
    DataTypeUpdateLog,
)

from core.models import DataType


@receiver(post_save, sender=DataType)
def data_type_insertion_signal(sender, instance, created, **kwargs):
    """Register the data type registration in the logs database"""
    if created:
        inserted_data_type = DataTypeInsertionLog(
            name=instance.name,
            description=instance.description,
            input_type=instance.input_type,
        )

        data_type_insertion_log.delay(inserted_data_type.get_json())
    else:
        updated_data_type = DataTypeUpdateLog()
        updated_data_type.set_previous_data(instance.previous_data)
        update_data = {
            field.name: getattr(instance, field.name)
            for field in instance._meta.fields
        }
        updated_data_type.set_updated_data(update_data)

        data_type_update_log.delay(updated_data_type.get_json())


@receiver(pre_save, sender=DataType)
def data_type_pre_insertion_signal(sender, instance, **kwargs):
    """Get the original data of the data type before updating"""
    try:
        # Getting the data before updating
        data_type = DataType.objects.get(pk=instance.pk)

        previous_data = {
            field.name: getattr(data_type, field.name)
            for field in data_type._meta.fields
        }

        instance.previous_data = previous_data
    except Exception as e:
        pass
