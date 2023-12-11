from project.utils import get_template_file_content
from ..HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS
from core.models import (
    ProjectApp,
    AppModel
)

class DrawerBuilder():
    def __init__(self, project):
        self.project = project
        
        self.drawer = get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_drawer'])
        self.custom_drawer_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_drawer_custom_content'])
        self.drawer_items = ''

    def build(self):
        self.__build_app_drawer_items()

        return self.drawer

    def __build_app_drawer_items(self):
        drawer_app_items = ''
        drawer_app_imports = ''
        item_id = 2

        for project_app in ProjectApp.objects.filter(project=self.project):
            drawer_app_items += self.__build_app_drawer_item(project_app, item_id)
            drawer_app_imports += self.__build_drawer_stack_imports(project_app)
            item_id += 1

        self.drawer = self.drawer.replace('{{STACK_APP_VIEWS}}', drawer_app_items)
        self.drawer = self.drawer.replace('{{STACK_APP_IMPORT}}', drawer_app_imports)

    def __build_app_drawer_item(self, project_app, item_id):
        drawer_app_item = '\t\t' + get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_drawer_stack_element'])

        drawer_app_item = drawer_app_item.replace('{{MODEL_NAME_TITLE}}', project_app.name.title())
        


        #drawer_model_items = self.__build_model_drawer_items(project_app)

        #drawer_app_item = drawer_app_item.replace('{{MODEL_ITEMS}}', drawer_model_items)
        #drawer_app_paths = self.__build_app_drawer_paths(project_app)

        #drawer_app_item = drawer_app_item.replace('{{ITEM_PATHS}}', drawer_app_paths)

        return drawer_app_item
    
    def __build_drawer_stack_imports(self, project_app):
        drawer_app_imports = '\t\t' + get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_drawer_stack_import'])

        drawer_app_imports = drawer_app_imports.replace('{{MODEL_NAME_TITLE}}', project_app.name.title())

        drawer_app_imports = drawer_app_imports.replace('{{MODEL_NAME}}', project_app.name)

        return drawer_app_imports
        
class CustomDrawerContentBuilder():
    def __init__(self, project):
        self.project = project
        
        self.custom_drawer_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_drawer_custom_content'])

    def build(self):
        self.__build_drawer_custom_content()

        return self.custom_drawer_content

    def __build_drawer_custom_content(self):
        drawer_custom_content = ''

        for project_app in ProjectApp.objects.filter(project=self.project):
            drawer_custom_content += self.__build_model_drawer_item(project_app)

        self.custom_drawer_content = self.custom_drawer_content.replace('{{DRAWER_ITEMS}}', drawer_custom_content)

    def __build_model_drawer_item(self, app_model):
        drawer_model_item = get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_drawer_custom_content_element'])

        drawer_model_item = drawer_model_item.replace('{{MODEL_NAME_TITLE}}', app_model.name.title())

        return drawer_model_item