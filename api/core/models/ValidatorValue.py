from django.db import models


class ValidatorValue(models.Model):
    """Model for validator value."""
    validator = models.ForeignKey('Validator', on_delete=models.CASCADE, null=False)
    model_field = models.ForeignKey('ModelField', on_delete=models.CASCADE, null=False)
    value = models.CharField(max_length=255, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'ValidatorValue'
        verbose_name = 'Validator Value'
        verbose_name_plural = 'Validator Values'
        unique_together = ('validator', 'model_field')

    def __str__(self):
        return f'{self.id}. {self.validator.name} - {self.value}'
