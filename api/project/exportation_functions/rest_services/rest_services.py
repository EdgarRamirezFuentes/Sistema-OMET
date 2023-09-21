import os
from django.conf import settings
import secrets

from core.models import (
    ProjectApp,
    AppModel,
    ModelField,
    ValidatorValue,
)

from project.utils import format_project_name

SCRIPT_TEMPLATE_URLS = {
    'api_apps': os.path.join(settings.BASE_DIR, 'script_templates/api/apps/app.txt'),
    'api_models': os.path.join(settings.BASE_DIR, 'script_templates/api/models/model.txt'),
    'api_serializers': os.path.join(settings.BASE_DIR, 'script_templates/api/serializers/serializer.txt'),
    'api_views': os.path.join(settings.BASE_DIR, 'script_templates/api/views/views.txt'),
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

def create_rest_services_directory(main_directory, project):
    """Create the rest services directory in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project (Project): The project object
    """
    try:
        create_rest_services_base_directories(main_directory)

        # Creating the directories of each project app
        create_project_app_directories(main_directory, project)
        # Creating the settings file
        create_settings_file(main_directory, project)
        # Creating the global urls file
        create_global_urls_file(main_directory, project)

        # Creating the env files
        create_env_files(main_directory, format_project_name(project.name).lower())
        # Creating the docker files
        create_docker_files(main_directory, format_project_name(project.name).lower())
    except ValueError as e:
        raise e

def create_env_files(main_directory, project_name):
    """Add the env files to the zip file

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project_name (str): The name of the project
    """
    # Adding the env files to the zip file
    DB_PASSWORD = secrets.token_hex(12)
    RABBITMQ_PASSWORD = secrets.token_hex(12)

    env_file_api_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['env_file_api'])
    env_file_api_content = env_file_api_content.replace('{{SECRET_KEY}}', secrets.token_hex(24))
    env_file_api_content = env_file_api_content.replace('{{PROJECT_NAME}}', project_name)
    env_file_api_content = env_file_api_content.replace('{{DB_PASSWORD}}', DB_PASSWORD)
    env_file_api_content = env_file_api_content.replace('{{RABBITMQ_PASSWORD}}', RABBITMQ_PASSWORD)
    main_directory.writestr('env_files/api/.env', env_file_api_content)

    env_file_postgresql_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['env_file_postgresql'])
    env_file_postgresql_content = env_file_postgresql_content.replace('{{PROJECT_NAME}}', project_name)
    env_file_postgresql_content = env_file_postgresql_content.replace('{{DB_PASSWORD}}', DB_PASSWORD)
    main_directory.writestr('env_files/postgresql/.env', env_file_postgresql_content)

    env_file_rabbitmq_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['env_file_rabbitmq'])
    env_file_rabbitmq_content = env_file_rabbitmq_content.replace('{{PROJECT_NAME}}', project_name)
    env_file_rabbitmq_content = env_file_rabbitmq_content.replace('{{RABBITMQ_PASSWORD}}', RABBITMQ_PASSWORD)
    main_directory.writestr('env_files/rabbitmq/.env', env_file_rabbitmq_content)

def create_docker_files(main_directory, project_name):
    """Add the files needed to run the project with docker

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
    """
    # Adding the docker files to the zip file
    dockerfile_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['dockerfile'])
    dockerfile_content = dockerfile_content.replace('{{PROJECT_NAME}}', project_name)
    main_directory.writestr('api/Dockerfile', dockerfile_content)

    docker_compose_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['docker_compose'])
    docker_compose_content = docker_compose_content.replace('{{PROJECT_NAME}}', project_name)
    main_directory.writestr('docker-compose.yml', docker_compose_content)

