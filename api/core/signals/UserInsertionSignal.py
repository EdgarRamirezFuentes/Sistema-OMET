from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from core.models import UserInsertionLogs

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_insertion_log(sender, instance, created, **kwargs):

    print('User created')
