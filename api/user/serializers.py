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
    format_data,
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

    def validate_name(self, name:str)->str:
        """Validate a name.

        Args:
            name (str): name.

        Returns:
            str: Formatted name.
        """
        if not validate_name(name):
            raise serializers.ValidationError(
                _('Name must contain only letters.')
            )
        return format_data(name)

    def validate_first_last_name(self, first_last_name:str)->str:
        """Validate a first last name.

        Args:
            first_last_name (str): first last name.

        Returns:
            str: Formatted first last name.
        """
        if not validate_name(first_last_name):
            raise serializers.ValidationError(
                _('First last name must contain only letters.')
            )
        return format_data(first_last_name)

    def validate_second_last_name(self, second_last_name:str)->str:
        """Validate a second last name.

        Args:
            second_last_name (str): second last name.

        Returns:
            str: Formatted second last name.
        """
        if not validate_name(second_last_name):
            raise serializers.ValidationError(
                _('Second last name must contain only letters.')
            )
        return format_data(second_last_name)

    def validate_rfc(self, rfc:str)->str:
        """Validate a RFC.

        Args:
            rfc (str): RFC.

        Returns:
            str: Formatted RFC.
        """
        if not rfc:
            raise serializers.ValidationError(
                _('RFC is required.')
            )

        if not validate_rfc(rfc):
            raise serializers.ValidationError(
                _('RFC not valid.')
            )

        rfc = format_data(rfc)

        if get_user_model().objects.filter(rfc=rfc).exists():
            raise serializers.ValidationError(
                _('RFC already exists.')
            )

        return rfc

    def validate_password(self, password:str)->str:
        """Validate a password.

        Args:
            password (str): password.

        Returns:
            str: Formatted password.
        """
        if not validate_password(password):
            raise serializers.ValidationError(
                _('Password must be at least 8 characters long and contain at least one number' + \
                    'one uppercase letter,and one lowercase letter, and one special character(@$_-!%*?&).')
            )

        return password

    def validate_phone(self, phone:str)->str:
        """Validate a phone number.

        Args:
            phone (str): phone number.

        Returns:
            str: Formatted phone number.
        """
        if not validate_phone(phone):
            raise serializers.ValidationError(
                _('Phone number not valid.')
            )
        return format_data(phone)

    def update(self, instance, validated_data):
        """Update and return user."""
        password = validated_data.pop('password', None)

        user = super().update(instance, validated_data)

        return user

    def create(self, validated_data):
        """Create and return a new user."""
        user = get_user_model().objects.create_user(**validated_data)
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
