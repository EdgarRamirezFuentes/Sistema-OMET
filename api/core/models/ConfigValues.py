from django.db import models


class ConfigValues(models.Model):
    """Model for config values."""
    config_field = models.ForeignKey('ConfigFields', on_delete=models.CASCADE, null=False)
    model_field = models.ForeignKey('ModelField', on_delete=models.CASCADE, null=False)
    value = models.CharField(max_length=255, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'ConfigValues'
        verbose_name = 'Config Value'
        verbose_name_plural = 'Config Values'
        unique_together = ('config_field', 'value')

    def __str__(self):
        return f'{self.id}. {self.config_field.name} - {self.value}'
