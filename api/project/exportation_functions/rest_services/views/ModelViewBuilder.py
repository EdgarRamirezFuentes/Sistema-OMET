from core.models import ForeignKeyRelation
from project.utils import get_template_file_content
from ..HELPER_DICTIONARIES import (
    VIEWS_TEMPLATE_URLS,
    SCRIPT_TEMPLATE_URLS
)

class ModelViewBuilder():

    def __init__(self, app_model):
        self.__app_model = app_model
        self.__view_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['api_views'])

    def get_view_script(self):
        self.__build()
        return self.__view_script

    def __build(self):
        # Contain foreign keys fields
        foreign_keys_relations = ForeignKeyRelation.objects.filter(model_field_origin__app_model=self.__app_model)

        project_app_name = self.__app_model.project_app.name.lower()

        viewset_body = get_template_file_content(VIEWS_TEMPLATE_URLS['view'])
        foreign_keys_serializer_import = ''

        if foreign_keys_relations:
            viewset_body = get_template_file_content(VIEWS_TEMPLATE_URLS['foreign_key_view'])
            foreign_keys_serializer_import = f'from {project_app_name}.serializers ' \
                                            f'import {self.__app_model.name}ListSerializer\n'
            viewset_body = viewset_body.replace('{{LIST_VIEWS}}', self.__build_foreign_key_list_views(foreign_keys_relations))

        self.__view_script = self.__view_script.replace('{{VIEWSET}}', viewset_body)
        self.__view_script = self.__view_script.replace('{{FOREIGN_KEY_SERIALIZER_IMPORT}}', foreign_keys_serializer_import)
        self.__view_script = self.__view_script.replace('{{MODEL_NAME}}', self.__app_model.name)
        self.__view_script = self.__view_script.replace('{{APP_NAME}}', project_app_name)
        self.__view_script = self.__view_script.replace('{{FOREIGN_KEY_LIST_SERIALIZER_IMPORT}}', '')



    def __build_foreign_key_list_views(self, foreign_keys_relations):
        list_views = set()
        list_view_model_imports = set()
        list_view_serializer_imports = set()

        for foreign_key_relation in foreign_keys_relations:
            model_field_related = foreign_key_relation.model_field_related
            model_field_related_name = model_field_related.name
            model_field_related_app_model_name = model_field_related.app_model.name
            model_field_related_project_app_name = model_field_related.app_model.project_app.name.lower()

            list_view = get_template_file_content(VIEWS_TEMPLATE_URLS['foreign_key_list_view'])
            list_view = list_view.replace('{{FOREIGN_KEY_MODEL_NAME}}', model_field_related_app_model_name)
            list_view = list_view.replace('{{FOREIGN_KEY_MODEL_FIELD_NAME}}', model_field_related_name)
            list_view_model_imports.add(f'from {model_field_related_project_app_name}.models import {model_field_related_app_model_name}\n')
            list_view_serializer_imports.add(f'from {self.__app_model.project_app.name.lower()}.serializers import {model_field_related_app_model_name}{model_field_related_name}FieldSerializer\n')
            list_views.add(list_view)

        list_view_imports = '\n'.join(list_view_model_imports) + '\n' + '\n'.join(list_view_serializer_imports)
        self.__view_script = self.__view_script.replace('{{FOREIGN_KEY_LIST_SERIALIZER_IMPORT}}', list_view_imports)

        return '\n'.join(list_views)


