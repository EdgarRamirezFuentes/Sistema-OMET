from project.utils import get_template_file_content
from ..HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS
from core.models import ModelField

class ViewBuilder:

    def __init__(self, app_model):
        self.__app_model = app_model
        self.__first_field = ModelField.objects.filter(app_model=app_model).order_by('order').first()


    def build_list_view(self):
        model_name = self.__app_model.name
        app_name = self.__app_model.project_app.name
        list_view_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_list_view'])
        list_view_script = list_view_script.replace('{{MODEL_NAME}}', model_name)
        list_view_script = list_view_script.replace('{{APP_NAME}}', app_name)
        list_view_script = list_view_script.replace('{{FIRST_VALUE_CAPITALIZE}}', f'"{self.__first_field.name.title()}"')
        list_view_script = list_view_script.replace('{{FIRST_VALUE}}', f'"{self.__first_field.name}"')

        return list_view_script
