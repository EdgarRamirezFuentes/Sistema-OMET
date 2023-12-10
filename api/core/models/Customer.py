from django.db import models


class Customer(models.Model):
    """Model for customers."""
    rfc = models.CharField(max_length=13, null=False, unique=True)
    name = models.CharField(max_length=255, null=False)
    phone = models.CharField(max_length=20, null=True)
    email = models.EmailField(max_length=255, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Customer'
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'

    def __str__(self):
        return f'{self.id}. {self.name}'