def create_rest_services_base_directories(main_directory):
    """Create the base directories of the rest services in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
    """
    api_template_path = os.path.join(settings.BASE_DIR, 'exported_project_template/api')
    # Adding the services to the zip file.
    for root, dirs, files in os.walk(api_template_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            arcname = os.path.relpath(file_path,api_template_path)

            main_directory.write(file_path, f'api/{arcname}')

def create_project_app_directories(main_directory, project):
        """Create the directories of each project app in the zip file.

        Args:
            main_directory (zipfile.ZipFile): The main directory of the project
            project (Project): The project object
        """
        project_apps = ProjectApp.objects.filter(project=project)

        if not project_apps:
            raise ValueError(f'El proyecto {project.name} debe tener al menos una app.')

        for project_app in project_apps:
            build_project_app_directory(main_directory, project_app)

def build_project_app_directory(main_directory, project_app):
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
            main_directory.writestr(f'api/{project_app_directory}/migrations/__init__.py', '')

            app_template_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['api_apps'])
            app_template_content = app_template_content.replace('{{APP_NAME_CLASS}}', project_app_name)
            app_template_content = app_template_content.replace('{{APP_NAME}}', project_app_directory)
            main_directory.writestr(f'api/{project_app_directory}/apps.py', app_template_content)

            # Adding the project app models
            create_app_models(main_directory, project_app)
            create_project_app_serializers(main_directory, project_app)
            create_project_app_views(main_directory, project_app)
            create_project_app_urls_script(main_directory, project_app)
        except ValueError as e:
            raise e
        except Exception as e:
            raise e

def create_app_models(main_directory, project_app):
    """Create the models of the app

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project_app (ProjectApp): The app object
    """
    try:
        app_models = AppModel.objects.filter(project_app=project_app, is_active=True)

        if not app_models:
            raise ValueError(f'La app {project_app.name} debe tener al menos un modelo.')

        model_imports = ''

        for app_model in app_models:
            build_app_model_script(main_directory, app_model)
            app_model_name = format_project_name(app_model.name)
            model_imports += f'from .{app_model_name} import {app_model_name}\n'

        # Adding the model imports
        main_directory.writestr(f'api/{project_app.name}/models/__init__.py', model_imports)
    except ValueError as e:
        raise e
    except Exception as e:
        raise e

def build_app_model_script(main_directory, app_model):
    """Build the script of the app model

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        app_model (AppModel): The app model object
    """
    try:
        project_app_name = app_model.project_app.name
        project_app_name = format_project_name(project_app_name).lower()
        app_model_name = format_project_name(app_model.name)

        app_model_body = get_template_file_content(SCRIPT_TEMPLATE_URLS['api_models'])
        app_model_body = app_model_body.replace('{{MODEL_NAME}}', app_model_name)

        # Adding the model fields
        app_model_body = add_model_fields(app_model, app_model_body)

        main_directory.writestr(f'api/{project_app_name}/models/{app_model_name}.py', app_model_body)
    except ValueError as e:
        raise e
    except Exception as e:
        raise e

def create_settings_file(main_directory, project):
    """Add the settings file with the local apps to the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project (Project): The project object
    """

    # Getting the content of the settings file
    with open(SCRIPT_TEMPLATE_URLS['api_settings'], 'r') as file:
        settings_file_content = file.read()

    project_apps = ProjectApp.objects.filter(project=project)

    if not project_apps:
        raise ValueError(f'El proyecto {project.name} debe tener al menos una app.')

    # Adding the local apps to the settings file
    local_apps_names = [format_project_name(project_app.name).lower() for project_app in project_apps]
    local_apps_formatted = ',\n    '.join([f"'{local_app_name}'" for local_app_name in local_apps_names])

    settings_file_content = settings_file_content.replace('{{LOCAL_APPS}}', local_apps_formatted)
    settings_file_content = settings_file_content.replace('{{PROJECT_NAME}}', project.name)

    # Adding the settings file to the zip file
    main_directory.writestr('api/api/settings.py', settings_file_content)

