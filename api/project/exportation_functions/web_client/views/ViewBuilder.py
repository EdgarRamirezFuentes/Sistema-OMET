from project.utils import get_template_file_content
from ..HELPER_DICTIONARIES import (
    SCRIPT_TEMPLATE_URLS,
    INPUT_FIELD_TEMPLATES,
    DEFAULT_DATA_TYPE_VALUES,
)
from core.models import (
    ModelField,
    ValidatorValue,
)

class ViewBuilder:

    def __init__(self, app_model):
        self.__app_model = app_model
        self.__model_name = self.__app_model.name
        self.__app_name = self.__app_model.project_app.name
        self.__model_fields = ModelField.objects.filter(app_model=self.__app_model).order_by('order')
        self.__first_field = ModelField.objects.filter(app_model=app_model).order_by('order').first()
        self.__list_view_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_list_view'])
        self.__create_view_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_create_view'])
        self.__update_view_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_update_view'])


    def build_list_view(self):
        self.__list_view_script = self.__list_view_script.replace('{{MODEL_NAME}}', self.__model_name)
        self.__update_view_script = self.__update_view_script.replace('{{MODEL_NAME_LOWER}}', self.__model_name.lower())
        self.__list_view_script = self.__list_view_script.replace('{{APP_NAME}}', self.__app_name)
        self.__list_view_script = self.__list_view_script.replace('{{FIRST_VALUE_CAPITALIZE}}', f'"{self.__first_field.name.title()}"')
        self.__list_view_script = self.__list_view_script.replace('{{FIRST_VALUE}}', f'"{self.__first_field.name}"')

        return self.__list_view_script


    def build_create_view(self):
        self.__create_view_script = self.__create_view_script.replace('{{MODEL_NAME}}', self.__model_name)
        self.__create_view_script = self.__create_view_script.replace('{{APP_NAME}}', self.__app_name)
        self.__create_view_script= self.__create_view_script.replace('{{REQUEST_FIELDS}}', self.__build_request_body())
        self.__create_view_script = self.__create_view_script.replace('{{MODEL_HOOKS}}', self.__build_field_hooks())
        self.__create_view_script = self.__create_view_script.replace('{{INPUT_FIELDS}}', self.__build_input_fields())
        return self.__create_view_script


    def build_update_view(self):
        self.__update_view_script = self.__update_view_script.replace('{{MODEL_NAME}}', self.__model_name)
        self.__update_view_script = self.__update_view_script.replace('{{MODEL_NAME_LOWER}}', self.__model_name.lower())
        self.__update_view_script = self.__update_view_script.replace('{{APP_NAME}}', self.__app_name)
        self.__update_view_script= self.__update_view_script.replace('{{REQUEST_FIELDS}}', self.__build_request_body())
        self.__update_view_script = self.__update_view_script.replace('{{MODEL_HOOKS}}', self.__build_field_hooks())
        self.__update_view_script = self.__update_view_script.replace('{{INPUT_FIELDS}}', self.__build_input_fields())
        return self.__update_view_script


    def __build_request_body(self):
        request_body = ''

        for model_field in self.__model_fields:
            request_field = f'\t\t\t{model_field.name}: {model_field.name}, \n'
            request_body += request_field

        return request_body


    def __build_field_hooks(self):
        model_hooks = ''
        for model_field in self.__model_fields:
            use_state_template = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_use_state_hook'])
            use_state_template = use_state_template.replace('{{MODEL_FIELD_NAME}}', model_field.name)
            use_state_template = use_state_template.replace('{{MODEL_FIELD_NAME_TITLE}}', model_field.name.title())
            if not 'ForeignKey' in model_field.data_type.name and not 'TextField' in model_field.data_type.name:
                use_state_template = use_state_template.replace('{{DEFAULT_VALUE}}', DEFAULT_DATA_TYPE_VALUES[model_field.data_type.name])
            else:
                use_state_template = use_state_template.replace('{{DEFAULT_VALUE}}', '""')
            model_hooks +=  f'\t{use_state_template}'

        return model_hooks


    def __build_input_fields(self):
        input_fields = ''

        for model_field in self.__model_fields:
            data_type = model_field.data_type.name
            is_required = 'false'

            if 'ForeignKey' in data_type or 'TextField' in data_type:
                continue

            input_field_template = get_template_file_content(INPUT_FIELD_TEMPLATES[data_type])

            if ValidatorValue.objects.filter(model_field=model_field, validator__name='null').exists():
                required_validator = ValidatorValue.objects.get(model_field=model_field, validator__name='null')
                is_required = 'true' if required_validator.value == 'false' else 'false'


            input_field_template = input_field_template.replace('{{MODEL_FIELD_NAME}}', model_field.name)
            input_field_template = input_field_template.replace('{{MODEL_FIELD_NAME_TITLE}}', model_field.name.title())
            input_field_template = input_field_template.replace('{{REQUIRED}}', is_required)
            input_field_template = input_field_template.replace('{{MODEL_FIELD_CAPTION}}', model_field.caption)

            input_fields += ('\t' * 10) + input_field_template

        return input_fields








