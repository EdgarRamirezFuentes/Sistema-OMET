from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist

from core.models import Customer
from customer.serializers import CustomerSerializer
from core import permissions as custom_permissions

from knox.auth import TokenAuthentication
from rest_framework import (
    viewsets,
    permissions,
    status,
    response,
    views,
)


class CustomerViewSet(viewsets.ModelViewSet):
    """Viewset for active customers"""
    serializer_class = CustomerSerializer
    queryset = Customer.objects.all()
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser]

    def list(self, request, *args, **kwargs):
        """List all customers filtered by RFC and email."""
        try:
            email = request.query_params.get('email', None)

            queryset = self.queryset

            if email:
                queryset = queryset.filter(email__icontains=email)

            serializer = self.get_serializer(queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)
