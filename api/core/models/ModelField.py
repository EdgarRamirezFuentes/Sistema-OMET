from django.db import models


class ModelField(models.Model):
    name = models.CharField(max_length=255, null=False)
    caption = models.CharField(max_length=255, null=False)
    is_active = models.BooleanField(default=True)
    is_required = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    data_type = models.ForeignKey('DataType', on_delete=models.SET_NULL, null=True)
    project_model = models.ForeignKey('ProjectModel', on_delete=models.CASCADE, null=False)

    class Meta:
        db_table = 'ModelField'
        verbose_name = 'Model Field'
        verbose_name_plural = 'Model Fields'
        unique_together = (('name', 'project_model'),
                           ('order', 'project_model'))

    def __str__(self):
        return f'{self.id}. {self.name} - {self.project_model.project.name}'
