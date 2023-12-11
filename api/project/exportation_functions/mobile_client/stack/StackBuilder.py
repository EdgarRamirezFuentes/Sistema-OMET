from project.utils import get_template_file_content
from ..HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS
from core.models import (
    ProjectApp,
    AppModel
)
        
class StackBuilder():
    def __init__(self, project_app):
        self.__app = project_app
        self.__app_name = project_app.name
        self.__app_name_title = project_app.name.title()
        
        print("===self.__app===")
        print(self.__app)
        self.__app_models = AppModel.objects.filter(project_app=self.__app)
        
        self.stack_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_stack'])

    def build(self):
        self.__build_stack()
        

        return self.stack_content

    def __build_stack(self):

        stack_items = self.__build_stack_item()
        stack_imports = self.__build_stack_import()
        stack_buttons = self.__build_stack_button()


        self.stack_content = self.stack_content.replace('{{STACK_ELEMENTS}}', stack_items)
        self.stack_content = self.stack_content.replace('{{STACK_ELEMENTS_IMPORT}}', stack_imports)
        self.stack_content = self.stack_content.replace('{{STACK_BUTTONS}}', stack_buttons)
        self.stack_content = self.stack_content.replace('{{APP_NAME_TITLE}}', self.__app_name_title)

        return self.stack_content


    def __build_stack_item(self):
        drawer_model_item = ''
        models = self.__app_models
        for model in models:

            drawer_model_item += get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_stack_element'])

            drawer_model_item = drawer_model_item.replace('{{MODEL_NAME_TITLE}}', model.name.title())

        return drawer_model_item
    
    def __build_stack_import(self):
        drawer_model_import = ''
        models = self.__app_models
        for model in models:

            drawer_model_import += get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_stack_import'])

            drawer_model_import = drawer_model_import.replace('{{MODEL_NAME_TITLE}}', model.name.title())
            drawer_model_import = drawer_model_import.replace('{{MODEL_NAME}}', model.name)

        return drawer_model_import
    
    def __build_stack_button(self):
        drawer_model_button = ''
        models = self.__app_models

        for model in models:

            drawer_model_button += get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_stack_button'])

            drawer_model_button = drawer_model_button.replace('{{MODEL_NAME_TITLE}}', model.name.title())

        return drawer_model_button
    
class ModelStackBuilder():
    def __init__(self, app_model):
        self.__app_model = app_model
        self.__app_model_name = app_model.name
        self.__app_model_name_title = app_model.name.title()
        
        self.stack_content = get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_stack_model'])

    def build(self):
        self.__build_stack()
        

        return self.stack_content

    def __build_stack(self):

        stack_items = self.__build_stack_item()
        stack_imports = self.__build_stack_import()


        self.stack_content = self.stack_content.replace('{{STACK_SCREEN_ITEMS}}', stack_items)
        self.stack_content = self.stack_content.replace('{{SCREEN_IMPORTS}}', stack_imports)
        self.stack_content = self.stack_content.replace('{{APP_MODEL_NAME_TITLE}}', self.__app_model_name_title)

        return self.stack_content
    
    def __build_stack_item(self):
        stack_items = ''
        stack_items += get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_stack_model_create_view'])+'\n'
        stack_items = stack_items.replace('{{APP_MODEL_NAME_TITLE}}', self.__app_model_name)

        stack_items += get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_stack_model_update_view'])+'\n'
        stack_items = stack_items.replace('{{APP_MODEL_NAME_TITLE}}', self.__app_model_name)

        stack_items += get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_stack_model_retrieve_view'])+'\n'
        stack_items = stack_items.replace('{{APP_MODEL_NAME_TITLE}}', self.__app_model_name)

        stack_items += get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_stack_model_list_view'])+'\n'
        stack_items = stack_items.replace('{{APP_MODEL_NAME_TITLE}}', self.__app_model_name)

        return stack_items
    
    def __build_stack_import(self):
        stack_imports = ''
        stack_imports += get_template_file_content(SCRIPT_TEMPLATE_URLS['mobile_client_stack_model_import'])+'\n'
        stack_imports = stack_imports.replace('{{APP_MODEL_NAME_TITLE}}', self.__app_model_name)

        return stack_imports