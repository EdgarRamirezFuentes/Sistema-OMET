from user.serializers import (
    UserMinimalSerializer,
)

from customer.serializers import CustomerMinimalSerializer


from rest_framework import serializers

from dataType.serializers import DataTypeSerializer
from core.models import (
    Project,
    ProjectModel,
    ModelField,
    Maintenance,
    DataType,
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
        fields = ('id', 'name', 'is_static',
                  'project')


class ProjectModelMinimalSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectModel
        fields = ('id', 'name', 'is_static')


class ProjectModelDataSerializer(serializers.ModelSerializer):
    project = ProjectMinimalSerializer()

    class Meta:
        model = ProjectModel
        fields = ('id', 'name', 'is_static',
                  'project', 'is_active')


class ModelFieldSerializer(serializers.ModelSerializer):

    class Meta:
        model = ModelField
        fields = ('id', 'name', 'data_type',
                  'order', 'caption', 'is_required',
                  'project_model')


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
