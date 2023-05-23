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
           raise serializers.ValidationError('RFC is required.')

        if not validate_rfc(rfc):
            raise serializers.ValidationError('Invalid RFC.')

        return format_data(rfc)

    def validate_phone(self, phone):
        if not phone:
           raise serializers.ValidationError('Phone is required.')

        if not validate_phone(phone):
            raise serializers.ValidationError('Invalid phone.')

        return format_data(phone)






class CustomerMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'name',)
