import os
from project.utils import get_template_file_content
from .HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS
from django.conf import settings

from core.models import (
    ProjectApp
)

from .sidebar.sidebar import create_sidebar_component


def create_web_client_directory(main_directory, project):
    """Create the web client directory in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project (Project): The project object
    """
    try:
        create_web_client_base_directories(main_directory)
        create_project_app_directories(main_directory, project)
        create_sidebar_component(main_directory, project)
        create_login_component(main_directory, project)
        create_index_page(main_directory, project)
    except ValueError as e:
        raise e

def create_web_client_base_directories(main_directory):
    """Add the base directories of the web client in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
    """
    api_template_path = os.path.join(settings.BASE_DIR, 'exported_project_template/webclient')
    # Adding the web client to the zip file.
    for root, dirs, files in os.walk(api_template_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            arcname = os.path.relpath(file_path,api_template_path)

            main_directory.write(file_path, f'web/{arcname}')

def create_project_app_directories(main_directory, project):
    project_apps = ProjectApp.objects.filter(project=project)

    for project_app in project_apps:
        create_project_app_directory(main_directory, project_app)

def create_project_app_directory(main_directory, project_app):
    """Create the web client directory in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project (Project): The project object
    """
    try:
        main_directory.writestr(f'web/src/{project_app.name}/{project_app.name}Create.jsx', f'// Create {project_app.name} component')
        main_directory.writestr(f'web/src/{project_app.name}/{project_app.name}Detail.jsx', f'// Detail {project_app.name} component')
        main_directory.writestr(f'web/src/{project_app.name}/{project_app.name}List.jsx', f'// List {project_app.name} component')
        main_directory.writestr(f'web/src/{project_app.name}/{project_app.name}Update.jsx', f'// Update {project_app.name} component')
    except ValueError as e:
        raise e

def create_login_component(main_directory, project):
    """Create the login component in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
    """
    try:
        project_name = project.name
        login_component = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_login'])
        login_component = login_component.replace('{{PROJECT_NAME}}', project_name)
        main_directory.writestr(f'web/src/Login/Login.jsx', login_component)
    except ValueError as e:
        raise e

def create_index_page(main_directory, project):
    """Create the index page in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
    """
    try:
        project_name = project.name
        index_page = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_index'])
        index_page = index_page.replace('{{PROJECT_NAME}}', project_name)
        main_directory.writestr(f'web/index.html', index_page)
    except ValueError as e:
        raise e
