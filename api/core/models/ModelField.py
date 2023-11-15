from django.db import models
from django.core.validators import MinValueValidator


class ModelField(models.Model):
    """Model for model fields."""
    name = models.CharField(max_length=255, null=False)
    caption = models.CharField(max_length=255, null=False)
    order = models.IntegerField(default=0, null=False, validators=[MinValueValidator(0),])
    data_type = models.ForeignKey('DataType', on_delete=models.SET_NULL, null=True)
    app_model = models.ForeignKey('AppModel', on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        db_table = 'ModelField'
        verbose_name = 'Model Field'
        verbose_name_plural = 'Model Fields'
        unique_together = (('name', 'app_model'),
                           ('order', 'app_model'))

    def __str__(self):
        return f'{self.id}. {self.name}'
