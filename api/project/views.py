import tempfile
import zipfile
import os
import secrets
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404, HttpResponse, FileResponse

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
    ProjectModelSerializer,
    MinimalProjectModelSerializer,
    FullProjectModelSerializer,
    ModelFieldSerializer,
    MinimalModelFieldSerializer,
    ValidatorValueSerializer,
    ModelFieldValidatorValueSerializer
)

from core.models import (
    Project,
    ProjectApp,
    Maintenance,
    ProjectModel,
    ModelField,
    ValidatorValue
)

from core import permissions as custom_permissions
from .utils import format_project_name

from rest_framework import permissions
from knox.auth import TokenAuthentication
from rest_framework import (
    viewsets,
    mixins,
    response,
    status,
    views,
)

SCRIPT_TEMPLATE_URLS = {
    'api_apps': os.path.join(settings.BASE_DIR, 'script_templates/api/apps/app.txt'),
    'api_models': os.path.join(settings.BASE_DIR, 'script_templates/api/models/model.txt'),
    'api_serializers': os.path.join(settings.BASE_DIR, 'script_templates/api/serializers/serializer.txt'),
    'api_views': os.path.join(settings.BASE_DIR, 'script_templates/api/views/view.txt'),
    'api_urls': os.path.join(settings.BASE_DIR, 'script_templates/api/urls/urls.txt'),
    'api_global_urls': os.path.join(settings.BASE_DIR, 'script_templates/api/urls/global_urls.txt'),
    'api_settings': os.path.join(settings.BASE_DIR, 'script_templates/api/settings/settings.txt'),
    'dockerfile': os.path.join(settings.BASE_DIR, 'script_templates/docker/Dockerfile'),
    'docker_compose': os.path.join(settings.BASE_DIR, 'script_templates/docker/docker-compose.yml'),
    'env_file_api': os.path.join(settings.BASE_DIR, 'script_templates/env_files/api.env'),
    'env_file_postgresql': os.path.join(settings.BASE_DIR, 'script_templates/env_files/postgresql.env'),
    'env_file_rabbitmq': os.path.join(settings.BASE_DIR, 'script_templates/env_files/rabbitmq.env'),
}

EXPORTED_PROJECT_TEMPLATE_URLS = {
    'api': os.path.join(settings.BASE_DIR, 'exported_project_template/api'),
    'env_files_api': os.path.join(settings.BASE_DIR, 'exported_project_template/env_files/api'),
    'env_files_postgresql': os.path.join(settings.BASE_DIR, 'exported_project_template/env_files/postgresql'),
    'env_files_rabbitmq': os.path.join(settings.BASE_DIR, 'exported_project_template/env_files/rabbitmq'),
}

MODEL_FIELD_TEMPLATE_URLS = {
    'integerfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/IntegerField.txt'),
    'floatfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/FloatField.txt'),
    'charfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/CharField.txt'),
    'textfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/TextField.txt'),
    'booleanfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/BooleanField.txt'),
    'datefield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/DateField.txt'),
    'datetimefield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/DateTimeField.txt'),
    'timefield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/TimeField.txt'),
    'decimalfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/DecimalField.txt'),
    'positiveintegerfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/PositiveIntegerField.txt'),
    'positivebigintegerfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/PositiveBigIntegerField.txt'),
    'bigintegerfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/BigIntegerField.txt'),
    'urlfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/URLField.txt'),
    'emailfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/EmailField.txt'),
    'onetooneforeignkey': os.path.join(settings.BASE_DIR, 'script_templates/api/models/OneToOneForeignKey.txt'),
    'onetomanyforeignkey': os.path.join(settings.BASE_DIR, 'script_templates/api/models/OneToManyForeignKey.txt'),
    'manytomanyforeignkey': os.path.join(settings.BASE_DIR, 'script_templates/api/models/ManyToManyForeignKey.txt'),
}

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
            project_models = ProjectModel.objects.filter(project_app=instance, is_active=True)
            project_models_serializer = MinimalProjectModelSerializer(project_models, many=True)

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


