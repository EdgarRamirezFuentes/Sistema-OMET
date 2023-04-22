from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404

from core.models import DataType
from dataType.serializers import DataTypeSerializer

from knox.auth import TokenAuthentication
from rest_framework import (
    viewsets,
    mixins,
    response,
    status,
    permissions,
)


class DataTypeViewSet(viewsets.ModelViewSet):
    """Viewset for active types"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)
    queryset = DataType.objects.all()
    serializer_class = DataTypeSerializer

    def list(self, request, *args, **kwargs):
        """List the all the data types filtered by name, and is_active"""
        try:
            name = request.query_params.get('name', None)
            is_active = request.query_params.get('is_active', None)

            queryset = self.queryset

            if name:
                queryset = queryset.filter(name=name)

            if is_active:
                queryset = queryset.filter(is_active=is_active)

            serializer = self.get_serializer(queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """Set the data type as active/inactive"""
        try:
            instance = self.get_object()
            instance.is_active = not instance.is_active
            instance.save()
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist:
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)
