from project.utils import get_template_file_content
from ..HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS
from core.models import ForeignKeyRelation

class ControllerBuilder:
    def __init__(self, app_model):
        self.app_model = app_model
        self.controller_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_controller'])

    def build(self):
        project_app_name = self.app_model.project_app.name
        app_model = self.app_model.name
        self.controller_script = self.controller_script.replace('{{APP_MODEL}}', app_model)
        self.controller_script = self.controller_script.replace('{{PROJECT_APP}}', project_app_name)

        foreign_key_relations = ForeignKeyRelation.objects.filter(model_field_origin__app_model=self.app_model)

        if foreign_key_relations:
            self.controller_script = self.controller_script.replace('{{FOREIGN_KEY_CONTROLLERS}}', self.build_foreign_key_controllers(foreign_key_relations))

        self.controller_script = self.controller_script.replace('{{FOREIGN_KEY_CONTROLLERS}}', '')
        return self.controller_script


    def build_foreign_key_controllers(self, foreign_key_relations):
        foreign_key_controllers = set()

        for foreign_key_relation in foreign_key_relations:
            model_field_related_model_name = foreign_key_relation.model_field_related.app_model.name
            model_field_related_name = foreign_key_relation.model_field_related.name

            foreign_key_controller = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_foreign_key_controller'])
            foreign_key_controller = foreign_key_controller.replace('{{FOREIGN_APP_MODEL}}', model_field_related_model_name.title())
            foreign_key_controller = foreign_key_controller.replace('{{FOREIGN_MODEL_FIELD}}', model_field_related_name.title())
            foreign_key_controllers.add(foreign_key_controller)

        return '\n\n'.join(foreign_key_controllers)
