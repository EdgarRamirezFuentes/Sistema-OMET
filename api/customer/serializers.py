from rest_framework import serializers
from core.models import  Customer
from .utils import (
    validate_rfc,
    validate_phone,
    format_data,
)


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'rfc', 'name', 'phone', 'email')

    def validate_rfc(self, rfc):
        if not rfc:
           raise serializers.ValidationError('RFC es requerido.')

        if not validate_rfc(rfc):
            raise serializers.ValidationError('RFC no contiene una estructura válida.')

        return format_data(rfc)

    def validate_phone(self, phone):
        if not phone:
           raise serializers.ValidationError('Número telefónico es requerido.')

        if not validate_phone(phone):
            raise serializers.ValidationError('El número telefónico no cumple con el formato establecido.\n' +
                  'Ejemplo: +521234567890 o 1234567890.')

        return format_data(phone)


class MinimalCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'name',)
