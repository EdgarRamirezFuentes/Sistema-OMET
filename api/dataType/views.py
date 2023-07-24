from django.http import Http404

from core.models import (
    DataType,
)

from dataType.serializers import (
    FullDataTypeSerializer,
)

from knox.auth import TokenAuthentication
from rest_framework import (
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
        is_active = request.query_params.get('is_active', None)

        queryset = self.queryset

        if is_active:
            is_active = True if is_active.lower() == 'true' else False
            queryset = queryset.filter(is_active=is_active)

        serializer = FullDataTypeSerializer(queryset, many=True)
        return response.Response(serializer.data)
