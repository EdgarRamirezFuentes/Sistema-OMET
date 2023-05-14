from django.db import models


class DataType(models.Model):
    name = models.CharField(max_length=255, null=False)
    description = models.CharField(max_length=255, null=True)
    input_type = models.ForeignKey('InputType', on_delete=models.SET_NULL, null=True)
    config_fields = models.JSONField(null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'DataType'
        verbose_name = 'Data Type'
        verbose_name_plural = 'Data Types'

    def __str__(self):
        return self.name
