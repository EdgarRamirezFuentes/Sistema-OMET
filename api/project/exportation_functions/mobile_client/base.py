import os
from project.utils import get_template_file_content
from .HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS
from django.conf import settings

from core.models import (
    ProjectApp
)

#from .sidebar.sidebar import create_sidebar_component
from .drawer.drawer import create_drawer_component, create_drawer_custom_content
from .views.views import create_list_views
from .stack.stack import create_stacks, create_model_stacks
#from .controllers.controller import create_app_controllers
#from .actions.action import create_app_actions
#from .views.views import create_list_views
#from .router.router import create_project_router


def create_mobile_client_directory(main_directory, project):
    """Create the web client directory in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project (Project): The project object
    """
    try:
        create_mobile_client_base_directories(main_directory)
        create_login_component(main_directory, project)
        create_drawer_component(main_directory, project)
        create_drawer_custom_content(main_directory, project)
        create_project_stacks(main_directory, project)
        create_project_model_stacks(main_directory, project)
        create_project_list_views(main_directory, project)
        #create_index_page(main_directory, project)
        #create_project_controllers(main_directory, project)
        #create_project_actions(main_directory, project)
        #create_project_router(main_directory, project)
    except ValueError as e:
        raise e

def create_mobile_client_base_directories(main_directory):
    """Add the base directories of the web client in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
    """
    api_template_path = os.path.join(settings.BASE_DIR, 'exported_project_template/mobileclient')
    # Adding the web client to the zip file.
    for root, dirs, files in os.walk(api_template_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            arcname = os.path.relpath(file_path,api_template_path)

            print(file_path, arcname)
            main_directory.write(file_path, f'mobile/{arcname}')

def create_login_component(main_directory, project):
    """Create the login component in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
    """
    try:
        project_name = project.name
        login_component = get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_login'])
        login_component = login_component.replace('{{PROJECT_NAME}}', project_name)
        main_directory.writestr(f'mobile/src/Login/Login.jsx', login_component)
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

def create_project_controllers(main_directory, project):
    """Create the controllers of the project.

    Args:
        project (Project): The project object
    """
    try:
        project_apps = ProjectApp.objects.filter(project=project)

        #for project_app in project_apps:
        #    create_app_controllers(main_directory, project_app)
    except ValueError as e:
        raise e

def create_project_actions(main_directory, project):
    """Create the actions of the project.

    Args:
        project (Project): The project object
    """
    try:
        project_apps = ProjectApp.objects.filter(project=project)

        #for project_app in project_apps:
        #    create_app_actions(main_directory, project_app)
    except ValueError as e:
        raise e

def create_project_list_views(main_directory, project):
    """Create the list views of the project.

    Args:
        project (Project): The project object
    """
    try:
        project_apps = ProjectApp.objects.filter(project=project)

        for project_app in project_apps:
            create_list_views(main_directory, project_app)
    except ValueError as e:
        raise e
    
def create_project_stacks(main_directory, project):
    """Create the stacks of the project.

    Args:
        project (Project): The project object
    """
    try:
        project_apps = ProjectApp.objects.filter(project=project)

        for project_app in project_apps:
            create_stacks(main_directory, project_app)
    except ValueError as e:
        raise e
    
def create_project_model_stacks(main_directory, project):
    """Create the stacks of the project.

    Args:
        project (Project): The project object
    """
    try:
        project_apps = ProjectApp.objects.filter(project=project)

        for project_app in project_apps:
            create_model_stacks(main_directory, project_app)
    except ValueError as e:
        raise e
