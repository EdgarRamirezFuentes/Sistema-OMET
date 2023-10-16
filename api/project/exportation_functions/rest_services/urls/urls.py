from project.utils import format_project_name, get_template_file_content
from core.models import AppModel
from ..HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS

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

        project_app_name = project_app.name.lower()
        urls_template_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['api_urls'])
        urls_template_content = urls_template_content.replace('{{APP_NAME}}', project_app_name)

        router_url = 'router.register(\'{{MODEL_NAME_URL}}\', views.{{MODEL_NAME}}ViewSet, basename=\'{{MODEL_NAME}}\')\n'
        router_urls = ''

        for project_model in project_models:
            project_model_name = project_model.name
            model_urls = router_url
            model_urls = model_urls.replace('{{MODEL_NAME}}', project_model_name)
            model_urls = model_urls.replace('{{MODEL_NAME_URL}}', project_model_name.lower())
            router_urls += model_urls

        urls_template_content = urls_template_content.replace('{{ROUTER_URLS}}', router_urls)
        main_directory.writestr(f'api/{project_app_name}/urls.py', urls_template_content)

    except ValueError as e:
        raise e
    except Exception as e:
        raise e
