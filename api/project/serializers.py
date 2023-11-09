from django.utils.translation import gettext as _

from dataType.serializers import (
    DataTypeSerializer,
    ValidatorSerializer
)

from customer.serializers import MinimalCustomerSerializer

from .utils import (
    validate_name,
    format_name,
)

from core.models import (
    Project,
    ProjectApp,
    AppModel,
    ModelField,
    ValidatorValue,
)

from rest_framework import serializers


class ProjectSerializer(serializers.ModelSerializer):
    """Default serializer for project model."""

    class Meta:
        model = Project
        fields = ('id', 'name', 'description',
                  'customer')


class MinimalProjectSerializer(serializers.ModelSerializer):
    """Serielizer for project model with minimal fields."""
    customer = MinimalCustomerSerializer()

    class Meta:
        model = Project
        fields = ('id', 'name', 'customer')


class FullProjectSerializer(serializers.ModelSerializer):
    """Serializer for project model with all fields and its full data."""
    customer = MinimalCustomerSerializer()

    class Meta:
        model = Project
        fields = ('id', 'name', 'description',
                  'customer')


class ProjectAppSerializer(serializers.ModelSerializer):
    """Default serializer for project app model."""

    class Meta:
        model = ProjectApp
        fields = ('id', 'name', 'description',
                  'project')

    def validate_name(self, name):
        """Validate the project app name contains only letters.

        Args:
            name (str): Project app name.

        Raises:
            serializers.ValidationError: If project app name is not valid.

        Returns:
            str: Formatted project app name.
        """
        if not name.strip().isalpha():
            raise serializers.ValidationError(
                _('El nombre de una aplicación debe contener solo letras.')
            )

        return format_name(name)


class MinimalProjectAppSerializer(serializers.ModelSerializer):
    """Serializer for project app model with minimal fields."""
    project = MinimalProjectSerializer()

    class Meta:
        model = ProjectApp
        fields = ('id', 'name', 'project')


class FullProjectAppSerializer(serializers.ModelSerializer):
    """Serializer for project app model with all fields and its full data."""
    project = MinimalProjectSerializer()

    class Meta:
        model = ProjectApp
        fields = ('id', 'name', 'description',
                  'project')


class AppModelSerializer(serializers.ModelSerializer):
    """Default serializer for project model."""

    class Meta:
        model = AppModel
        fields = ('id', 'name', 'project_app')

    def validate_name(self, name):
        """Validate model name.

        Args:
            name (str): Model name.

        Raises:
            serializers.ValidationError: If model name is not valid.

        Returns:
            str: Formatted model name.
        """
        is_valid_name = validate_name(name)

        if not is_valid_name:
            raise serializers.ValidationError(
                _('El nombre del modelo debe comenzar y terminar con una letra,' +
                  ' y solo puede contener letras, guiones medios y espacios.')
            )

        return format_name(name)


class MinimalAppModelSerializer(serializers.ModelSerializer):
    """Serializer for project model with minimal fields."""

    class Meta:
        model = AppModel
        fields = ('id', 'name')


class FullAppModelSerializer(serializers.ModelSerializer):
    """Serializer for project model with all fields and its full data."""
    project_app = MinimalProjectAppSerializer()

    class Meta:
        model = AppModel
        fields = ('id', 'name',
                  'project_app')


class ModelFieldSerializer(serializers.ModelSerializer):
    """Default serializer for model field model."""

    class Meta:
        model = ModelField
        fields = ('id', 'name', 'data_type',
                  'order', 'caption',
                   'app_model', 'model_field_relation')

    def validate_name(self, name):
        """Validate model field name.

        Args:
            name (str): Model field name.

        Raises:
            serializers.ValidationError: If model field name is not valid.

        Returns:
            str: Formatted model field name.
        """
        is_valid_name = validate_name(name)

        if not is_valid_name:
            raise serializers.ValidationError(
                _('El nombre del campo de un modelo debe comenzar y terminar con una letra,' +
                  ' y solo puede contener letras, guiones medios y espacios.')
            )

        return format_name(name)


class MinimalModelFieldSerializer(serializers.ModelSerializer):
    """Serializer for model field model with minimal fields."""
    data_type = DataTypeSerializer()

    class Meta:
        model = ModelField
        fields = ('id', 'name', 'data_type')


class FullModelFieldSerializer(serializers.ModelSerializer):
    """Serializer for model field model with all fields and its full data."""
    project_model = MinimalAppModelSerializer()
    data_type = DataTypeSerializer()

    class Meta:
        model = ModelField
        fields = ('id', 'name', 'data_type',
                  'app_model', 'created_at')


class ValidatorValueSerializer(serializers.ModelSerializer):
    """Default serializer for validator value model."""

    class Meta:
        model = ValidatorValue
        fields = ('id', 'validator', 'model_field',
                  'value')


class FullValidatorValueSerializer(serializers.ModelSerializer):
    """Serializer for validator value model with all fields and its full data."""
    validator = ValidatorSerializer()
    model_field = MinimalModelFieldSerializer()

    class Meta:
        model = ValidatorValue
        fields = ('id', 'validator', 'value',
                  'model_field')


class ModelFieldValidatorValueSerializer(serializers.ModelSerializer):
    """Serializer for model field validators."""
    validator = ValidatorSerializer()

    class Meta:
        model = ValidatorValue
        fields = ('id', 'validator', 'value')
