from django.db import models

class ConfigFields(models.Model):
    """Model for config fields."""
    VALUE_TYPE_CHOICES = (
        ('String', 'str'),
        ('Integer', 'int'),
        ('Float', 'float'),
        ('Boolean', 'bool'),
    )

    name = models.CharField(max_length=255, null=False)
    description = models.CharField(max_length=255, null=True)
    data_type = models.ForeignKey('DataType', on_delete=models.CASCADE, null=False)
    value_type = models.CharField(max_length=255, null=False, choices=VALUE_TYPE_CHOICES)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'ConfigFields'
        verbose_name = 'Config Field'
        verbose_name_plural = 'Config Fields'
        unique_together = ('name', 'data_type')
