from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404

from core.models import DataType
from dataType.serializers import DataTypeSerializer

from knox.auth import TokenAuthentication
from rest_framework import (
    viewsets,
    permissions,
)


class DataTypeViewSet(viewsets.ModelViewSet):
    """Viewset for data types"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)
    queryset = DataType.objects.all()
    serializer_class = DataTypeSerializer
