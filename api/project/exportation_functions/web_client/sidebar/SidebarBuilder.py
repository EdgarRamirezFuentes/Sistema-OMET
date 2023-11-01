from project.utils import get_template_file_content
from ..HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS
from core.models import (
    ProjectApp,
    AppModel
)

class SidebarBuilder():
    def __init__(self, project):
        self.project = project
        self.sidebar = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_sidebar'])
        self.sidebar_items = ''

    def build(self):
        self.__build_app_sidebar_items()

        return self.sidebar

    def __build_app_sidebar_items(self):
        sidebar_app_items = ''
        item_id = 2

        for project_app in ProjectApp.objects.filter(project=self.project):
            sidebar_app_items += self.__build_app_sidebar_item(project_app, item_id)
            item_id += 1
            print(sidebar_app_items)

        self.sidebar = self.sidebar.replace('{{APP_ITEMS}}', sidebar_app_items)

    def __build_app_sidebar_item(self, project_app, item_id):
        sidebar_app_item = '\t\t' + get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_sidebar_app_item'])

        sidebar_app_item = sidebar_app_item.replace('{{ITEM_NAME}}', f'\'{project_app.name.title()}\'')
        sidebar_app_item = sidebar_app_item.replace('{{ITEM_ID}}', str(item_id))

        sidebar_model_items = self.__build_model_sidebar_items(project_app)

        sidebar_app_item = sidebar_app_item.replace('{{MODEL_ITEMS}}', sidebar_model_items)
        sidebar_app_paths = self.__build_app_sidebar_paths(project_app)

        sidebar_app_item = sidebar_app_item.replace('{{ITEM_PATHS}}', sidebar_app_paths)

        return sidebar_app_item

    def __build_app_sidebar_paths(self, project_app):
        app_name = project_app.name.lower()
        sidebar_app_paths = ''

        for app_model in AppModel.objects.filter(project_app=project_app):
            model_name = app_model.name.lower()
            sidebar_app_paths += f'\'/{app_name}/{model_name}/get\', '

        return sidebar_app_paths

    def __build_model_sidebar_items(self, project_app):
        sidebar_model_items = ''
        item_id = 1

        for app_model in AppModel.objects.filter(project_app=project_app):
            sidebar_model_items += self.__build_model_sidebar_item(app_model, item_id)
            item_id += 1

        return sidebar_model_items


    def __build_model_sidebar_item(self, app_model, item_id):
        sidebar_model_item = '\t\t' + get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_sidebar_model_item'])

        sidebar_model_item = sidebar_model_item.replace('{{ITEM_NAME}}', f'\'{app_model.name}\'')
        sidebar_model_item = sidebar_model_item.replace('{{ITEM_ID}}', str(item_id))
        sidebar_model_item = sidebar_model_item.replace('{{APP_NAME}}', app_model.project_app.name)
        sidebar_model_item = sidebar_model_item.replace('{{MODEL_NAME}}', app_model.name.lower())

        return sidebar_model_item
