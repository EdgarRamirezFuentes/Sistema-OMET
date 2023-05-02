from user.serializers import (
    MaintainerMinimalSerializer,
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
    Maintainer,
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
        fields = ('id', 'project', 'maintainer',)


class MaintenanceDataSerializer(serializers.ModelSerializer):
    project = ProjectMinimalSerializer()
    maintainer = MaintainerMinimalSerializer()

    class Meta:
        model = Maintenance
        fields = ('id', 'project', 'maintainer')

class ProjectMaintainersSerializer(serializers.ModelSerializer):
    maintainer = MaintainerMinimalSerializer()

    class Meta:
        model = Maintenance
        fields = ('maintainer', )

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
                  'project', 'created_at')


class DataTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = DataType
        fields = ('id', 'name')


class ModelFieldSerializer(serializers.ModelSerializer):

    class Meta:
        model = ModelField
        fields = ('id', 'name', 'data_type',
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
