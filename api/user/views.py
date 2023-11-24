"""
Views for the user API.
"""
import secrets
from django.utils import timezone
from django.utils.translation import gettext as _
from django.contrib.auth import login
from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model

from rest_framework import (
    generics,
    permissions,
    status,
    response,
    viewsets,
    permissions,
    views,
)

from knox.auth import TokenAuthentication
from knox.views import (
    LoginView as KnoxLoginView,
    LogoutView as KnoxLogoutView,
    LogoutAllView as KnoxLogoutAllView
)

from drf_spectacular.utils import extend_schema

from core.schemes import KnoxTokenScheme

from user.serializers import (
    UserSerializer,
    FullUserSerializer,
    MinimalUserSerializer,
    UserLoginSerializer,
    UserChangePasswordSerializer,
    UserResetPasswordSerializer,
)

from core.tasks import send_reset_password_email
from core import permissions as custom_permissions


class UserViewSet(viewsets.ModelViewSet):
    """Viewset for users."""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser]
    serializer_class = UserSerializer
    queryset = get_user_model().objects.all()

    def list(self, request, *args, **kwargs):
        """List all users filtered by is_staff, email, and is_superuser."""
        try:
            is_staff = request.query_params.get('is_active', None)
            email = request.query_params.get('email', None)
            is_superuser = request.query_params.get('is_superuser', None)

            queryset = self.queryset

            if is_staff is not None:
                is_staff = False if is_staff.lower().strip() != 'true' else True
                queryset = queryset.filter(is_staff=is_staff)

            if email is not None:
                queryset = queryset.filter(email__icontains=email)

            if is_superuser is not None:
                is_superuser = False if is_superuser.lower().strip() != 'true' else True
                queryset = queryset.filter(is_superuser=is_superuser)

            serializer = MinimalUserSerializer(queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a user by id."""
        try:
            instance = self.get_object()
            serializer = FullUserSerializer(instance)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ChangeUserStatusView(views.APIView):
    """Change a user's status."""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser]
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        try:
            user_id = kwargs.get('pk', None)
            user = get_user_model().objects.get(id=user_id)
            user.is_staff = not user.is_staff
            user.save()

            return response.Response(status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class LoginView(KnoxLoginView):
    """Authenticate a user and return a token."""
    permission_classes = [permissions.AllowAny,]
    serializer_class = UserLoginSerializer

    def get_user_serializer_class(self):
        return FullUserSerializer

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        login(request, user)
        user.last_login = timezone.now()
        user.save()
        return super(LoginView, self).post(request, format=None)


@extend_schema(request=None, responses=None)
class LogoutView(KnoxLogoutView):
    """Logout a user."""
    pass


@extend_schema(request=None, responses=None)
class LogoutAllView(KnoxLogoutAllView):
    """Logout user from all devices."""
    pass


class ChangePasswordView(generics.UpdateAPIView):
    """Change a user's password."""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated,]
    serializer_class = UserChangePasswordSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.get_object()
        user.set_password(serializer.data.get('new_password'))
        user.save()

        return response.Response({
            "message": "Contraseña actualizada correctamente.",
            },
            status=status.HTTP_200_OK)


class ResetPasswordView(views.APIView):
    """Reset a user's password."""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [custom_permissions.isAdminUser,]
    serializer_class = UserResetPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = serializer.data.get('id')
        user = get_user_model().objects.get(id=user_id)
        new_password = secrets.token_urlsafe(16)

        user.set_password(new_password)
        user.save()

        send_reset_password_email.delay(user.name, user.first_last_name, user.email, new_password)

        return response.Response({
            "message": "Contraseña reestablecida correctamente.",
            },
            status=status.HTTP_200_OK)
