from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404

from user.serializers import (
    UserMinimalSerializer,
)

from project.serializers import (
    ProjectSerializer,
    ProjectMinimalSerializer,
    ProjectDataSerializer,
    MaintenanceSerializer,
    MaintenanceMinimalSerializer,
    ProjectModelSerializer,
    ProjectModelMinimalSerializer,
    ProjectModelDataSerializer,
    ProjectModelDataSerializer,
    ModelFieldSerializer,
    ModelFieldMinimalSerializer,
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
    views,
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
            customer_id = request.query_params.get('customer_id', None)

            queryset = self.queryset

            if name:
                queryset = queryset.filter(name=name)

            if is_active and is_active in ['true', 'false']:
                is_active = True if is_active == 'true' else False
                queryset = queryset.filter(is_active=is_active)

            if customer_id:
                customer_id = int(customer_id)
                queryset = queryset.filter(customer=customer_id)

            serializer = ProjectMinimalSerializer(queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """Update the project"""
        try:
            instance = self.get_object()

            # Making the customer field immutable.
            if 'customer' in request.data:
                request.data['customer'] = instance.customer.id

            serializer = ProjectSerializer(instance, data=request.data)

            serializer.is_valid(raise_exception=True)
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        """Partially update the project"""
        try:
            instance = self.get_object()

            # Making the customer field immutable.
            if 'customer' in request.data:
                request.data['customer'] = instance.customer.id

            serializer = ProjectSerializer(instance, data=request.data, partial=True)

            serializer.is_valid(raise_exception=True)
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve an active project"""
        try:
            response_data = {}
            instance = self.get_object()
            serializer = ProjectDataSerializer(instance)
            project_models = ProjectModel.objects.filter(project=instance, is_active=True)
            project_models_serializer = ProjectModelMinimalSerializer(project_models, many=True)

            # Gettng the project data
            response_data['project'] = serializer.data

            # Getting the models of the project
            response_data['project_models'] = project_models_serializer.data

            # Getting the maintainers of the project only if the user is admin
            if request.user.is_superuser:
                maintainers = instance.maintainers.filter(is_active=True)
                maintainers_serializer = UserMinimalSerializer(maintainers, many=True)
                response_data['maintainers'] = maintainers_serializer.data

            return response.Response(response_data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ChangeProjectStatusView(views.APIView):
    """View for changing the status (is_active) of the project"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser, isActiveUser)
    serializer_class = ProjectSerializer

    def post(self, request, *args, **kwargs):
        """Change the status of the project"""
        try:
            project_id = kwargs.get('pk', None)

            if not project_id :
                return response.Response(status=status.HTTP_400_BAD_REQUEST)

            project = Project.objects.get(id=project_id)
            project.is_active = not project.is_active
            project.save()

            return response.Response(status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class MaintenanceViewSet(mixins.CreateModelMixin,
                         mixins.ListModelMixin,
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
            project_name = request.query_params.get('project_name', None)
            maintainer_id = request.query_params.get('maintainer_id', None)

            queryset = self.queryset

            if project_name:
                queryset = queryset.filter(project__name=project_name)

            if maintainer_id:
                queryset = queryset.filter(user=int(maintainer_id))

            serializer = MaintenanceMinimalSerializer(queryset, many=True)
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
        """List the all the project models filtered by project id and model name"""
        try:
            project_id = request.query_params.get('project_id', None)
            model_name = request.query_params.get('model_name', None)

            queryset = self.queryset

            if project_id:
                queryset = queryset.filter(project=int(project_id))

            if model_name:
                queryset = queryset.filter(name=model_name)

            serializer = ProjectModelMinimalSerializer(queryset, many=True)

            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a project model"""
        try:
            instance = self.get_object()
            serializer = ProjectModelDataSerializer(instance)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ChangeProjectModelStatusView(views.APIView):
    """View for changing the status (is_active) of the model field"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser, isActiveUser)
    serializer_class = ProjectModelSerializer

    def post(self, request, *args, **kwargs):
        """Change the status of the model field"""
        try:
            project_model_id = kwargs.get('pk', None)

            if not project_model_id :
                return response.Response(status=status.HTTP_400_BAD_REQUEST)

            project_model = ProjectModel.objects.get(id=project_model_id)
            project_model.is_active = not project_model.is_active
            project_model.save()

            return response.Response(status=status.HTTP_200_OK)
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

    def create(self, request, *args, **kwargs):
        """Create a list of model fields"""
        try:
            data = request.data
            serializer = ModelFieldSerializer(data=data, many=True)
            if serializer.is_valid():
                serializer.save()
                return response.Response(serializer.data, status=status.HTTP_201_CREATED)
            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        """List the all the model fields"""
        try:
            serializer = ModelFieldMinimalSerializer(self.queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)
