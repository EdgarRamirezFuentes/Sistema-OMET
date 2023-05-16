from rest_framework import serializers
from core.models import (
    DataType,
    ConfigFields,
)

from .utils import (
    validate_name,
    format_name,
)


class DataTypeSerializer(serializers.ModelSerializer):
    """Serializer for data type objects"""
    input_type = serializers.ChoiceField(choices=DataType.INPUT_TYPE_CHOICES)

    class Meta:
        model = DataType
        fields = ('id', 'name',
                  'description', 'input_type')


class DataTypeMinimalSerializer(serializers.ModelSerializer):
    """Serializer for data type objects"""
    input_type = serializers.ChoiceField(choices=DataType.INPUT_TYPE_CHOICES)

    class Meta:
        model = DataType
        fields = ('id', 'name', 'input_type')


class ConfigFieldsSerializer(serializers.ModelSerializer):
    """Serializer for config fields objects"""

    class Meta:
        model = ConfigFields
        fields = ('id', 'name',
                  'description', 'value_type', 'data_type')

    def validate_name(self, value):
        """Validate name"""
        if not validate_name(value):
            raise serializers.ValidationError('Invalid name')

        return format_name(value)


class ConfigFieldsMinimalSerializer(serializers.ModelSerializer):
    """Serializer for config fields objects"""

    class Meta:
        model = ConfigFields
        fields = ('id', 'name', 'value_type',)
