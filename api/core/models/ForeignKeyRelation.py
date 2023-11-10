from django.db import models
from core.models import AppModel

class ForeignKeyRelation:
    model_field_origin = models.ForeignKey(AppModel, unique=True, on_delete=models.CASCADE, null=False, related_name='model_field_origin')
    model_field_related = models.ForeignKey(AppModel, on_delete=models.CASCADE, null=False, related_name='model_field_related')

    class Meta:
        db_table = 'ForeignKeyRelation'
        verbose_name = 'Foreign Key Relation'
        verbose_name_plural = 'Foreign Key Relations'
        unique_together = ('model_field_origin', 'model_field_related')
