"""
Serializers for the user API View.
"""
import re
from django.utils.translation import gettext as _
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from django.contrib.auth import (
    get_user_model,
    authenticate,
)

def validate_password(password):
    """Validate password."""
    if len(password) < 8:
        raise serializers.ValidationError(
            _('Password must be at least 8 characters long.')
        )

    if not re.search(r'[A-Z]', password):
        raise serializers.ValidationError(
            _('Password must contain at least one uppercase letter.')
        )

    if not re.search(r'[a-z]', password):
        raise serializers.ValidationError(
            _('Password must contain at least one lowercase letter.')
        )

    if not re.search(r'[0-9]', password):
        raise serializers.ValidationError(
            _('Password must contain at least one number.')
        )

    if not re.search(r'[!@#$%^&*]', password):
        raise serializers.ValidationError(
            _('Password must contain at least one special character (!@#$%^&*).')
        )


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""
    profile_image = Base64ImageField(required=False)
    class Meta:
        model = get_user_model()
        fields = ('rfc', 'email', 'password', 'name', 'first_last_name', 'second_last_name', 'phone', 'profile_image', 'is_superuser')
        extra_kwargs = {'password': {'write_only': True, 'min_length': 8}}

    def validate(self, data):
        """Validate and authenticate the user."""

        validate_password(data['password'])
        return data

    def update(self, instance, validated_data):
        """Update and return user."""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            validate_password(password)
            user.set_password(password)
            user.save()

        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""
    profile_image = Base64ImageField(required=False)
    class Meta:
        model = get_user_model()
        fields = ('id', 'name', 'first_last_name', 'second_last_name', 'profile_image', 'is_superuser', 'is_active')


class UserMinimalSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""
    class Meta:
        model = get_user_model()
        fields = ('id', 'name', 'first_last_name', 'second_last_name')


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, data):
        """Validate and authenticate the user."""
        user = authenticate(**data)

        if user and user.is_active:
            return user

        msg = _('Unable to authenticate with provided credentials')
        raise serializers.ValidationError(msg, code='authorization')


class UserChangePasswordSerializer(serializers.Serializer):
    """Serializer for the user change password object."""
    old_password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    new_password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    confirm_password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, data):
        """Validate and authenticate the user."""
        user = self.context['request'].user

        if not user.check_password(data.get('old_password')):
            msg = _('Current password is incorrect')
            raise serializers.ValidationError(msg)

        if data.get('new_password') != data.get('confirm_password'):
            msg = _('Passwords do not match')
            raise serializers.ValidationError(msg)

        validate_password(data.get('new_password'))

        return data


class UserResetPasswordSerializer(serializers.Serializer):
    """Serializer for the user reset password object."""
    id = serializers.IntegerField()

    def validate(self, data):
        """Validate and authenticate the user."""
        try:
            user = get_user_model().objects.get(pk=data.get('id'))
        except ObjectDoesNotExist:
            msg = _('User does not exist')
            raise serializers.ValidationError(msg)

        return user
