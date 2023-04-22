"""
Serializers for the user API View.
"""
from django.utils.translation import gettext as _
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from rest_framework import serializers
from django.contrib.auth import (
    get_user_model,
    authenticate,
)

from core.models.User import Maintainer


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""
    class Meta:
        model = get_user_model()
        fields = ('email', 'password', 'name', 'first_last_name', 'second_last_name', 'phone', 'is_superuser')
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}

    def create(self, validated_data):
        """Create and return a user with encrypted password."""
        with transaction.atomic():
            try:
                new_user = get_user_model().objects.create_user(**validated_data)
                if not validated_data.get('is_superuser', False):
                    # Creating its maintainer profile.
                    Maintainer.objects.create(user=new_user)
            except Exception as e:
                msg = _('Unable to create user')
                raise serializers.ValidationError(msg, code='')

            return new_user

    def update(self, instance, validated_data):
        """Update and return user."""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class UserMinimalSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""
    class Meta:
        model = get_user_model()
        fields = ('id', 'name', 'last_name', 'is_superuser', 'is_active')


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

