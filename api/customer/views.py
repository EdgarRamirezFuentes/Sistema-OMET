from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from core.models import Customer
from customer.serializers import CustomerSerializer
from knox.auth import TokenAuthentication
from rest_framework import (
    viewsets,
    permissions,
    status,
    response,
)


class CustomerViewSet(viewsets.ModelViewSet):
    """Viewset for active customers"""
    serializer_class = CustomerSerializer
    queryset = Customer.objects.all()
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def list(self, request, *args, **kwargs):
        """List all customers filtered by RFC, email, and is_active."""
        try:
            rfc = request.query_params.get('rfc', None)
            email = request.query_params.get('email', None)
            is_active = request.query_params.get('is_active', None)

            queryset = self.queryset

            if rfc:
                queryset = queryset.filter(rfc=rfc)

            if email:
                queryset = queryset.filter(email=email)

            if is_active:
                queryset = queryset.filter(is_active=is_active)

            serializer = self.get_serializer(queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """Set the customer status as active or inactive"""
        try:
            instance = self.get_object()
            instance.is_active = not instance.is_active
            instance.save()
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

