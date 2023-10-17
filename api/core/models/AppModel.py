from django.db import models

class AppModel(models.Model):
    """Model for app models."""
    name = models.CharField(max_length=255, null=False)
    project_app = models.ForeignKey('ProjectApp', on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'AppModel'
        verbose_name = 'App Model'
        verbose_name_plural = 'App Models'
        unique_together = ('name', 'project_app')

    def __str__(self):
        return f'{self.id}. {self.name}'
