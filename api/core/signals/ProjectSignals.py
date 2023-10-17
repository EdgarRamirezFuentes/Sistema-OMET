from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from core.tasks import (
    project_insertion_log,
    project_update_log,
)

from .classes import (
    ProjectInsertionLog,
    ProjectUpdateLog,
)

import datetime

from core.models import Project


@receiver(post_save, sender=Project)
def project_insertion_signal(sender, instance, created, **kwargs):
    """Register the project registration in the logs database"""
    if created:
        inserted_project = ProjectInsertionLog(
            name=instance.name,
            description=instance.description,
            customer_rfc=instance.customer.rfc,
        )

        project_insertion_log.delay(inserted_project.get_json())
    else:
        updated_project = ProjectUpdateLog()
        updated_project.set_previous_data(instance.previous_data)
        update_data = {
            field.name: getattr(instance, field.name)
            for field in instance._meta.fields
        }
        updated_project.set_updated_data(update_data)

        project_update_log.delay(updated_project.get_json())


@receiver(pre_save, sender=Project)
def project_pre_insertion_signal(sender, instance, **kwargs):
    """Get the original data of the project before updating"""
    try:
        # Getting the data before updating
        project = Project.objects.get(pk=instance.pk)

        previous_data = {
            field.name: getattr(project, field.name)
            for field in project._meta.fields
        }

        instance.previous_data = previous_data
    except Exception as e:
        pass
