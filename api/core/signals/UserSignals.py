# post save signal
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from core.tasks import (
    user_insertion_log,
    user_update_log,
)

from .classes import (
    UserInsertionLog,
    UserUpdateLog,
)
import datetime

User = get_user_model()


@receiver(post_save, sender=User)
def user_insertion_signal(sender, instance, created, **kwargs):
    """Register the user registration in the logs database"""
    if created:
        inserted_user = UserInsertionLog(
            name=instance.name,
            first_last_name=instance.first_last_name,
            second_last_name=instance.second_last_name,
            email=instance.email,
            phone=instance.phone,
            is_superuser=instance.is_superuser,
            is_staff=instance.is_staff,
            insertion_date=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )

        user_insertion_log.delay(inserted_user.get_json())
    else:
        updated_user = UserUpdateLog()
        updated_user.set_previous_data(instance.previous_data)
        update_data = {
            field.name: getattr(instance, field.name)
            for field in instance._meta.fields
        }
        updated_user.set_updated_data(update_data)

        user_update_log.delay(updated_user.get_json())


@receiver(pre_save, sender=User)
def user_pre_insertion_signal(sender, instance, **kwargs):
    """Get the original data of the user before updating"""
    try:
        # Getting the data before updating
        user = User.objects.get(pk=instance.pk)

        previous_data = {
            field.name: getattr(user, field.name)
            for field in user._meta.fields
        }

        instance.previous_data = previous_data

    except User.DoesNotExist:
        pass



