from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from core.tasks import (
    model_field_insertion_log,
    model_field_update_log,
)

from .classes import (
    ModelFieldInsertionLog,
    ModelFieldUpdateLog,
)

from core.models import ModelField


@receiver(post_save, sender=ModelField)
def model_field_post_save(sender, instance, created, **kwargs):
    if created:
        log = ModelFieldInsertionLog(
            name=instance.name,
            caption=instance.caption,
            is_required=instance.is_required,
            order=instance.order,
            data_type_id=instance.data_type.id,
            data_type_name=instance.data_type.name,
            project_model_id=instance.project_model.id,
            project_model_name=instance.project_model.name,
            project_id=instance.project_model.project.id,
            project_name=instance.project_model.project.name,
            customer_rfc=instance.project_model.project.customer.rfc
        )
        model_field_insertion_log.delay(log.get_json())
    else:
        log = ModelFieldUpdateLog()
        log.set_previous_data(instance.previous_data)
        update_data = {
            field.name: getattr(instance, field.name)
            for field in instance._meta.fields
        }
        log.set_updated_data(update_data)

        model_field_update_log.delay(log.get_json())


@receiver(pre_save, sender=ModelField)
def model_field_pre_save(sender, instance, **kwargs):
    try:
        # Getting the data before updating
        model_field = ModelField.objects.get(pk=instance.pk)

        previous_data = {
            field.name: getattr(model_field, field.name)
            for field in model_field._meta.fields
        }

        instance.previous_data = previous_data
    except Exception as e:
        pass
