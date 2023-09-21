from core.models import ModelField
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

        foreign_keys_fields = ModelField.objects.filter(app_model=self.__app_model,
                                                        data_type__name__contains='ForeignKey').exists()
        project_app_name = self.__app_model.project_app.name.lower()

        viewset_body = get_template_file_content(VIEWS_TEMPLATE_URLS['view'])
        foreign_keys_serializer_import = ''

        if foreign_keys_fields:
            viewset_body = get_template_file_content(VIEWS_TEMPLATE_URLS['foreign_key_view'])
            foreign_keys_serializer_import = f'from {project_app_name}.serializers ' \
                                            f'import {self.__app_model.name}ListSerializer\n'

        viewset_body = viewset_body.replace('{{MODEL_NAME}}', self.__app_model.name)
        self.__view_script = self.__view_script.replace('{{FOREIGN_KEY_SERIALIZER_IMPORT}}', foreign_keys_serializer_import)
        self.__view_script = self.__view_script.replace('{{MODEL_NAME}}', self.__app_model.name)
        self.__view_script = self.__view_script.replace('{{APP_NAME}}', project_app_name)
        self.__view_script = self.__view_script.replace('{{VIEWSET}}', viewset_body)
