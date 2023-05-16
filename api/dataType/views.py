from django.http import Http404

from core.models import (
    DataType,
    ConfigFields,
    ConfigValues
)

from dataType.serializers import (
    DataTypeSerializer,
    DataTypeMinimalSerializer,
    ConfigFieldsSerializer,
    ConfigFieldsMinimalSerializer,

)

from knox.auth import TokenAuthentication
from rest_framework import (
    viewsets,
    permissions,
    views,
    response,
)


class DataTypeViewSet(viewsets.ModelViewSet):
    """Viewset for data types"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)
    queryset = DataType.objects.all()
    serializer_class = DataTypeSerializer

    def list(self, request, *args, **kwargs):
        """List all data types"""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = DataTypeMinimalSerializer(queryset, many=True)
        return response.Response(serializer.data)

    def retrieve(self, *args, **kwargs):
        """Retrieve a data type and its config fields"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        config_fields = ConfigFields.objects.filter(data_type=instance)
        config_fields_serializer = ConfigFieldsMinimalSerializer(config_fields, many=True)
        return response.Response({
            'data_type': serializer.data,
            'config_fields': config_fields_serializer.data
        })


class InputTypeChoicesListView(views.APIView):
    """View for input type choices"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = DataType.INPUT_TYPE_CHOICES

    def get(self, request, format=None):
        """Return a list of all input type choices"""
        return response.Response(self.queryset)


class ValueTypeChoicesListView(views.APIView):
    """View for value type choices"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = ConfigFields.VALUE_TYPE_CHOICES

    def get(self, request, format=None):
        """Return a list of all value type choices"""
        return response.Response(self.queryset)


class ConfigFieldsViewSet(viewsets.ModelViewSet):
    """Viewset for config fields"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)
    queryset = ConfigFields.objects.all()
    serializer_class = ConfigFieldsSerializer

    def list(self, request, *args, **kwargs):
        """List all config fields filtered by data type id"""
        data_type = request.query_params.get('data_type')
        queryset = self.queryset

        if data_type:
            queryset = queryset.filter(data_type__id=data_type)

        serializer = ConfigFieldsMinimalSerializer(queryset, many=True)
        return response.Response(serializer.data)
