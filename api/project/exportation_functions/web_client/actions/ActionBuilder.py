from project.utils import get_template_file_content
from ..HELPER_DICTIONARIES import SCRIPT_TEMPLATE_URLS
from core.models import ForeignKeyRelation

class ActionBuilder:
    def __init__(self, app_model):
        self.__app_model = app_model
        self.action_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_actions'])

    def build(self):
        project_app_name = self.__app_model.project_app.name
        app_model_name = self.__app_model.name
        model_url = f'{project_app_name.lower()}/{app_model_name.lower()}/'
        self.action_script = self.action_script.replace('{{APP_MODEL}}', app_model_name)
        self.action_script = self.action_script.replace('{{MODEL_URL}}', model_url)

        foreign_key_relations = ForeignKeyRelation.objects.filter(model_field_origin__app_model=self.__app_model)

        if foreign_key_relations:
            self.action_script = self.action_script.replace('{{FOREIGN_KEY_ACTIONS}}', self.build_foreign_key_actions(foreign_key_relations))

        self.action_script = self.action_script.replace('{{FOREIGN_KEY_ACTIONS}}', '')

        return self.action_script

    def build_foreign_key_actions(self, foreign_key_relations):
        foreign_key_actions = set()

        for foreign_key_relation in foreign_key_relations:
            model_field_origin_app_name = self.__app_model.project_app.name
            model_field_origin_model_name = foreign_key_relation.model_field_origin.app_model.name
            model_field_related_model_name = foreign_key_relation.model_field_related.app_model.name
            model_field_related_name = foreign_key_relation.model_field_related.name

            foreign_key_action = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_foreign_key_actions'])
            foreign_key_action = foreign_key_action.replace('{{FOREIGN_APP_MODEL}}', model_field_related_model_name.title())
            foreign_key_action = foreign_key_action.replace('{{FOREIGN_MODEL_FIELD}}', model_field_related_name.title())
            path = f"{model_field_origin_app_name}/{model_field_origin_model_name.lower()}/get-{model_field_related_model_name.lower()}/{model_field_related_name.lower()}/"
            foreign_key_action = foreign_key_action.replace('{{FOREIGN_MODEL_FIELD_URL}}', path)
            foreign_key_actions.add(foreign_key_action)

        return '\n\n'.join(foreign_key_actions)
