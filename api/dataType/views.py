from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist

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
    status
)


class DataTypeViewSet(viewsets.ModelViewSet):
    """Viewset for data types"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)
    queryset = DataType.objects.all()
    serializer_class = DataTypeSerializer

    def list(self, request, *args, **kwargs):
        """List all data types filtered by is_active"""
        is_active = request.query_params.get('is_active', None)

        queryset = self.queryset

        if is_active:
            is_active = True if is_active.lower() == 'true' else False
            queryset = queryset.filter(is_active=is_active)

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


class ChangeDataTypeStatusView(views.APIView):
    """View for changing data type status"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)
    serializer_class = DataTypeSerializer

    def post(self, request, *args, **kwargs):
        """Change the status of the data type"""
        try:
            data_type_id = kwargs.get('pk', None)

            if not data_type_id :
                return response.Response(status=status.HTTP_400_BAD_REQUEST)

            data_type = DataType.objects.get(id=data_type_id)
            data_type.is_active = not data_type.is_active
            data_type.save()

            return response.Response(status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


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
        """List all config fields filtered by data type id, and is_active"""
        data_type = request.query_params.get('data_type')
        is_active = request.query_params.get('is_active', None)

        queryset = self.queryset

        if data_type:
            queryset = queryset.filter(data_type__id=data_type)

        if is_active:
            is_active = True if is_active.lower() == 'true' else False
            queryset = queryset.filter(is_active=is_active)

        serializer = ConfigFieldsMinimalSerializer(queryset, many=True)
        return response.Response(serializer.data)


class ChangeConfigFieldStatusView(views.APIView):
    """View for changing config field status"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)
    serializer_class = ConfigFieldsSerializer

    def post(self, request, *args, **kwargs):
        """Change the status of the config field"""
        try:
            config_field_id = kwargs.get('pk', None)

            if not config_field_id :
                return response.Response(status=status.HTTP_400_BAD_REQUEST)

            config_field = ConfigFields.objects.get(id=config_field_id)
            config_field.is_active = not config_field.is_active
            config_field.save()

            return response.Response(status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)
