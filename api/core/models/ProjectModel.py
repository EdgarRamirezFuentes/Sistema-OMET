from django.db import models


class ProjectModel(models.Model):
    name = models.CharField(max_length=255, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    project = models.ForeignKey('Project', on_delete=models.CASCADE, null=False)

    class Meta:
        db_table = 'ProjectModel'
        verbose_name = 'Project Model'
        verbose_name_plural = 'Project Models'
        unique_together = ('name', 'project')

    def __str__(self):
        return f'{self.id}. {self.name} - {self.project.name}'

