from core.models import (
    ModelField,
)

from project.utils import (
    format_project_name,
    get_template_file_content
)

from ..HELPER_DICTIONARIES import (
    SCRIPT_TEMPLATE_URLS,
    SERIALIZERS_TEMPLATE_URLS
)


class ModelSerializerBuilder():
    def __init__(self, app_model):
        # Serializer data
        self.__app_model = app_model
        self.__foreign_key_imports = set()
        self.__serializer_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['api_serializers'])
        self.__foreign_key_serializers = ''
        self.__foreign_key_fields = set()


    def get_serializer_script(self):
        self.__build()
        return self.__serializer_script


    def __build(self):
        app_name = self.__app_model.project_app.name.lower()
        self.__serializer_script = self.__serializer_script.replace('{{APP_NAME}}', app_name)
        self.__serializer_script = self.__serializer_script.replace('{{MODEL_NAME}}', self.__app_model.name)
        model_serializer = get_template_file_content(SERIALIZERS_TEMPLATE_URLS['model_serializer'])
        model_serializer = model_serializer.replace('{{MODEL_NAME}}', self.__app_model.name)

        foreign_key_model_fields = ModelField.objects.filter(app_model=self.__app_model,
                                                             data_type__name__contains='ForeignKey'
                                                            )

        if foreign_key_model_fields:
            self.__build_foreign_key_serializers(foreign_key_model_fields)

        self.__serializer_script = self.__serializer_script.replace('{{MODEL_SERIALIZER}}', model_serializer)
        self.__serializer_script = self.__serializer_script.replace('{{FOREIGN_KEY_SERIALIZERS}}', self.__foreign_key_serializers)
        self.__serializer_script = self.__serializer_script.replace('{{FOREIGN_KEY_IMPORTS}}', '\n'.join(self.__foreign_key_imports))


    def __build_foreign_key_serializers(self, foreign_key_model_fields):
        """Build the foreign key serializers for the model serializer script.

        Args:
            foreign_key_model_fields (QuerySet): The model fields
        """
        foreign_key_field_template = get_template_file_content(SERIALIZERS_TEMPLATE_URLS['foreign_key_field'])

        for model_field in foreign_key_model_fields:
            model_field_name = model_field.name
            model_field_data_type = model_field.data_type.name.lower()
            model_field_relation = model_field.model_field_relation
            model_field_relation_data_type = model_field_relation.data_type.name.lower()
            model_field_relation_app_model_name = model_field_relation.app_model.name
            model_field_relation_project_app_name = model_field_relation.app_model.project_app.name.lower()
            model_field_relation_name = model_field_relation.name

            if not model_field_relation:
                raise ValueError(f'El campo {model_field.name} del modelo {self.__app_model.name} no debe ser nulo.')

            if model_field_relation_data_type in ['onetomanyforeignkey', 'manytomanyforeignkey']:
                raise ValueError(f'El campo {model_field_relation_name} del modelo {model_field_relation_app_model_name} de la app' +
                                 f'{model_field_relation_project_app_name} no debe ser llave foránea.')

            self.__build_model_field_serializer(model_field_relation_app_model_name, model_field_relation_name)
            self.__foreign_key_imports.add(f'from {model_field_relation_project_app_name}.models import {model_field_relation_app_model_name}')

            foreign_key_model_field = foreign_key_field_template.replace('{{FIELD_NAME}}', model_field_name)
            foreign_key_model_field = foreign_key_model_field.replace('{{MODEL_NAME}}', model_field_relation_app_model_name)
            foreign_key_model_field = foreign_key_model_field.replace('{{MODEL_FIELD_RELATION_NAME}}', model_field_relation_name.title())
            foreign_key_model_field = foreign_key_model_field.replace('{{MANY_VALUE}}', 'True' if  model_field_data_type == 'manytomanyforeignkey' else 'False')
            self.__foreign_key_fields.add(foreign_key_model_field)


        self.__build_foreign_key_serializer()


    def __build_model_field_serializer(self, model_name, model_field_name):
        """Build the model field serializer for the model serializer script.

        Args:
            model_name (str): The model name
            model_field_name (str): The model field name
        """
        model_field_serializer = get_template_file_content(SERIALIZERS_TEMPLATE_URLS['model_field_serializer'])
        model_field_serializer = model_field_serializer.replace('{{MODEL_NAME}}', model_name)
        model_field_serializer = model_field_serializer.replace('{{MODEL_FIELD_NAME}}', model_field_name.title())
        model_field_serializer = model_field_serializer.replace('{{SERIALIZER_MODEL_FIELD}}', model_field_name)

        self.__foreign_key_serializers += model_field_serializer + '\n'


    def __build_foreign_key_serializer(self):
        foreign_key_serializer = get_template_file_content(SERIALIZERS_TEMPLATE_URLS['foreign_key_serializer'])
        foreign_key_serializer = foreign_key_serializer.replace('{{MODEL_NAME}}', self.__app_model.name)
        foreign_key_serializer = foreign_key_serializer.replace('{{FOREIGN_KEY_FIELDS}}', '    '.join(self.__foreign_key_fields))

        model_fields = ModelField.objects.filter(app_model=self.__app_model)

        serializer_fields = ''

        for model_field in model_fields:
            serializer_fields += f'\'{model_field.name}\', '

        foreign_key_serializer = foreign_key_serializer.replace('{{MODEL_FIELDS}}', serializer_fields)

        self.__foreign_key_serializers += foreign_key_serializer + '    '
