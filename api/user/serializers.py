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
    profile_image = Base64ImageField(required=False, allow_null=True)
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
        if not name:
            raise serializers.ValidationError(
                _('Nombre es requerido.')
            )

        if not validate_name(name):
            raise serializers.ValidationError(
                _('El nombre solo debe contener letras y espacios.')
            )
        return format_data(name)

    def validate_first_last_name(self, first_last_name:str)->str:
        """Validate a first last name.

        Args:
            first_last_name (str): first last name.

        Returns:
            str: Formatted first last name.
        """
        if not first_last_name:
            return serializers.ValidationError(
                _('Apellido paterno es requerido.')
            )

        if not validate_name(first_last_name):
            raise serializers.ValidationError(
                _('El apellido paterno solo debe contener letras y espacios.')
            )
        return format_data(first_last_name)

    def validate_second_last_name(self, second_last_name:str)->str:
        """Validate a second last name.

        Args:
            second_last_name (str): second last name.

        Returns:
            str: Formatted second last name.
        """
        if not second_last_name:
            return serializers.ValidationError(
                _('Apellido materno es requerido.')
            )

        if not validate_name(second_last_name):
            raise serializers.ValidationError(
                _('El apellido materno solo debe contener letras y espacios.')
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
                _('RFC es requerido.')
            )

        if not validate_rfc(rfc):
            raise serializers.ValidationError(
                _('RFC no contiene una estructura válida.')
            )

        rfc = format_data(rfc)

        if get_user_model().objects.filter(rfc=rfc).exists():
            raise serializers.ValidationError(
                _('RFC ya registrado.')
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
                _('La contraseña debe de tener una longitud de por lo menos 8 caracteres, ' +
                   'debe contener por lo menos un número, una letra mayúscula, una letra minúscula ' +
                   'y un caracter especial. (@$_-!%*?&).')
            )

        return password

    def validate_phone(self, phone:str)->str:
        """Validate a phone number.

        Args:
            phone (str): phone number.

        Returns:
            str: Formatted phone number.
        """
        if not phone:
           raise serializers.ValidationError('Número telefónico es requerido.')

        if not validate_phone(phone):
            raise serializers.ValidationError(
                _('El número telefónico no cumple con el formato establecido.\n' +
                  'Ejemplo: +521234567890 o 1234567890.')
            )
        return format_data(phone)


    def update(self, instance, validated_data):
        """Update and return user."""
        password = validated_data.pop('password', None)

        user = super().update(instance, validated_data)

        return user

    def partial_update(self, instance, validated_data):
        """Update and return user."""
        password = validated_data.pop('password', None)

        user = super().partial_update(instance, validated_data)

        return user
    def create(self, validated_data):
        """Create and return a new user."""
        user = get_user_model().objects.create_user(**validated_data)
        return user


class FullUserSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""
    profile_image = Base64ImageField(required=False)
    class Meta:
        model = get_user_model()
        fields = ('id', 'rfc', 'email', 'name', 'first_last_name',
                  'second_last_name', 'profile_image', 'phone',
                  'is_superuser', 'is_staff')


class MinimalUserSerializer(serializers.ModelSerializer):
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

        msg = _('Las credenciales que se ingresarón no son válidas.')
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


class UserResetPasswordSerializer(serializers.Serializer):
    """Serializer for the user reset password object."""
    id = serializers.IntegerField()

    def validate(self, data):
        """Validate and authenticate the user."""
        try:
            user = get_user_model().objects.get(pk=data.get('id'))
        except ObjectDoesNotExist:
            msg = _('El usuario no existe.')
            raise serializers.ValidationError(msg)

        return user
