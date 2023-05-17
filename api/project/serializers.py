from django.utils.translation import gettext as _
from user.serializers import (
    UserMinimalSerializer,
)

from .utils import (
    validate_name,
    format_name,
)

from customer.serializers import CustomerMinimalSerializer


from rest_framework import serializers

from dataType.serializers import DataTypeSerializer
from core.models import (
    Project,
    ProjectModel,
    ModelField,
    Maintenance,
    ConfigValues,
)


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = ('id', 'name', 'description',
                  'customer')


class ProjectMinimalSerializer(serializers.ModelSerializer):
    customer = CustomerMinimalSerializer()
    class Meta:
        model = Project
        fields = ('id', 'name', 'customer')


class ProjectDataSerializer(serializers.ModelSerializer):
    customer = CustomerMinimalSerializer()

    class Meta:
        model = Project
        fields = ('id', 'name', 'description',
                  'customer')


class MaintenanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Maintenance
        fields = ('id', 'project', 'user',)


class MaintenanceMinimalSerializer(serializers.ModelSerializer):
    project = ProjectMinimalSerializer()
    user = UserMinimalSerializer()

    class Meta:
        model = Maintenance
        fields = ('id', 'project', 'user')


class ProjectModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectModel
        fields = ('id', 'name', 'project')

    def validate_name(self, name):
        # Validate model name
        is_valid_name = validate_name(name)

        if not is_valid_name:
            raise serializers.ValidationError(
                _('The model name does not fulfill the requirements.')
            )

        return format_name(name)


class ProjectModelMinimalSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectModel
        fields = ('id', 'name')


class ProjectModelDataSerializer(serializers.ModelSerializer):
    project = ProjectMinimalSerializer()

    class Meta:
        model = ProjectModel
        fields = ('id', 'name',
                  'project', 'is_active')


class ModelFieldSerializer(serializers.ModelSerializer):

    class Meta:
        model = ModelField
        fields = ('id', 'name', 'data_type',
                  'order', 'caption', 'is_required',
                   'project_model')

    def validate_name(self, name):
        # Validate model field name
        is_valid_name = validate_name(name)

        if not is_valid_name:
            raise serializers.ValidationError(
                _('The field name does not fulfill the requirements.')
            )

        return format_name(name)


class ModelFieldMinimalSerializer(serializers.ModelSerializer):
    data_type = DataTypeSerializer()

    class Meta:
        model = ModelField
        fields = ('id', 'name', 'data_type')


class ModelFieldDataSerializer(serializers.ModelSerializer):
    project_model = ProjectModelMinimalSerializer()
    data_type = DataTypeSerializer()

    class Meta:
        model = ModelField
        fields = ('id', 'name', 'data_type',
                  'project_model', 'created_at')


class ConfigValuesSerializer(serializers.ModelSerializer):

    class Meta:
        model = ConfigValues
        fields = ('id', 'config_field', 'model_field',
                  'value')


class ConfigValuesMinimalSerializer(serializers.ModelSerializer):
    config_field = ModelFieldMinimalSerializer()
    model_field = ModelFieldMinimalSerializer()

    class Meta:
        model = ConfigValues
        fields = ('id', 'config_field', 'value',
                  'model_field')
