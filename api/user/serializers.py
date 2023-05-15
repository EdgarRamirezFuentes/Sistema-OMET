"""
Serializers for the user API View.
"""
from django.utils.translation import gettext as _
from django.core.exceptions import ObjectDoesNotExist
from .utils import (
    validate_password,
    validate_name,
    validate_rfc,
    validate_phone,
)
from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from django.contrib.auth import (
    get_user_model,
    authenticate,
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""
    profile_image = Base64ImageField(required=False)
    class Meta:
        model = get_user_model()
        fields = ('rfc', 'email', 'password', 'name',
                  'first_last_name', 'second_last_name',
                  'phone', 'profile_image', 'is_superuser')
        extra_kwargs = {'password': {'write_only': True, 'min_length': 8}}

    def validate(self, data):
        """Validate and authenticate the user."""

        if not validate_name(data['name']):
            raise serializers.ValidationError(
                _('Name must contain only letters.')
            )

        if not validate_name(data['first_last_name']):
            raise serializers.ValidationError(
                _('First last name must contain only letters.')
            )

        if not validate_name(data['second_last_name']):
            raise serializers.ValidationError(
                _('Second last name must contain only letters.')
            )

        if not validate_rfc(data['rfc']):
            raise serializers.ValidationError(
                _('RFC not valid.')
            )

        if not validate_password(data['password']):
            raise serializers.ValidationError(
                _('Password must be at least 8 characters long and contain at least one number' + \
                    'one uppercase letter,and one lowercase letter, and one special character(@$_-!%*?&).')
            )

        if not validate_phone(data['phone']):
            raise serializers.ValidationError(
                _('Phone number not valid.')
            )

        return data

    def save(self, **kwargs):
        """Create a new user."""
        self.validated_data['name'] = self.validated_data['name'].lower()
        self.validated_data['first_last_name'] = self.validated_data['first_last_name'].lower()
        self.validated_data['second_last_name'] = self.validated_data['second_last_name'].lower()
        self.validated_data['rfc'] = self.validated_data['rfc'].lower()
        user = get_user_model().objects.create_user(**self.validated_data)
        return user

    def update(self, instance, validated_data):
        """Update and return user."""
        password = validated_data.pop('password', None)

        if self.validated_data['name']:
            self.validated_data['name'] = self.validated_data['name'].lower()

        if self.validated_data['first_last_name']:
            self.validated_data['first_last_name'] = self.validated_data['first_last_name'].lower()

        if self.validated_data['second_last_name']:
            self.validated_data['second_last_name'] = self.validated_data['second_last_name'].lower()

        if self.validated_data['rfc']:
            self.validated_data['rfc'] = self.validated_data['rfc'].lower()

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
        fields = ('id', 'name', 'first_last_name', 'second_last_name', 'profile_image', 'is_superuser', 'is_staff')


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

        if user and user.is_staff:
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
