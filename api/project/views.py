import tempfile
import zipfile
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404, HttpResponse

from project.serializers import (
    ProjectSerializer,
    MinimalProjectSerializer,
    FullProjectSerializer,
    ProjectAppSerializer,
    MinimalProjectAppSerializer,
    FullProjectAppSerializer,
    MaintenanceSerializer,
    MinimalMaintenanceSerializer,
    ProjectMaintainersSerializer,
    AppModelSerializer,
    MinimalAppModelSerializer,
    FullAppModelSerializer,
    ModelFieldSerializer,
    MinimalModelFieldSerializer,
    ValidatorValueSerializer,
    ModelFieldValidatorValueSerializer
)

from core.models import (
    Project,
    ProjectApp,
    Maintenance,
    AppModel,
    ModelField,
    ValidatorValue
)

from core import permissions as custom_permissions
from .utils import format_project_name
from .exportation_functions.rest_services.base import create_rest_services_directory

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
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser]
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

            serializer = MinimalProjectSerializer(queryset, many=True)
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
            serializer = FullProjectSerializer(instance)
            project_apps = ProjectApp.objects.filter(project=instance)
            project_apps_serializer = MinimalProjectAppSerializer(project_apps, many=True)

            # Gettng the project data
            response_data['project'] = serializer.data

            # Getting the models of the project
            response_data['project_apps'] = project_apps_serializer.data

            # Getting the maintainers of the project only if the user is admin
            if request.user.is_superuser:
                maintainers = Maintenance.objects.filter(project=instance)
                maintainers_serializer = ProjectMaintainersSerializer(maintainers, many=True)
                response_data['maintainers'] = maintainers_serializer.data

            return response.Response(response_data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ChangeProjectStatusView(views.APIView):
    """View for changing the status (is_active) of the project"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser]
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


class ProjectAppViewSet(viewsets.ModelViewSet):
    """Viewset for project apps"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser]
    queryset = ProjectApp.objects.all()
    serializer_class = ProjectAppSerializer

    def list(self, request, *args, **kwargs):
        """List the all the project apps filtered by project id, name, and is_active"""
        try:
            project_id = request.query_params.get('project_id', None)
            name = request.query_params.get('name', None)
            is_active = request.query_params.get('is_active', None)

            queryset = self.queryset

            if project_id:
                queryset = queryset.filter(project=int(project_id))

            if name:
                queryset = queryset.filter(name=name)

            if is_active and is_active in ['true', 'false']:
                is_active = True if is_active == 'true' else False
                queryset = queryset.filter(is_active=is_active)

            serializer = MinimalProjectAppSerializer(queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """Update the project app"""
        try:
            instance = self.get_object()

            # Making the project field immutable.
            if 'project' in request.data:
                request.data['project'] = instance.project.id

            serializer = ProjectAppSerializer(instance, data=request.data)

            serializer.is_valid(raise_exception=True)
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        """Partially update the project app"""
        try:
            instance = self.get_object()

            # Making the project field immutable.
            if 'project' in request.data:
                request.data['project'] = instance.project.id

            serializer = ProjectAppSerializer(instance, data=request.data, partial=True)

            serializer.is_valid(raise_exception=True)
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a project app"""
        try:
            instance = self.get_object()
            serializer = FullProjectAppSerializer(instance)
            project_models = AppModel.objects.filter(project_app=instance, is_active=True)
            project_models_serializer = MinimalAppModelSerializer(project_models, many=True)

            # Gettng the project app data
            response_data = serializer.data

            # Getting the models of the project app
            response_data['project_models'] = project_models_serializer.data

            return response.Response(response_data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class MaintenanceViewSet(mixins.CreateModelMixin,
                         mixins.ListModelMixin,
                         mixins.DestroyModelMixin,
                         viewsets.GenericViewSet):
    """Viewset for maintenance"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser]
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

            serializer = MinimalMaintenanceSerializer(queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class AppModelViewSet(viewsets.ModelViewSet):
    """Viewset for project models"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated,]
    queryset = AppModel.objects.all()
    serializer_class = AppModelSerializer

    def list(self, request, *args, **kwargs):
        """List the all the project models filtered by project app id and model name"""
        try:
            project_app_id = request.query_params.get('project_app_id', None)
            model_name = request.query_params.get('model_name', None)

            queryset = self.queryset

            if project_app_id:
                queryset = queryset.filter(project_app=int(project_app_id))

            if model_name:
                queryset = queryset.filter(name=model_name)

            serializer = MinimalAppModelSerializer(queryset, many=True)

            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a project model"""
        try:
            instance = self.get_object()
            serializer = FullAppModelSerializer(instance)
            response_data = serializer.data
            model_fields = ModelField.objects.filter(project_model=instance)
            model_fields_serializer = MinimalModelFieldSerializer(model_fields, many=True)
            response_data['model_fields'] = model_fields_serializer.data
            return response.Response(response_data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ChangeAppModelStatusView(views.APIView):
    """View for changing the status (is_active) of the model field"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser]
    serializer_class = AppModelSerializer

    def post(self, request, *args, **kwargs):
        """Change the status of the model field"""
        try:
            project_model_id = kwargs.get('pk', None)

            if not project_model_id :
                return response.Response(status=status.HTTP_400_BAD_REQUEST)

            project_model = AppModel.objects.get(id=project_model_id)
            project_model.is_active = not project_model.is_active
            project_model.save()

            return response.Response(status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ModelFieldViewSet(viewsets.ModelViewSet):
    """Viewset for model fields"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated,]
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
            serializer = MinimalModelFieldSerializer(self.queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a model field"""
        try:
            instance = self.get_object()
            serializer = ModelFieldSerializer(instance)
            model_field_validators = ValidatorValue.objects.filter(model_field=instance)
            model_field_validators_serializer = ModelFieldValidatorValueSerializer(model_field_validators, many=True)
            response_data = serializer.data
            response_data['validators'] = model_field_validators_serializer.data
            return response.Response(response_data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ChangeModelFieldStatusView(views.APIView):
    """View for changing the status (is_active) of the model field"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser,]
    serializer_class = ModelFieldSerializer

    def post(self, request, *args, **kwargs):
        """Change the status of the model field"""
        try:
            model_field_id = kwargs.get('pk', None)

            if not model_field_id :
                return response.Response(status=status.HTTP_400_BAD_REQUEST)

            model_field = ModelField.objects.get(id=model_field_id)
            model_field.is_active = not model_field.is_active
            model_field.save()

            return response.Response(status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ValidatorValueViewSet(viewsets.ModelViewSet):
    """Viewset for config values"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated,]
    queryset = ValidatorValue.objects.all()
    serializer_class = ValidatorValueSerializer

    def create(self, request, *args, **kwargs):
        """Create a list of config values"""
        try:
            data = request.data
            serializer = ValidatorValueSerializer(data=data, many=True)
            if serializer.is_valid():
                serializer.save()
                return response.Response(serializer.data, status=status.HTTP_201_CREATED)
            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        """List the all the config values filtered by model field id and is active"""
        try:
            model_field_id = request.query_params.get('model_field_id', None)
            is_active = request.query_params.get('is_active', None)

            queryset = self.queryset

            if model_field_id:
                queryset = queryset.filter(model_field=int(model_field_id))

            if is_active:
                is_active = True if is_active.lower() == 'true' else False
                queryset = queryset.filter(is_active=is_active)

            serializer = ValidatorValueSerializer(queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ChangeValidatorValueStatusView(views.APIView):
    """View for changing the status (is_active) of the config value"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser,]
    serializer_class = ValidatorValueSerializer

    def post(self, request, *args, **kwargs):
        """Change the status of the config value"""
        try:
            validator_value_id = kwargs.get('pk', None)

            if not validator_value_id :
                return response.Response(status=status.HTTP_400_BAD_REQUEST)

            config_value = ValidatorValue.objects.get(id=validator_value_id)
            config_value.is_active = not config_value.is_active
            config_value.save()

            return response.Response(status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)



############################
# Exportation of a project #
############################

class ExportProjectApiView(views.APIView):
    """View for exporting a project"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser,]

    def post(self, request, pk=None, *args, **kwargs,):
        """Export a project"""
        try:
            project = Project.objects.get(id=pk, is_active=True)

            # Building the project directory
            with tempfile.SpooledTemporaryFile() as tmp:
                with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as main_directory:
                    # Create the rest services directory
                    create_rest_services_directory(main_directory, project)

                tmp.seek(0)

                return HttpResponse(
                    tmp.read(),
                    content_type='application/zip',
                    status=status.HTTP_200_OK,
                    headers={
                        'Content-Disposition': f'attachment; filename={format_project_name(project.name)}.zip'
                    }
                )
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            print(e)
            return response.Response({'error': e.__str__()},  status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return response.Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
