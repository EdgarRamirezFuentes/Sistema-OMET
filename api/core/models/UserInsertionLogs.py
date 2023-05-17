from djongo import models

class UserInsertionLogs(models.Model):
    name_registered = models.CharField(max_length=50)
    first_last_name_registered = models.CharField(max_length=50)
    second_last_name_registered = models.CharField(max_length=50)
    email_registered = models.EmailField(max_length=255)
    phone_registered = models.CharField(max_length=20)
    is_superuser = models.BooleanField(default=False)

    class Meta:
        db_table = 'UserInsertionLogs'
        _use_db = 'logs'
        verbose_name = 'User Insertion Log'
        verbose_name_plural = 'User Insertion Logs'