class ProjectModelViewSet(viewsets.ModelViewSet):
    """Viewset for project models"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated,]
    queryset = ProjectModel.objects.all()
    serializer_class = ProjectModelSerializer

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

            serializer = MinimalProjectModelSerializer(queryset, many=True)

            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a project model"""
        try:
            instance = self.get_object()
            serializer = FullProjectModelSerializer(instance)
            response_data = serializer.data
            model_fields = ModelField.objects.filter(project_model=instance)
            model_fields_serializer = MinimalModelFieldSerializer(model_fields, many=True)
            response_data['model_fields'] = model_fields_serializer.data
            return response.Response(response_data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ChangeProjectModelStatusView(views.APIView):
    """View for changing the status (is_active) of the model field"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser]
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
                    # Building the rest services directory
                    self.__build_rest_services_directory(main_directory, project)

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

    def __add_rest_services_base_directories(self, main_directory, project_name):
        """Add the base directories of the rest services

        Args:
            main_directory (zipfile.ZipFile): The main directory of the project
            project_name (str): The name of the project
        """
        api_template_path = os.path.join(settings.BASE_DIR, 'exported_project_template/api')
        # Adding the services to the zip file.
        for root, dirs, files in os.walk(api_template_path):
            for file_name in files:

                file_path = os.path.join(root, file_name)
                arcname = os.path.relpath(file_path,api_template_path)

                main_directory.write(file_path, f'api/{arcname}')

    def __add_project_app_directories(self, main_directory, project):
        """Add the directories of each project app.

        Args:
            main_directory (zipfile.ZipFile): The main directory of the project
            project (Project): The project object
        """
        project_apps = ProjectApp.objects.filter(project=project)

        if not project_apps:
            raise ValueError(f'El proyecto {project.name} debe tener al menos una app.')

        for project_app in project_apps:
            self.__build_project_app_directory(main_directory, project_app)

        self.__add_settings_file(main_directory, project_apps)
        self.__add_global_urls_file(main_directory, project_apps)

    def __add_settings_file(self, main_directory, project_apps):
        """Add the settings file with the local apps to the zip file

        Args:
            main_directory (zipfile.ZipFile): The main directory of the project
            project_apps (list): The list of project apps
        """

        # Getting the content of the settings file
        with open(SCRIPT_TEMPLATE_URLS['api_settings'], 'r') as file:
            settings_file_content = file.read()

        # Adding the local apps to the settings file
        local_apps_names = [format_project_name(project_app.name).lower() for project_app in project_apps]
        local_apps_formatted = ',\n    '.join([f"'{local_app_name}'" for local_app_name in local_apps_names])

        settings_file_content = settings_file_content.replace('{{LOCAL_APPS}}', local_apps_formatted)

        # Adding the settings file to the zip file
        main_directory.writestr('api/api/settings.py', settings_file_content)

    def __add_global_urls_file(self, main_directory, project_apps):
        """Add the global urls file to the zip file

        Args:
            main_directory (zipfile.ZipFile): The main directory of the project
            project_apps (list): The list of project apps
        """
        global_urls_file_content = self.__get_template_file_content(SCRIPT_TEMPLATE_URLS['api_global_urls'])
        project_app_names = [format_project_name(project_app.name).lower() for project_app in project_apps]

        for project_app_name in project_app_names:
            url = f"path('{project_app_name}/', include('{project_app_name}.urls')),\n    " + '{{APPS_URLS}}'
            global_urls_file_content = global_urls_file_content.replace('{{APPS_URLS}}', url)


        global_urls_file_content = global_urls_file_content.replace('{{APPS_URLS}}', '')

        # Adding the global urls file to the zip file
        main_directory.writestr('api/api/urls.py', global_urls_file_content)

    def __add_env_files(self, main_directory, project_name):
        """Add the env files to the zip file

        Args:
            main_directory (zipfile.ZipFile): The main directory of the project
        """
        # Adding the env files to the zip file
        DB_PASSWORD = secrets.token_hex(12)
        RABBITMQ_PASSWORD = secrets.token_hex(12)

        env_file_api_content = self.__get_template_file_content(SCRIPT_TEMPLATE_URLS['env_file_api'])
        env_file_api_content = env_file_api_content.replace('{{SECRET_KEY}}', secrets.token_hex(24))
        env_file_api_content = env_file_api_content.replace('{{PROJECT_NAME}}', project_name)
        env_file_api_content = env_file_api_content.replace('{{DB_PASSWORD}}', DB_PASSWORD)
        env_file_api_content = env_file_api_content.replace('{{RABBITMQ_PASSWORD}}', RABBITMQ_PASSWORD)
        main_directory.writestr('env_files/api/.env', env_file_api_content)

        env_file_postgresql_content = self.__get_template_file_content(SCRIPT_TEMPLATE_URLS['env_file_postgresql'])
        env_file_postgresql_content = env_file_postgresql_content.replace('{{PROJECT_NAME}}', project_name)
        env_file_postgresql_content = env_file_postgresql_content.replace('{{DB_PASSWORD}}', DB_PASSWORD)
        main_directory.writestr('env_files/postgresql/.env', env_file_postgresql_content)

        env_file_rabbitmq_content = self.__get_template_file_content(SCRIPT_TEMPLATE_URLS['env_file_rabbitmq'])
        env_file_rabbitmq_content = env_file_rabbitmq_content.replace('{{PROJECT_NAME}}', project_name)
        env_file_rabbitmq_content = env_file_rabbitmq_content.replace('{{RABBITMQ_PASSWORD}}', RABBITMQ_PASSWORD)
        main_directory.writestr('env_files/rabbitmq/.env', env_file_rabbitmq_content)

    def __add_docker_files(self, main_directory, project_name):
        """Add the files needed to run the project with docker

        Args:
            main_directory (zipfile.ZipFile): The main directory of the project
        """
        # Adding the docker files to the zip file
        dockerfile_content = self.__get_template_file_content(SCRIPT_TEMPLATE_URLS['dockerfile'])
        dockerfile_content = dockerfile_content.replace('{{PROJECT_NAME}}', project_name)
        main_directory.writestr('api/Dockerfile', dockerfile_content)

        docker_compose_content = self.__get_template_file_content(SCRIPT_TEMPLATE_URLS['docker_compose'])
        docker_compose_content = docker_compose_content.replace('{{PROJECT_NAME}}', project_name)
        main_directory.writestr('docker-compose.yml', docker_compose_content)

    def __build_project_app_directory(self, main_directory, project_app):
        """Build the project app directory

        Args:
            main_directory (zipfile.ZipFile): The main directory of the project
            project_app_name (str): The name of the project app
        """
        try:
            project_app_name = format_project_name(project_app.name)
            project_app_directory = project_app_name.lower()

            # Adding the app directory and its files
            main_directory.writestr(f'api/{project_app_directory}/__init__.py', '')
            main_directory.writestr(f'api/{project_app_directory}/admin.py', 'from django.contrib import admin')
            main_directory.writestr(f'api/{project_app_directory}/views/__init__.py', '')
            main_directory.writestr(f'api/{project_app_directory}/urls/__init__', '')

            app_template_path = SCRIPT_TEMPLATE_URLS['api_apps']
            app_template_content = self.__get_template_file_content(app_template_path)
            app_template_content = app_template_content.replace('{{APP_NAME_CLASS}}', project_app_name)
            app_template_content = app_template_content.replace('{{APP_NAME}}', project_app_directory)
            main_directory.writestr(f'api/{project_app_directory}/apps.py', app_template_content)

            # Adding the project app models
            self.__add_project_app_models(main_directory, project_app)
        except ValueError as e:
            raise e
        except Exception as e:
            raise e

    def __add_project_app_models(self, main_directory, project_app):
        """Add the models of the project app

        Args:
            main_directory (zipfile.ZipFile): The main directory of the project
            project_app (ProjectApp): The project app object
        """
        try:
            project_models = ProjectModel.objects.filter(project_app=project_app, is_active=True)

            if not project_models:
                raise ValueError(f'La app {project_app.name} debe tener al menos un modelo.')

            for project_model in project_models:
                self.__build_project_model_script(main_directory, project_model)
        except ValueError as e:
            raise e
        except Exception as e:
            raise e

    def __build_project_model_script(self, main_directory, project_model):
        """Build the script of the project model

        Args:
            main_directory (zipfile.ZipFile): The main directory of the project
            project_model (ProjectModel): The project model object
        """
        try:
            project_app_name = project_model.project_app.name
            project_app_name = format_project_name(project_app_name).lower()
            project_model_name = format_project_name(project_model.name)

            project_model_body = self.__get_template_file_content(SCRIPT_TEMPLATE_URLS['api_models'])
            project_model_body = project_model_body.replace('{{MODEL_NAME}}', project_model_name)

            # Adding the model fields
            project_model_body = self.__add_model_fields(project_model, project_model_body)

            main_directory.writestr(f'api/{project_app_name}/models/{project_model_name}.py', project_model_body)
        except ValueError as e:
            raise e
        except Exception as e:
            raise e

    def __add_model_fields(self, project_model, project_model_body):
        model_fields = ModelField.objects.filter(project_model=project_model, is_active=True)

        if not model_fields:
            raise ValueError(f'El modelo {project_model.name} debe tener al menos un campo.')

        validator_imports = set()

        for model_field in model_fields:
            project_model_body = self.__add_model_field(model_field,
                                                          project_model_body)
            validator_imports = self.__get_validator_imports(model_field,
                                                             validator_imports)

        # Adding the validator imports
        project_model_body = project_model_body.replace('{{VALIDATOR_IMPORTS}}',
                                                        '\n'.join(validator_imports))

        project_model_body = project_model_body.replace('{{MODEL_FIELDS}}', '')

        return project_model_body

    def __add_model_field(self, model_field, project_model_body):
        model_field_data_type = model_field.data_type.name.lower()
        model_field_name = model_field.name
        model_field_body = self.__get_template_file_content(MODEL_FIELD_TEMPLATE_URLS[model_field_data_type])
        model_field_body = model_field_body.replace('{{FIELD_NAME}}', model_field_name)

        # Adding the validators
        model_field_body = self.__add_validators(model_field, model_field_body)
        project_model_body = project_model_body.replace('{{MODEL_FIELDS}}', f'{model_field_body}    ' + '{{MODEL_FIELDS}}')

        return project_model_body

    def __get_validator_imports(self, model_field, validator_imports):
        validators = ValidatorValue.objects.filter(model_field=model_field)

        VALIDATOR_IMPORTS = {
            'min_value': 'from django.core.validators import MinValueValidator',
            'max_value': 'from django.core.validators import MaxValueValidator',
            'min_length': 'from django.core.validators import MinLengthValidator',
            'max_length': 'from django.core.validators import MaxLengthValidator',
            'regex': 'from django.core.validators import RegexValidator',
        }

        validator_names = [validator.validator.name for validator in validators]

        for validator_name in validator_names:
            if validator_name in VALIDATOR_IMPORTS:
                validator_imports.add(VALIDATOR_IMPORTS[validator_name])

        return validator_imports

    def __add_validators(self, model_field, model_field_body):
        validators = ValidatorValue.objects.filter(model_field=model_field)

        for validator in validators:
            model_field_body = self.__add_validator(validator, model_field_body)

        # Removing the validators and attributes placeholders
        model_field_body = model_field_body.replace('{{VALIDATORS}}, ', '')
        model_field_body = model_field_body.replace('{{ATTRIBUTES}}, ', '')
        model_field_body = model_field_body.replace('validators=[]', '')

        return model_field_body

    def __add_validator(self, validator, model_field_body):
        validator_name = validator.validator.name
        validator_value = validator.value


        ATTRIBUTES = ['max_digits', 'decimal_places', 'null',
                      'required', 'db_index', 'unique',
                      'auto_now_add', 'auto_now']

        VALIDATORS = {
            'min_value': 'MinValueValidator({{VALUE}})',
            'max_value': 'MaxValueValidator({{VALUE}})',
            'min_length': 'MinLengthValidator({{VALUE}})',
            'max_length': 'MaxLengthValidator({{VALUE}})',
            'regex': 'RegexValidator({{VALUE}})',
        }

        print(validator_name, validator_value, validator_name in VALIDATORS)

        print(model_field_body)

        if validator_name in ATTRIBUTES:
            model_field_body = model_field_body.replace('{{ATTRIBUTES}}, ',
                                                        f'{validator_name}={validator_value}, ' + '{{ATTRIBUTES}}, ')
        elif validator_name in VALIDATORS.keys():
            validator_method = VALIDATORS[validator_name]
            validator_method = validator_method.replace('{{VALUE}}', validator_value)
            print
            model_field_body = model_field_body.replace('{{VALIDATORS}}, ', f'{validator_method}, ' + '{{VALIDATORS}}, ')

        print(model_field_body)

        return model_field_body

    def __get_template_file_content(self, file_path):
        """Get the content of a template file

        Args:
            file_path (str): The path of the file

        Returns:
            str: The content of the file
        """
        try:
            with open(file_path, 'r') as file:
                content = file.read()
                return content
        except Exception as e:
            raise ValueError(f'No se pudo leer el archivo {file_path}')

    def __build_rest_services_directory(self, main_directory, project):
        """Build the rest services directory

        Args:
            main_directory (zipfile.ZipFile): The main directory of the project
            project (Project): The project object
        """
        try:
            project_name = format_project_name(project.name)
            self.__add_rest_services_base_directories(main_directory, project_name)
            self.__add_project_app_directories(main_directory, project)
            self.__add_docker_files(main_directory, project_name)
            self.__add_env_files(main_directory, project_name)

            # Adding the app directories
        except ValueError as e:
            raise e






