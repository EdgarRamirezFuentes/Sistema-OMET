import os
import uuid
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,  # Contains the functionality for authentication system.
    BaseUserManager,
    PermissionsMixin  # Contains the functionality for permissions.
)



def profile_image_file_path(instance, filename):
    """Generate file path for new profile image."""
    ext = os.path.splitext(filename)[1]
    filename = f'{uuid.uuid4()}{ext}'

    return os.path.join('uploads', 'profile_images', filename)


class UserManager(BaseUserManager):
    """Manager for users."""

    def create_user(self, email, password=None, **extra_fields):
        """Create, save and return a new user."""
        if not email:
            raise ValueError('User must have an email address.')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, **extra_fields):
        """Create and return a new superuser."""
        user = self.create_user(email, password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """User in the system."""
    rfc = models.CharField(max_length=13, unique=True, null=False)
    email = models.EmailField(max_length=255, unique=True, null=False)
    name = models.CharField(max_length=255, null=False)
    first_last_name = models.CharField(max_length=255, null=True)
    second_last_name = models.CharField(max_length=255, null=True)
    phone = models.CharField(max_length=10, null=True)
    password = models.CharField(max_length=255, null=False)
    profile_image = models.ImageField(upload_to=profile_image_file_path, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=True)
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'first_last_name', 'second_last_name', 'phone', 'rfc',]


    class Meta:
        db_table = 'User'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'{self.id}. {self.name} {self.first_last_name} {self.second_last_name}'
