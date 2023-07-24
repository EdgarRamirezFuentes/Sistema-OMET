from django.db import models

class Validator(models.Model):
    """Model for validator."""
    name = models.CharField(max_length=255, null=False, unique=True)
    description = models.CharField(max_length=255, null=True)

    class Meta:
        db_table = 'Validator'
        verbose_name = 'Validator'
        verbose_name_plural = 'Validators'

    def __str__(self):
        return self.name
