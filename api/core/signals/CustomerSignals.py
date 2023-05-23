from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from core.tasks import (
    customer_insertion_log,
    customer_update_log,
)

from .classes import (
    CustomerInsertionLog,
    CustomerUpdateLog,
)

from core.models import Customer


@receiver(post_save, sender=Customer)
def customer_insertion_signal(sender, instance, created, **kwargs):
    """Register the customer registration in the logs database"""
    if created:
        inserted_customer = CustomerInsertionLog(
            rfc=instance.rfc,
            name=instance.name,
            phone=instance.phone,
            email=instance.email,
            is_active=instance.is_active
        )

        customer_insertion_log.delay(inserted_customer.get_json())
    else:
        updated_customer = CustomerUpdateLog()
        updated_customer.set_previous_data(instance.previous_data)
        update_data = {
            field.name: getattr(instance, field.name)
            for field in instance._meta.fields
        }
        updated_customer.set_updated_data(update_data)

        customer_update_log.delay(updated_customer.get_json())


@receiver(pre_save, sender=Customer)
def customer_pre_insertion_signal(sender, instance, **kwargs):
    """Get the original data of the customer before updating"""
    try:
        # Getting the data before updating
        customer = Customer.objects.get(pk=instance.pk)

        previous_data = {
            field.name: getattr(customer, field.name)
            for field in customer._meta.fields
        }

        instance.previous_data = previous_data
    except Exception as e:
        pass
