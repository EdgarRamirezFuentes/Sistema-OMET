from django.db import models

class ForeignKeyRelation(models.Model):
    """Model for foreign key relations."""
    model_field_origin = models.ForeignKey('ModelField', on_delete=models.CASCADE, null=False, related_name='model_field_origin')
    model_field_relation = models.ForeignKey('ModelField', on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'ForeignKeyRelation'
        verbose_name = 'Foreign Key Relation'
        verbose_name_plural = 'Foreign Key Relations'
        unique_together = ('model_field_origin', 'model_field_relation')
