from django.db import models


class DataType(models.Model):
    INPUT_TYPE_CHOICES = (
        ('String', 'text'),
        ('Number', 'number'),
        ('Checkbox', 'checkbox'),
        ('Select', 'select'),
        ('Radio', 'radio'),
    )

    name = models.CharField(max_length=255, null=False, unique=True)
    description = models.CharField(max_length=255, null=True)
    input_type = models.CharField(max_length=255, choices=INPUT_TYPE_CHOICES, null=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'DataType'
        verbose_name = 'Data Type'
        verbose_name_plural = 'Data Types'
        unique_together = ('name', 'input_type')

    def __str__(self):
        return self.name
