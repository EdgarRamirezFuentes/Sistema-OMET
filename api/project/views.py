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
    AppModelSerializer,
    MinimalAppModelSerializer,
    FullAppModelSerializer,
    ModelFieldSerializer,
    MinimalModelFieldSerializer,
    ValidatorValueSerializer,
    ModelFieldValidatorValueSerializer,
    ForeignKeyRelationSerializer,
)

from core.models import (
    Project,
    ProjectApp,
    AppModel,
    ModelField,
    ValidatorValue,
    DataType,
    ForeignKeyRelation,
)

from core import permissions as custom_permissions
from .utils import format_project_name
from .exportation_functions.rest_services.base import create_rest_services_directory
from .exportation_functions.web_client.base import create_web_client_directory

from rest_framework import serializers
from rest_framework import permissions
from knox.auth import TokenAuthentication
from rest_framework import (
    viewsets,
    response,
    status,
    views,
)

class ProjectViewSet(viewsets.ModelViewSet):
    """Viewset for active projects"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser]
    serializer_class = ProjectSerializer
    def get_queryset(self):
        return Project.objects.all()

    def list(self, request, *args, **kwargs):
        """List the all the projects filtered by name and customer"""
        try:
            name = request.query_params.get('name', None)
            customer_id = request.query_params.get('customer_id', None)

            queryset = self.get_queryset()

            if name:
                queryset = queryset.filter(name__icontains=name)

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

            return response.Response(response_data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ProjectAppViewSet(viewsets.ModelViewSet):
    """Viewset for project apps"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, custom_permissions.isAdminUser]
    queryset = ProjectApp.objects.all()
    serializer_class = ProjectAppSerializer

    def list(self, request, *args, **kwargs):
        """List the all the project apps filtered by project id and name """
        try:
            project_id = request.query_params.get('project_id', None)
            name = request.query_params.get('name', None)

            queryset = self.queryset

            if project_id:
                queryset = queryset.filter(project=int(project_id))

            if name:
                queryset = queryset.filter(name=name)

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
            app_models = AppModel.objects.filter(project_app=instance)
            app_models_serializer = MinimalAppModelSerializer(app_models, many=True)

            # Gettng the project app data
            response_data = serializer.data

            # Getting the models of the project app
            response_data['app_models'] = app_models_serializer.data

            return response.Response(response_data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
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
            model_fields = ModelField.objects.filter(app_model=instance)
            model_fields_serializer = MinimalModelFieldSerializer(model_fields, many=True)
            response_data['model_fields'] = model_fields_serializer.data
            return response.Response(response_data, status=status.HTTP_200_OK)
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
            saved_model_field = None
            model_field_relation_id = data.pop('model_field_relation', None)
            serializer = ModelFieldSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            saved_model_field = serializer.save()

            # Adding the relation between the model field and the foreign key model field
            if 'ForeignKey' in saved_model_field.data_type.name:
                foreign_key_serializer = ForeignKeyRelationSerializer(data={
                    'model_field_origin': saved_model_field.id,
                    'model_field_related': model_field_relation_id
                })
                foreign_key_serializer.is_valid(raise_exception=True)
                foreign_key_serializer.save()

            # Adding a required validator for the CharField and TextField data types
            if saved_model_field.data_type.name in ['CharField', 'TextField']:
                value_validator_serializer = ValidatorValueSerializer(data={
                    'model_field': saved_model_field.id,
                    'validator': 5,
                    'value': 100
                })

                value_validator_serializer.is_valid(raise_exception=True)
                value_validator_serializer.save()

            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data=e.detail)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        """List the all the model fields"""
        try:
            app_model_id = request.query_params.get('app_model_id', None)

            if app_model_id:
                self.queryset = self.queryset.filter(app_model=int(app_model_id))

            serializer = ModelFieldSerializer(self.queryset, many=True)
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

    def update(self, request, *args, **kwargs):
        """Update the model field"""
        try:
            instance = self.get_object()

            # Making the app model field immutable.
            if 'app_model' in request.data:
                request.data['app_model'] = instance.app_model.id

            # Making the data type field immutable.
            if 'data_type' in request.data:
                request.data['data_type'] = instance.data_type.id

            serializer = ModelFieldSerializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except serializers.ValidationError as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data=e.detail)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        """Partially update the model field"""
        try:
            instance = self.get_object()

            # Making the app model field immutable.
            if 'app_model' in request.data:
                request.data['app_model'] = instance.app_model.id

            # Making the data type field immutable.
            if 'data_type' in request.data:
                request.data['data_type'] = instance.data_type.id

            serializer = ModelFieldSerializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except serializers.ValidationError as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data=e.detail)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)


class ValidatorValueViewSet(viewsets.ModelViewSet):
    """Viewset for config values"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated,]
    queryset = ValidatorValue.objects.all()
    serializer_class = ValidatorValueSerializer

    def list(self, request, *args, **kwargs):
        """List the all the config values filtered by model field id and is active"""
        try:
            model_field_id = request.query_params.get('model_field_id', None)

            queryset = self.queryset

            if model_field_id:
                queryset = queryset.filter(model_field=int(model_field_id))

            serializer = ValidatorValueSerializer(queryset, many=True)
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """Delete a config value"""
        try:
            instance = self.get_object()

            # Making the validator max_length not deletable
            if instance.validator.name == 'max_length':
                raise ValueError('No se puede eliminar el valor del validador max_length.')

            instance.delete()
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

class ProjectStructureApiView(views.APIView):
    """View for getting the project structure"""
    authentication_classes = [TokenAuthentication,]
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request, pk=None, *args, **kwargs,):
        """Get the project structure"""
        try:
            if not pk:
                raise ValueError('The project id is required.')

            project_apps = ProjectApp.objects.filter(project=pk)
            project_apps_serializer = MinimalProjectAppSerializer(project_apps, many=True)
            project_apps = project_apps_serializer.data

            for project_app in project_apps:
                app_models = AppModel.objects.filter(project_app=project_app['id'])
                app_models_serializer = MinimalAppModelSerializer(app_models, many=True)
                project_app['app_models'] = app_models_serializer.data

                for app_model in project_app['app_models']:
                    # Getting the fields that are not foreign keys
                    model_fields = ModelField.objects.filter(app_model=app_model['id']).exclude(data_type__name__contains='ForeignKey')
                    model_fields_serializer = MinimalModelFieldSerializer(model_fields, many=True)
                    app_model['model_fields'] = model_fields_serializer.data
            return response.Response(project_apps, status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, Http404):
            return response.Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
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
            project = Project.objects.get(id=pk)

            # Building the project directory
            with tempfile.SpooledTemporaryFile() as tmp:
                with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as main_directory:
                    # Create the rest services directory
                    create_rest_services_directory(main_directory, project)
                    create_web_client_directory(main_directory, project)

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
