import os
from django.conf import settings


def create_web_client_directory(main_directory, project):
    """Create the web client directory in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project (Project): The project object
    """
    try:
        create_web_client_base_directories(main_directory)
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
