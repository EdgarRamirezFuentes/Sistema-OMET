from django.db import models

class ForeignKeyRelation(models.Model):
    model_field_origin = models.OneToOneField('ModelField', on_delete=models.CASCADE, null=False, related_name='model_field_origin')
    model_field_related = models.ForeignKey('ModelField', on_delete=models.CASCADE, null=False, related_name='model_field_related')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ForeignKeyRelation'
        verbose_name = 'Foreign Key Relation'
        verbose_name_plural = 'Foreign Key Relations'
        unique_together = ('model_field_origin', 'model_field_related')
