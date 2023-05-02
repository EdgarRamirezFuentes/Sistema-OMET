from django.db import models


class Maintenance(models.Model):
    maintainer = models.ForeignKey('Maintainer', on_delete=models.CASCADE, null=False)
    project = models.ForeignKey('Project', on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Maintenance'
        verbose_name = 'Maintenance'
        verbose_name_plural = 'Maintenances'
        unique_together = ('maintainer', 'project')

    def __str__(self):
        return f'{self.maintainer.user.name} {self.maintainer.user.first_last_name} {self.maintainer.user.second_last_name} - {self.project.name}'
