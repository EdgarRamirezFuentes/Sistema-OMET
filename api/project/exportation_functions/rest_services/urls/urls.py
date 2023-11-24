from project.utils import get_template_file_content
from core.models import (
    AppModel,
    ForeignKeyRelation
)
from ..HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS

def create_project_app_urls_script(main_directory, project_app):
    """Create the urls of the project app

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project_app (ProjectApp): The project app object
    """
    try:
        project_models = AppModel.objects.filter(project_app=project_app)

        if not project_models:
            raise ValueError(f'La app {project_app.name} debe tener al menos un modelo.')

        project_app_name = project_app.name.lower()
        urls_template_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['api_urls'])
        urls_template_content = urls_template_content.replace('{{APP_NAME}}', project_app_name)

        router_url = 'router.register(\'{{MODEL_NAME_URL}}\', views.{{MODEL_NAME}}ViewSet, basename=\'{{MODEL_NAME}}\')\n'
        router_urls = ''

        for project_model in project_models:

            foreign_key_relations = ForeignKeyRelation.objects.filter(model_field_origin__app_model=project_model)

            if foreign_key_relations:
                urls_template_content = urls_template_content.replace('{{FOREIGN_KEY_URLS}}', build_foreign_key_urls(foreign_key_relations) + '\n{{FOREIGN_KEY_URLS}}')


            project_model_name = project_model.name
            model_urls = router_url
            model_urls = model_urls.replace('{{MODEL_NAME}}', project_model_name)
            model_urls = model_urls.replace('{{MODEL_NAME_URL}}', project_model_name.lower())
            router_urls += model_urls

        urls_template_content = urls_template_content.replace('{{ROUTER_URLS}}', router_urls)
        urls_template_content = urls_template_content.replace('{{FOREIGN_KEY_URLS}}', '')
        main_directory.writestr(f'api/{project_app_name}/urls.py', urls_template_content)

    except ValueError as e:
        raise e
    except Exception as e:
        raise e

def build_foreign_key_urls(foreign_key_relations):
    foreign_key_urls = set()

    for foreign_key_relation in foreign_key_relations:
        model_field_origin_model_name = foreign_key_relation.model_field_origin.app_model.name
        model_field_related_model_name = foreign_key_relation.model_field_related.app_model.name
        model_field_related_name = foreign_key_relation.model_field_related.name

        path = f"\tpath('{model_field_origin_model_name.lower()}/get-{model_field_related_model_name.lower()}/{model_field_related_name.lower()}/', views.{model_field_origin_model_name}{model_field_related_model_name}{model_field_related_name}ListView.as_view(), name='get_{model_field_related_model_name.lower()}_{model_field_related_name.lower()}'),"
        foreign_key_urls.add(path)

    return '\n'.join(foreign_key_urls)
