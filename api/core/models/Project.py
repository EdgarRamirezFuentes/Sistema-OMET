from django.db import models


class Project(models.Model):
    """Model for projects."""
    name = models.CharField(max_length=255, null=False)
    description = models.CharField(max_length=255, null=True)
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Project'
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
        unique_together = ('name', 'customer')

    def __str__(self):
        return f'{self.id}. {self.name}'
