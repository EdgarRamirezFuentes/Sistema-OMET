from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AbstractToken(models.Model):
    """Abstract model for tokens."""
    digest = models.CharField(
        max_length=128, primary_key=True)
    token_key = models.CharField(
        max_length=25,
        db_index=True
    )
    user = models.ForeignKey(User, null=False, blank=False,
                             on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    expiry = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.key
