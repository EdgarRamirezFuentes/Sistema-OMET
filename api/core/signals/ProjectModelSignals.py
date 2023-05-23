from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from core.tasks import (
    project_model_insertion_log,
    project_model_update_log,
)

from .classes import (
    ProjectModelInsertionLog,
    ProjectModelUpdateLog,
)

from core.models import ProjectModel


@receiver(post_save, sender=ProjectModel)
def project_model_insertion_signal(sender, instance, created, **kwargs):
    """Register the project model registration in the logs database"""
    if created:
        inserted_project_model = ProjectModelInsertionLog(
            name=instance.name,
            is_active=instance.is_active,
            project_id=instance.project.id,
            project_name=instance.project.name,
            customer_rfc=instance.project.customer.rfc,
        )

        project_model_insertion_log.delay(inserted_project_model.get_json())
    else:
        updated_project_model = ProjectModelUpdateLog()
        updated_project_model.set_previous_data(instance.previous_data)
        update_data = {
            field.name: getattr(instance, field.name)
            for field in instance._meta.fields
        }
        updated_project_model.set_updated_data(update_data)

        project_model_update_log.delay(updated_project_model.get_json())


@receiver(pre_save, sender=ProjectModel)
def project_model_pre_insertion_signal(sender, instance, **kwargs):
    """Get the original data of the project model before updating"""
    try:
        # Getting the data before updating
        project_model = ProjectModel.objects.get(pk=instance.pk)

        previous_data = {
            field.name: getattr(project_model, field.name)
            for field in project_model._meta.fields
        }

        instance.previous_data = previous_data
    except Exception as e:
        pass
