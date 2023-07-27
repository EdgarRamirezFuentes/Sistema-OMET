from django.db import models


class DataType(models.Model):
    """Model for data types."""
    name = models.CharField(max_length=255, null=False, unique=True)
    description = models.CharField(max_length=255, null=True)
    validators = models.ManyToManyField('Validator', blank=True)

    class Meta:
        db_table = 'DataType'
        verbose_name = 'Data Type'
        verbose_name_plural = 'Data Types'

    def __str__(self):
        return f'{self.id}. {self.name}'
