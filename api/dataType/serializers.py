from rest_framework import serializers
from core.models import (
    DataType,
    Validator,
)


class ValidatorSerializer(serializers.ModelSerializer):
    """Serializer for validator objects"""

    class Meta:
        model = Validator
        fields = ('id', 'name',
                  'description')


class DataTypeSerializer(serializers.ModelSerializer):
    """Serializer for data type objects"""

    class Meta:
        model = DataType
        fields = ('id', 'name',
                  'description')


class FullDataTypeSerializer(serializers.ModelSerializer):
    """Serializer for data type objects"""
    validators = ValidatorSerializer(many=True)

    class Meta:
        model = DataType
        fields = ('id', 'name', 'validators')
