from django.http import Http404
from core.models import (
    DataType,
)

from dataType.serializers import (
    FullDataTypeSerializer,
)
from django.core.exceptions import ObjectDoesNotExist
from knox.auth import TokenAuthentication
from rest_framework import (
    status,
    viewsets,
    mixins,
    permissions,
    response,
)


class DataTypeViewSet(mixins.ListModelMixin,
                      viewsets.GenericViewSet):
    """Viewset for data types"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated,]
    queryset = DataType.objects.all()
    serializer_class = FullDataTypeSerializer

    def list(self, request, *args, **kwargs):
        """List all data types filtered by is_active"""

        serializer = FullDataTypeSerializer(self.queryset, many=True)
        return response.Response(serializer.data)
    
    def retrieve(self, request, *args, **kwargs):
        """Retrieve a user by id."""
        try:
            instance = self.get_object()
            serializer = FullDataTypeSerializer(instance)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)
