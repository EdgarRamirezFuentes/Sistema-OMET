from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from core.models import Customer
from customer.serializers import CustomerSerializer
from core.permissions import (
    isActiveUser,
    isMaintainer,
)

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

            if is_active and is_active in ['true', 'false']:
                is_active = True if is_active == 'true' else False
                queryset = queryset.filter(is_active=is_active)

            serializer = self.get_serializer(queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ChangeCustomerStatus(views.APIView):
    """Change customer status"""
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser, isActiveUser]
    serializer_class = CustomerSerializer

    def post(self, request, *args, **kwargs):
        """Change customer status"""
        try:
            customer_id = kwargs.get('pk', None)

            if not customer_id :
                return response.Response(status=status.HTTP_400_BAD_REQUEST)

            customer = Customer.objects.get(id=customer_id)
            customer.is_active = not customer.is_active
            customer.save()

            return response.Response(status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)
