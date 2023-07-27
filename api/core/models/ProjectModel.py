from django.db import models


class ProjectModel(models.Model):
    """Model for project models."""
    name = models.CharField(max_length=255, null=False)
    project_app = models.ForeignKey('ProjectApp', on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'ProjectModel'
        verbose_name = 'Project Model'
        verbose_name_plural = 'Project Models'
        unique_together = ('name', 'project_app')

    def __str__(self):
        return f'{self.id}. {self.name}'

