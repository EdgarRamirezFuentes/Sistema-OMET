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

    return os.path.join('uploads', f'user_{instance.id}/', filename)


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
    email = models.EmailField(max_length=255, unique=True, null=False)
    name = models.CharField(max_length=255, null=False)
    last_name = models.CharField(max_length=255, null=True)
    phone = models.CharField(max_length=10, null=True)
    password = models.CharField(max_length=255, null=False)
    profile_image = models.ImageField(upload_to=profile_image_file_path, null=True)
    projects = models.ManyToManyField('Project', through='Maintenance')
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'last_name']


    class Meta:
        db_table = 'User'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'{self.id}. {self.name} {self.last_name}'


