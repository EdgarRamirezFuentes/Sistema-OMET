from project.utils import get_template_file_content
from ..HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS

class ControllerBuilder:
    def __init__(self, app_model):
        self.app_model = app_model
        self.controller_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_controller'])

    def build(self):
        project_app_name = self.app_model.project_app.name
        app_model = self.app_model.name
        self.controller_script = self.controller_script.replace('{{APP_MODEL}}', app_model)
        self.controller_script = self.controller_script.replace('{{PROJECT_APP}}', project_app_name)

        return self.controller_script
