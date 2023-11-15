from django.utils.translation import gettext as _

from dataType.serializers import (
    DataTypeSerializer,
    ValidatorSerializer
)

from customer.serializers import MinimalCustomerSerializer

from .utils import (
    validate_project_name,
)

from core.models import (
    Project,
    ProjectApp,
    AppModel,
    ModelField,
    ValidatorValue,
    ForeignKeyRelation
)

from rest_framework import serializers


class ProjectSerializer(serializers.ModelSerializer):
    """Default serializer for project model."""

    class Meta:
        model = Project
        fields = ('id', 'name', 'description',
                  'customer')

    def validate_name(self, name):
        """Validate the project name contains only letters.

        Args:
            name (str): Project name.

        Raises:
            serializers.ValidationError: If project name is not valid.

        Returns:
            str: Formatted project name.
        """
        name = name.strip()

        if not validate_project_name(name):
            raise serializers.ValidationError(
                _('El nombre de un proyecto debe contener solo letras del alfabeto inglés y espacios.')
            )

        return name


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
        name = name.strip()

        if not name.isalpha():
            raise serializers.ValidationError(
                _('El nombre de una aplicación debe contener solo letras del alfabeto inglés.')
            )

        return name


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
        name = name.strip()

        if not name.isalpha():
            raise serializers.ValidationError(
                _('El nombre de un modelo debe contener solo letras del alfabeto inglés.')
            )

        return name


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
                   'app_model')

    def validate_name(self, name):
        """Validate model field name.

        Args:
            name (str): Model field name.

        Raises:
            serializers.ValidationError: If model field name is not valid.

        Returns:
            str: Formatted model field name.
        """
        name = name.strip()

        if not name.isalpha():
            raise serializers.ValidationError(
                _('El nombre de un campo de modelo debe contener solo letras del alfabeto inglés.')
            )

        return name


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


class ForeignKeyRelationSerializer(serializers.ModelSerializer):
    """Default serializer for foreign key relation model."""

    class Meta:
        model = ForeignKeyRelation
        fields = ('id', 'model_field_origin', 'model_field_related')
