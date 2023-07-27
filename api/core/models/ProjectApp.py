from django.db import models

from core.models import Project


class ProjectApp(models.Model):
    """ProjectApp Model"""

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "project_app"
        ordering = ["project",]
        verbose_name = "Project App"
        verbose_name_plural = "Project Apps"
        unique_together = ("name", "project")

    def __str__(self):
        return f"{self.id}. {self.name}"