def create_global_urls_file(main_directory, project):
    """Add the global urls file to the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project (Project): The project object
    """
    global_urls_file_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['api_global_urls'])
    project_apps = ProjectApp.objects.filter(project=project)

    if not project_apps:
        raise ValueError(f'El proyecto {project.name} debe tener al menos una app.')
    project_app_names = [format_project_name(project_app.name).lower() for project_app in project_apps]

    for project_app_name in project_app_names:
        url = f"path('{project_app_name}/', include('{project_app_name}.urls')),\n    " + '{{APPS_URLS}}'
        global_urls_file_content = global_urls_file_content.replace('{{APPS_URLS}}', url)


    global_urls_file_content = global_urls_file_content.replace('{{APPS_URLS}}', '')

    # Adding the global urls file to the zip file
    main_directory.writestr('api/api/urls.py', global_urls_file_content)

def get_template_file_content(file_path):
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

def create_project_app_urls_script(main_directory, project_app):
    """Create the urls of the project app

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project_app (ProjectApp): The project app object
    """
    try:
        project_models = AppModel.objects.filter(project_app=project_app, is_active=True)

        if not project_models:
            raise ValueError(f'La app {project_app.name} debe tener al menos un modelo.')

        project_app_name = format_project_name(project_app.name).lower()
        urls_template_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['api_urls'])
        urls_template_content = urls_template_content.replace('{{APP_NAME}}', project_app_name)

        router_url = 'router.register(\'{{MODEL_NAME}}\', views.{{MODEL_NAME}}ViewSet, basename=\'{{MODEL_NAME}}\')\n'
        router_urls = ''

        for project_model in project_models:
            project_model_name = format_project_name(project_model.name)
            model_urls = router_url
            model_urls = model_urls.replace('{{MODEL_NAME}}', project_model_name)
            router_urls += model_urls

        urls_template_content = urls_template_content.replace('{{ROUTER_URLS}}', router_urls)
        main_directory.writestr(f'api/{project_app_name}/urls.py', urls_template_content)

    except ValueError as e:
        raise e
    except Exception as e:
        raise e


def create_project_app_views(main_directory, project_app):
    """Create the views of the project app

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project_app (ProjectApp): The project app object
    """
    try:
        project_models = AppModel.objects.filter(project_app=project_app, is_active=True)

        if not project_models:
            raise ValueError(f'La app {project_app.name} debe tener al menos un modelo.')

        view_imports = ''

        for project_model in project_models:
            project_model_name = format_project_name(project_model.name)
            build_project_model_view_script(main_directory, project_model)
            view_imports += f'from .{project_model_name} import {project_model_name}ViewSet\n'

        # Adding the view imports
        main_directory.writestr(f'api/{project_app.name}/views/__init__.py', view_imports)
    except ValueError as e:
        raise e
    except Exception as e:
        raise e

def build_project_model_view_script(main_directory, project_model):
    """Build the script of the project model view

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project_model_name (str): The name of the project model
    """
    try:
        project_app_directory = format_project_name(project_model.project_app.name).lower()
        project_model_name = format_project_name(project_model.name)
        view_template_path = SCRIPT_TEMPLATE_URLS['api_views']
        view_template_content = get_template_file_content(view_template_path)
        view_template_content = view_template_content.replace('{{MODEL_NAME}}', project_model_name)
        view_template_content = view_template_content.replace('{{APP_NAME}}', project_app_directory)
        main_directory.writestr(f'api/{project_app_directory}/views/{project_model_name}.py', view_template_content)
    except ValueError as e:
        raise e
    except Exception as e:
        raise e

def create_project_app_serializers(main_directory, project_app):
    """Add the serializers of the project app

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project_app (ProjectApp): The project app object
    """
    try:
        project_models = AppModel.objects.filter(project_app=project_app, is_active=True)

        if not project_models:
            raise ValueError(f'La app {project_app.name} debe tener al menos un modelo.')

        serializer_imports = ''

        for project_model in project_models:
            project_model_name = format_project_name(project_model.name)
            build_project_model_serializer_script(main_directory, project_model)
            serializer_imports += f'from .{project_model_name} import {project_model_name}Serializer\n'

        # Adding the serializer imports
        main_directory.writestr(f'api/{project_app.name}/serializers/__init__.py', serializer_imports)
    except ValueError as e:
        raise e
    except Exception as e:
        raise e

