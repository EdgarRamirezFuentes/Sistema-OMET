from django.db import models


class Maintenance(models.Model):
    """Model for maintenances."""
    user = models.ForeignKey('User', on_delete=models.CASCADE, null=False)
    project = models.ForeignKey('Project', on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Maintenance'
        verbose_name = 'Maintenance'
        verbose_name_plural = 'Maintenances'
        unique_together = ('user', 'project')

    def __str__(self):
        return f'User: ({self.user.id}) {self.user.email} - Project: ({self.project.id}) {self.project.name}'
