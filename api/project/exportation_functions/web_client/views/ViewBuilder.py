from project.utils import get_template_file_content
from ..HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS

class ViewBuilder:

    def __init__(self, app_model):
        self.__app_model = app_model


    def build_list_view(self):
        model_name = self.__app_model.name
        list_view_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_list_view'])
        return list_view_script.replace('{{MODEL_NAME}}', model_name)
