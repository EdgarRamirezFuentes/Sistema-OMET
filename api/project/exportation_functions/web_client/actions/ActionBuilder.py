from project.utils import get_template_file_content
from ..HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS

class ActionBuilder:
    def __init__(self, app_model):
        self.app_model = app_model
        self.action_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_actions'])

    def build(self):
        project_app_name = self.app_model.project_app.name
        app_model_name = self.app_model.name
        model_url = f'{project_app_name.lower()}/{app_model_name.lower()}/'
        self.action_script = self.action_script.replace('{{APP_MODEL}}', app_model_name)
        self.action_script = self.action_script.replace('{{MODEL_URL}}', model_url)

        return self.action_script
