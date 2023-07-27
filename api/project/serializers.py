from django.utils.translation import gettext as _

from user.serializers import (
    MinimalUserSerializer,
)

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
    ProjectModel,
    ModelField,
    Maintenance,
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


class MaintenanceSerializer(serializers.ModelSerializer):
    """Default serializer for maintenance model."""
    class Meta:
        model = Maintenance
        fields = ('id', 'project', 'user',)


class MinimalMaintenanceSerializer(serializers.ModelSerializer):
    """Serializer for maintenance model with minimal fields."""
    project = MinimalProjectSerializer()
    user = MinimalUserSerializer()

    class Meta:
        model = Maintenance
        fields = ('id', 'project', 'user')


class ProjectMaintainersSerializer(serializers.ModelSerializer):
    """Serializer for project maintainers."""
    user = MinimalUserSerializer()

    class Meta:
        model = Maintenance
        fields = ('id', 'user')


class ProjectModelSerializer(serializers.ModelSerializer):
    """Default serializer for project model."""

    class Meta:
        model = ProjectModel
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


class MinimalProjectModelSerializer(serializers.ModelSerializer):
    """Serializer for project model with minimal fields."""

    class Meta:
        model = ProjectModel
        fields = ('id', 'name')


class FullProjectModelSerializer(serializers.ModelSerializer):
    """Serializer for project model with all fields and its full data."""
    project_app = MinimalProjectAppSerializer()

    class Meta:
        model = ProjectModel
        fields = ('id', 'name',
                  'project_app', 'is_active')


class ModelFieldSerializer(serializers.ModelSerializer):
    """Default serializer for model field model."""

    class Meta:
        model = ModelField
        fields = ('id', 'name', 'data_type',
                  'order', 'caption',
                   'project_model')

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
    project_model = MinimalProjectModelSerializer()
    data_type = DataTypeSerializer()

    class Meta:
        model = ModelField
        fields = ('id', 'name', 'data_type',
                  'project_model', 'created_at')


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
