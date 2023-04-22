from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404

from project.serializers import (
    ProjectSerializer,
    ProjectDataSerializer,
    MaintenanceSerializer,
    MaintenanceDataSerializer,
    ProjectModelSerializer,
    ProjectModelDataSerializer,
    ProjectModelDataSerializer,
    ModelFieldSerializer,
    ModelFieldDataSerializer,
)

from core.models import (
    Project,
    Maintenance,
    ProjectModel,
    ModelField,
)

from core.permissions import (
    isActiveUser,
    isMaintainer,
)

from rest_framework import permissions
from knox.auth import TokenAuthentication
from rest_framework import (
    viewsets,
    mixins,
    response,
    status,
    generics,
)


class ProjectViewSet(viewsets.ModelViewSet):
    """Viewset for active projects"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser, isActiveUser)
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def list(self, request, *args, **kwargs):
        """List the all the projects filtered by name, is_active, and customer"""
        try:
            name = request.query_params.get('name', None)
            is_active = request.query_params.get('is_active', None)
            customer = request.query_params.get('customer', None)

            queryset = self.queryset

            if name:
                queryset = queryset.filter(name=name)

            if is_active:
                queryset = queryset.filter(is_active=is_active)

            if customer:
                queryset = queryset.filter(customer=int(customer))

            serializer = ProjectDataSerializer(self.queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve an active project"""
        try:
            instance = self.get_object()
            serializer = ProjectDataSerializer(instance)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """Set the project as inactive"""
        try:
            instance = self.get_object()
            instance.is_active = False
            instance.save()
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

class MaintenanceViewSet(mixins.CreateModelMixin,
                         mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         mixins.DestroyModelMixin,
                         viewsets.GenericViewSet):
    """Viewset for maintenance"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser, isActiveUser)
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer

    def list(self, request, *args, **kwargs):
        """List all the maintenance filtered by project and maintainer"""
        try:
            project = request.query_params.get('project', None)
            maintainer = request.query_params.get('maintainer', None)

            queryset = self.queryset

            if project:
                queryset = queryset.filter(project__name=int(project))

            if maintainer:
                queryset = queryset.filter(maintainer=int(maintainer))

            serializer = MaintenanceDataSerializer(self.queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ProjectModelViewSet(viewsets.ModelViewSet):
    """Viewset for project models"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, isActiveUser)
    queryset = ProjectModel.objects.all()
    serializer_class = ProjectModelSerializer

    def list(self, request, *args, **kwargs):
        """List the all the active project models"""
        try:
            serializer = ProjectModelDataSerializer(self.queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve an active project model"""
        try:
            instance = self.get_object()
            serializer = ProjectModelDataSerializer(instance)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """Set the project model as inactive"""
        try:
            instance = self.get_object()
            instance.is_active = False
            instance.save()
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ModelFieldViewSet(viewsets.ModelViewSet):
    """Viewset for model fields"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, isActiveUser)
    queryset = ModelField.objects.all()
    serializer_class = ModelFieldSerializer

    def list(self, request, *args, **kwargs):
        """List the all the model fields"""
        try:
            serializer = ModelFieldDataSerializer(self.queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)
