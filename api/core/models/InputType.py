from django.db import models

class InputType(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'InputType'
        verbose_name = 'Input Type'
        verbose_name_plural = 'Input Types'

    def __str__(self):
        return self.name