def build_project_model_serializer_script(main_directory, project_model):
    """Build the script of the project model serializer

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project_model_name (str): The name of the project model
    """
    try:
        project_app_directory = format_project_name(project_model.project_app.name).lower()
        project_model_name = format_project_name(project_model.name)
        serializer_template_path = SCRIPT_TEMPLATE_URLS['api_serializers']
        serializer_template_content = get_template_file_content(serializer_template_path)
        serializer_template_content = serializer_template_content.replace('{{MODEL_NAME}}', project_model_name)
        serializer_template_content = serializer_template_content.replace('{{APP_NAME}}', project_app_directory)
        main_directory.writestr(f'api/{project_app_directory}/serializers/{project_model_name}.py', serializer_template_content)
    except ValueError as e:
        raise e
    except Exception as e:
        raise e

def add_model_fields(app_model, app_model_body):
    model_fields = ModelField.objects.filter(app_model=app_model, is_active=True)

    foreign_key_imports = set()

    if not model_fields:
        raise ValueError(f'El modelo {app_model.name} debe tener al menos un campo.')

    validator_imports = set()

    for model_field in model_fields:
        app_model_body = add_model_field(model_field,
                                            app_model_body)
        validator_imports = get_validator_imports(model_field,
                                                    validator_imports)


    # Adding the validator imports
    app_model_body = app_model_body.replace('{{VALIDATOR_IMPORTS}}',
                                                    '\n'.join(validator_imports))

    app_model_body = app_model_body.replace('{{MODEL_FIELDS}}', '')

    return app_model_body

def add_model_field(model_field, project_model_body):
    model_field_data_type = model_field.data_type.name.lower()
    model_field_name = model_field.name
    model_field_body = get_template_file_content(MODEL_FIELD_TEMPLATE_URLS[model_field_data_type])
    model_field_body = model_field_body.replace('{{FIELD_NAME}}', model_field_name)

    # Adding the validators
    model_field_body = add_validators(model_field, model_field_body)
    project_model_body = project_model_body.replace('{{MODEL_FIELDS}}', f'{model_field_body}    ' + '{{MODEL_FIELDS}}')

    return project_model_body

def get_validator_imports(model_field, validator_imports):
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

def add_validators(model_field, model_field_body):
    validators = ValidatorValue.objects.filter(model_field=model_field)

    for validator in validators:
        model_field_body = add_validator(validator, model_field_body)

    # Removing the validators and attributes placeholders
    model_field_body = model_field_body.replace('{{VALIDATORS}}, ', '')
    model_field_body = model_field_body.replace('{{ATTRIBUTES}}, ', '')
    model_field_body = model_field_body.replace('validators=[]', '')

    return model_field_body

def add_validator(validator, model_field_body):
    validator_name = validator.validator.name
    validator_value = validator.value


    ATTRIBUTES = ['max_digits', 'decimal_places', 'null',
                    'required', 'db_index', 'unique',
                    'auto_now_add', 'auto_now', 'max_length']

    VALIDATORS = {
        'min_value': 'MinValueValidator({{VALUE}})',
        'max_value': 'MaxValueValidator({{VALUE}})',
        'min_length': 'MinLengthValidator({{VALUE}})',
        'regex': 'RegexValidator({{VALUE}})',
    }

    if validator_name in ATTRIBUTES:
        model_field_body = model_field_body.replace('{{ATTRIBUTES}}, ',
                                                    f'{validator_name}={validator_value}, ' + '{{ATTRIBUTES}}, ')
    elif validator_name in VALIDATORS.keys():
        validator_method = VALIDATORS[validator_name]
        validator_method = validator_method.replace('{{VALUE}}', validator_value)
        model_field_body = model_field_body.replace('{{VALIDATORS}}, ', f'{validator_method}, ' + '{{VALIDATORS}}, ')

    return model_field_body
