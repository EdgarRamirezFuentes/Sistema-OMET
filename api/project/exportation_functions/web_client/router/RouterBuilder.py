from project.utils import get_template_file_content

from core.models import (
    ProjectApp,
    AppModel,
)

from ..HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS


class RouterBuilder:

    def __init__(self, project):
        self.__project = project
        self.__router_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_router'])

    def build(self):
        self.__build_list_view_routes()

        self.__router_script = self.__router_script.replace('{{LIST_VIEW_IMPORT}}', '')
        self.__router_script = self.__router_script.replace('{{LIST_VIEW_ROUTE}}', '')

        return self.__router_script

    def __build_list_view_routes(self):
        project_apps = ProjectApp.objects.filter(project=self.__project)

        for project_app in project_apps:
            self.__build_app_list_view_routes(project_app)

    def __build_app_list_view_routes(self, project_app):
        app_models = AppModel.objects.filter(project_app=project_app)

        for app_model in app_models:
            app_model_name = app_model.name
            project_app_name = app_model.project_app.name

            component_import = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_list_view_import'])
            component_route = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_list_view_route'])

            component_import = component_import.replace('{{APP_NAME}}', project_app_name)
            component_import = component_import.replace('{{APP_NAME_TITLE}}', project_app_name.title())
            component_import = component_import.replace('{{MODEL_NAME}}', app_model_name)

            component_route = component_route.replace('{{COMPONENT_NAME}}', f'{project_app_name.title()}{app_model_name}')
            component_route = component_route.replace('{{COMPONENT_PATH}}', f'/{project_app_name}/{app_model_name}')

            self.__router_script = self.__router_script.replace('{{LIST_VIEW_IMPORT}}', component_import + '\n{{LIST_VIEW_IMPORT}}')
            self.__router_script = self.__router_script.replace('{{LIST_VIEW_ROUTE}}', '\t' * 7 + component_route + '\n{{LIST_VIEW_ROUTE}}')


