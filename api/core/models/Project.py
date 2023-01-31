from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=255, null=False)
    description = models.CharField(max_length=255, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE, null=False)

    class Meta:
        db_table = 'Project'
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

    def __str__(self):
        return f'{self.id}. {self.name}'
