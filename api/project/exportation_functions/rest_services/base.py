import os
import secrets
from django.conf import settings
from .HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS
from .models.models import create_app_models
from .serializers.serializers import create_project_app_serializers
from .urls.urls import create_project_app_urls_script
from .views.views import create_project_app_views


from project.utils import (
    format_project_name,
    get_template_file_content
)
from core.models import ProjectApp

def create_rest_services_directory(main_directory, project):
    """Create the rest services directory in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project (Project): The project object
    """
    try:
        create_rest_services_base_directories(main_directory)

        # Creating the directories of each project app
        add_project_app_directories(main_directory, project)
        # Creating the settings file
        add_settings_file(main_directory, project)
        # Creating the global urls file
        add_global_urls_file(main_directory, project)

        # Creating the env files
        add_env_files(main_directory, format_project_name(project.name).lower())
        # Creating the docker files
        add_docker_files(main_directory, format_project_name(project.name).lower())
    except ValueError as e:
        raise e

def create_rest_services_base_directories(main_directory):
    """Add the base directories of the rest services in the zip file.

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

def add_env_files(main_directory, project_name):
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

def add_docker_files(main_directory, project_name):
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


def add_project_app_directories(main_directory, project):
        """add the directories of each project app in the zip file.

        Args:
            main_directory (zipfile.ZipFile): The main directory of the project
            project (Project): The project object
        """
        project_apps = ProjectApp.objects.filter(project=project)

        if not project_apps:
            raise ValueError(f'El proyecto {project.name} debe tener al menos una app.')

        for project_app in project_apps:
            create_project_app_directory(main_directory, project_app)

def create_project_app_directory(main_directory, project_app):
        """Create the project app directory

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

def add_settings_file(main_directory, project):
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

def add_global_urls_file(main_directory, project):
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
