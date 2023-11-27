from project.utils import get_template_file_content
from ..HELPER_DICTIONARIES import (
    SCRIPT_TEMPLATE_URLS,
    INPUT_FIELD_TEMPLATES,
    READ_ONLY_INPUT_FIELD_TEMPLATES,
    DEFAULT_DATA_TYPE_VALUES,
)
from core.models import (
    ModelField,
    ValidatorValue,
    ForeignKeyRelation
)

class ViewBuilder:

    def __init__(self, app_model):
        self.__app_model = app_model
        self.__model_name = self.__app_model.name
        self.__app_name = self.__app_model.project_app.name
        self.__model_fields = ModelField.objects.filter(app_model=self.__app_model).order_by('order')
        self.__first_field = ModelField.objects.filter(app_model=app_model).exclude(data_type__name__contains="Many").order_by('order').first()
        self.__list_view_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_list_view'])
        self.__create_view_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_create_view'])
        self.__update_view_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_update_view'])
        self.__retrieve_view_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_retrieve_view'])


    def build_list_view(self):
        self.__list_view_script = self.__list_view_script.replace('{{MODEL_NAME}}', self.__model_name)
        self.__list_view_script = self.__list_view_script.replace('{{MODEL_NAME_LOWER}}', self.__model_name.lower())
        self.__list_view_script = self.__list_view_script.replace('{{APP_NAME}}', self.__app_name)

        table_column = ''

        if self.__first_field:
            if 'ForeignKey' not in self.__first_field.data_type.name:
                table_column = '{ heading: {{FIRST_VALUE_CAPITALIZE}}, value: {{FIRST_VALUE}}, main: true},'
                table_column = table_column.replace('{{FIRST_VALUE}}', f'"{self.__first_field.name}"')
                table_column = table_column.replace('{{FIRST_VALUE_CAPITALIZE}}', f'"{self.__first_field.name.title()}"')
            else:
                relation = ForeignKeyRelation.objects.get(model_field_origin=self.__first_field)
                related_model_field = relation.model_field_related
                related_model_field_name = related_model_field.name
                table_column = '{ heading: {{FIRST_VALUE_CAPITALIZE}}, value: {{FIRST_VALUE}}, main: true},'
                table_column = table_column.replace('{{FIRST_VALUE}}', f'"{self.__first_field.name}.{related_model_field_name}"')
                table_column = table_column.replace('{{FIRST_VALUE_CAPITALIZE}}', f'"{self.__first_field.name.title()}"')

        self.__list_view_script = self.__list_view_script.replace('{{FIRST_COLUMN}}', table_column)

        return self.__list_view_script


    def build_create_view(self):
        self.__create_view_script = self.__create_view_script.replace('{{MODEL_NAME}}', self.__model_name)
        self.__create_view_script = self.__create_view_script.replace('{{MODEL_NAME_LOWER}}', self.__model_name.lower())
        self.__create_view_script = self.__create_view_script.replace('{{MODEL_NAME_TITLE}}', self.__model_name.title())
        self.__create_view_script = self.__create_view_script.replace('{{APP_NAME}}', self.__app_name)
        self.__create_view_script= self.__create_view_script.replace('{{REQUEST_FIELDS}}', self.__build_request_body())
        self.__create_view_script = self.__create_view_script.replace('{{MODEL_HOOKS}}', self.__build_field_hooks())
        self.__create_view_script = self.__create_view_script.replace('{{INPUT_FIELDS}}', self.__build_input_fields())
        self.__create_view_script = self.__create_view_script.replace('{{NOT_NULL_VALIDATIONS}}', self.__build_not_null_field_validations())
        self.__create_view_script = self.__create_view_script.replace('{{FOREIGN_KEY_HOOKS}}', self.__build_foreign_key_hooks())
        self.__create_view_script = self.__create_view_script.replace('{{FOREIGN_KEY_GET_DATA_FUNCTIONS}}', self.__build_foreign_key_get_functions())
        self.__create_view_script = self.__create_view_script.replace('{{FOREIGN_KEY_USE_EFFECTS}}', self.__build_foreign_key_use_effects())
        self.__create_view_script = self.__create_view_script.replace('{{FOREIGN_KEY_FLAGS}}', self.__build_foreign_key_flags())
        self.__create_view_script = self.__create_view_script.replace('{{FOREIGN_KEY_SELECTED_ITEMS}}', self.__build_foreign_key_selected_item_hooks())

        return self.__create_view_script


    def build_update_view(self):
        self.__update_view_script = self.__update_view_script.replace('{{MODEL_NAME}}', self.__model_name)
        self.__update_view_script = self.__update_view_script.replace('{{MODEL_NAME_LOWER}}', self.__model_name.lower())
        self.__update_view_script = self.__update_view_script.replace('{{MODEL_NAME_TITLE}}', self.__model_name.title())
        self.__update_view_script = self.__update_view_script.replace('{{APP_NAME}}', self.__app_name)
        self.__update_view_script= self.__update_view_script.replace('{{REQUEST_FIELDS}}', self.__build_request_body())
        self.__update_view_script = self.__update_view_script.replace('{{MODEL_HOOKS}}', self.__build_field_hooks())
        self.__update_view_script = self.__update_view_script.replace('{{INPUT_FIELDS}}', self.__build_input_fields())
        self.__update_view_script = self.__update_view_script.replace('{{FIELD_SETTERS}}', self.__build_field_setters())
        self.__update_view_script = self.__update_view_script.replace('{{NOT_NULL_VALIDATIONS}}', self.__build_not_null_field_validations())
        self.__update_view_script = self.__update_view_script.replace('{{FOREIGN_KEY_HOOKS}}', self.__build_foreign_key_hooks())
        self.__update_view_script = self.__update_view_script.replace('{{FOREIGN_KEY_GET_DATA_FUNCTIONS}}', self.__build_foreign_key_get_functions())
        self.__update_view_script = self.__update_view_script.replace('{{FOREIGN_KEY_USE_EFFECTS}}', self.__build_foreign_key_use_effects())
        self.__update_view_script = self.__update_view_script.replace('{{FOREIGN_KEY_FLAGS}}', self.__build_foreign_key_flags())
        self.__update_view_script = self.__update_view_script.replace('{{FOREIGN_KEY_SELECTED_ITEMS}}', self.__build_foreign_key_selected_item_hooks())

        return self.__update_view_script


    def build_retrieve_view(self):
        self.__retrieve_view_script = self.__retrieve_view_script.replace('{{MODEL_NAME}}', self.__model_name)
        self.__retrieve_view_script = self.__retrieve_view_script.replace('{{MODEL_NAME_LOWER}}', self.__model_name.lower())
        self.__retrieve_view_script = self.__retrieve_view_script.replace('{{MODEL_NAME_TITLE}}', self.__model_name.title())
        self.__retrieve_view_script = self.__retrieve_view_script.replace('{{APP_NAME}}', self.__app_name)
        self.__retrieve_view_script = self.__retrieve_view_script.replace('{{MODEL_HOOKS}}', self.__build_retrieve_field_hooks())
        self.__retrieve_view_script = self.__retrieve_view_script.replace('{{INPUT_FIELDS}}', self.__build_read_only_fields())
        self.__retrieve_view_script = self.__retrieve_view_script.replace('{{FIELD_SETTERS}}', self.__build_retrieve_field_setters())
        self.__retrieve_view_script = self.__retrieve_view_script.replace('{{TABLES_COLUMNS}}', self._build_foreign_key_table_columns())

        return self.__retrieve_view_script

    def __build_retrieve_field_setters(self):
        field_setters = ''

        for model_field in self.__model_fields:
            if 'ForeignKey' in model_field.data_type.name:
                relation = ForeignKeyRelation.objects.get(model_field_origin=model_field)
                related_model_field = relation.model_field_related
                related_model_field_name = related_model_field.name
                field_setter = f'\t\t\t\t\tset{model_field.name.title()}'
                field_setter += f'(res.{model_field.name}.{related_model_field_name});\n' if 'ManytoManyForeignKey' not in model_field.data_type.name else f'(res.{model_field.name});\n'

            else:
                field_setter = f'\t\t\t\t\tset{model_field.name.title()}(res.{model_field.name});\n'
            field_setters += field_setter

        return field_setters


    def __build_field_setters(self):
        field_setters = ''

        for model_field in self.__model_fields:
            if 'ForeignKey' in model_field.data_type.name:
                relation = ForeignKeyRelation.objects.get(model_field_origin=model_field)
                related_model_field = relation.model_field_related
                related_model_name = related_model_field.app_model.name
                related_model_field_name = related_model_field.name
                field_setter = f'\t\t\t\t\tset{model_field.name.title()}{related_model_name.title()}{related_model_field_name.title()}'
                field_setter += f'(res.{model_field.name}.id);\n' if 'ManytoManyForeignKey' not in model_field.data_type.name else f'(res.{model_field.name});\n'
                if 'ManytoManyForeignKey' in model_field.data_type.name:
                    field_setter += f'\t\t\t\t\tset{model_field.name.title()}{related_model_name.title()}{related_model_field_name.title()}SelectedItems(res.{model_field.name});\n'
            else:
                field_setter = f'\t\t\t\t\tset{model_field.name.title()}(res.{model_field.name});\n'
            field_setters += field_setter

        return field_setters


    def __build_request_body(self):
        request_body = ''

        for model_field in self.__model_fields:
            if 'ForeignKey' in model_field.data_type.name:
                relation = ForeignKeyRelation.objects.get(model_field_origin=model_field)
                related_model_field = relation.model_field_related
                related_model_name = related_model_field.app_model.name
                related_model_field_name = related_model_field.name
                request_field = f'\t\t\t{model_field.name}: {model_field.name.lower() + related_model_name.title() + related_model_field_name.title()}, \n'
            else:
                request_field = f'\t\t\t{model_field.name}: {model_field.name}, \n'
            request_body += request_field

        return request_body


    def __build_field_hooks(self):
        model_hooks = set()
        for model_field in self.__model_fields:
            use_state_template = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_use_state_hook'])
            if 'ForeignKey' in model_field.data_type.name:
                relation = ForeignKeyRelation.objects.get(model_field_origin=model_field)
                related_model_field = relation.model_field_related
                related_model_name = related_model_field.app_model.name
                related_model_field_name = related_model_field.name
                use_state_template = use_state_template.replace('{{MODEL_FIELD_NAME_LOWER}}', model_field.name.lower() + related_model_name.title() + related_model_field_name.title())
                use_state_template = use_state_template.replace('{{MODEL_FIELD_NAME_TITLE}}', model_field.name.title() + related_model_name.title() + related_model_field_name.title())

            use_state_template = use_state_template.replace('{{MODEL_FIELD_NAME_LOWER}}', model_field.name.lower())
            use_state_template = use_state_template.replace('{{MODEL_FIELD_NAME_TITLE}}', model_field.name.title())
            use_state_template = use_state_template.replace('{{DEFAULT_VALUE}}', DEFAULT_DATA_TYPE_VALUES[model_field.data_type.name])
            model_hooks.add(f'\t{use_state_template}')

        return '\n'.join(model_hooks)


    def __build_retrieve_field_hooks(self):
        model_hooks = set()
        for model_field in self.__model_fields:
            use_state_template = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_use_state_hook'])
            use_state_template = use_state_template.replace('{{MODEL_FIELD_NAME_LOWER}}', model_field.name.lower())
            use_state_template = use_state_template.replace('{{MODEL_FIELD_NAME_TITLE}}', model_field.name.title())
            use_state_template = use_state_template.replace('{{DEFAULT_VALUE}}', DEFAULT_DATA_TYPE_VALUES[model_field.data_type.name])
            model_hooks.add(f'\t{use_state_template}')

        return '\n'.join(model_hooks)


    def __build_input_fields(self):
        input_fields = ''

        for model_field in self.__model_fields:
            data_type = model_field.data_type.name
            is_required = 'false'

            input_field_template = get_template_file_content(INPUT_FIELD_TEMPLATES[data_type])

            if ValidatorValue.objects.filter(model_field=model_field, validator__name='null').exists():
                required_validator = ValidatorValue.objects.get(model_field=model_field, validator__name='null')
                is_required = 'true' if required_validator.value.lower() == 'false' else 'false'

            input_field_template = input_field_template.replace('{{MODEL_FIELD_NAME}}', model_field.name)
            input_field_template = input_field_template.replace('{{MODEL_FIELD_NAME_TITLE}}', model_field.name.title())
            input_field_template = input_field_template.replace('{{MODEL_FIELD_NAME_LOWER}}', model_field.name.lower())
            input_field_template = input_field_template.replace('{{REQUIRED}}', is_required)
            input_field_template = input_field_template.replace('{{MODEL_FIELD_CAPTION}}', model_field.caption)

            if 'ForeignKey' in data_type:
                relation = ForeignKeyRelation.objects.get(model_field_origin=model_field)

                related_model_field = relation.model_field_related

                related_model_name = related_model_field.app_model.name
                related_model_field_name = related_model_field.name

                input_field_template = input_field_template.replace('{{FOREIGN_KEY_MODEL_NAME}}', related_model_name)
                input_field_template = input_field_template.replace('{{FOREIGN_KEY_MODEL_NAME_TITLE}}', related_model_name.title())
                input_field_template = input_field_template.replace('{{FOREIGN_KEY_MODEL_NAME_LOWER}}', related_model_name.lower())
                input_field_template = input_field_template.replace('{{FOREIGN_KEY_MODEL_FIELD_NAME}}', related_model_field_name)
                input_field_template = input_field_template.replace('{{FOREIGN_KEY_MODEL_FIELD_NAME_TITLE}}', related_model_field_name.title())

            input_fields += ('\t' * 10) + input_field_template

        return input_fields

    def __build_not_null_field_validations(self):
        validators = ''
        not_null_fields = ValidatorValue.objects.filter(model_field__app_model=self.__app_model, validator__name='null', value='False')

        for not_null_field in not_null_fields:
            validation_template = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_not_null_validation'])
            validation_template = validation_template.replace('{{MODEL_FIELD_NAME_LOWER}}', not_null_field.model_field.name.lower())
            validation_template = validation_template.replace('{{MODEL_FIELD_NAME_TITLE}}', not_null_field.model_field.name.title())
            validators += ('\t' * 2) + validation_template

        return validators


    def __build_read_only_fields(self):
        read_only_fields = ''

        for model_field in self.__model_fields:
            data_type = model_field.data_type.name

            input_field_template = get_template_file_content(READ_ONLY_INPUT_FIELD_TEMPLATES[data_type])

            input_field_template = input_field_template.replace('{{MODEL_FIELD_NAME}}', model_field.name)
            input_field_template = input_field_template.replace('{{MODEL_FIELD_NAME_TITLE}}', model_field.name.title())
            input_field_template = input_field_template.replace('{{MODEL_FIELD_NAME_LOWER}}', model_field.name.lower())
            read_only_fields += ('\t' * 10) + input_field_template

        return read_only_fields


    def __build_foreign_key_hooks(self):
        foreign_key_hooks = set()
        relation = ForeignKeyRelation.objects.filter(model_field_origin__app_model=self.__app_model)

        for foreign_key_relation in relation:
            use_state_template = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_use_state_hook'])
            related_model_field = foreign_key_relation.model_field_related
            related_model_name = related_model_field.app_model.name
            related_model_field_name = related_model_field.name
            use_state_template = use_state_template.replace('{{MODEL_FIELD_NAME_LOWER}}', related_model_name.lower() + related_model_field_name.title() + 's')
            use_state_template = use_state_template.replace('{{MODEL_FIELD_NAME_TITLE}}', related_model_name.title() + related_model_field_name.title() + 's')
            use_state_template = use_state_template.replace('{{DEFAULT_VALUE}}', '[]')

            foreign_key_hooks.add(f'\t{use_state_template}')

        return '\n'.join(foreign_key_hooks)


    def __build_foreign_key_get_functions(self):
        foreign_key_get_functions = set()
        relation = ForeignKeyRelation.objects.filter(model_field_origin__app_model=self.__app_model)

        for foreign_key_relation in relation:
            foreign_key_function = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_foreign_key_get_data'])
            origin_model_field = foreign_key_relation.model_field_origin
            origin_model_field_name = origin_model_field.name
            related_model_field = foreign_key_relation.model_field_related
            related_model_name = related_model_field.app_model.name
            related_model_field_name = related_model_field.name
            foreign_key_function = foreign_key_function.replace('{{FOREIGN_KEY_MODEL_NAME}}', related_model_name)
            foreign_key_function = foreign_key_function.replace('{{FOREIGN_KEY_MODEL_NAME_TITLE}}', related_model_name.title())
            foreign_key_function = foreign_key_function.replace('{{MODEL_NAME_LOWER}}', self.__app_model.name.lower())
            foreign_key_function = foreign_key_function.replace('{{FOREIGN_KEY_FIELD_NAME}}', related_model_field_name)
            foreign_key_function = foreign_key_function.replace('{{FOREIGN_KEY_FIELD_NAME_TITLE}}', related_model_field_name.title())

            foreign_key_get_functions.add(f'\t{foreign_key_function}')

        return '\n'.join(foreign_key_get_functions)


    def __build_foreign_key_use_effects(self):
        foreign_key_use_effects = set()
        relation = ForeignKeyRelation.objects.filter(model_field_origin__app_model=self.__app_model)

        for foreign_key_relation in relation:
            foreign_key_function = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_foreign_key_use_effect'])
            related_model_field = foreign_key_relation.model_field_related
            related_model_name = related_model_field.app_model.name
            related_model_field_name = related_model_field.name
            foreign_key_function = foreign_key_function.replace('{{FOREIGN_KEY_MODEL_NAME}}', related_model_name)
            foreign_key_function = foreign_key_function.replace('{{FOREIGN_KEY_MODEL_NAME_TITLE}}', related_model_name.title())
            foreign_key_function = foreign_key_function.replace('{{FOREIGN_KEY_MODEL_FIELD_NAME}}', related_model_field_name)
            foreign_key_function = foreign_key_function.replace('{{FOREIGN_KEY_MODEL_FIELD_NAME_TITLE}}', related_model_field_name.title())
            foreign_key_function = foreign_key_function.replace('{{MODEL_FIELD_NAME_LOWER}}', related_model_name.lower() + related_model_field_name.title())

            foreign_key_use_effects.add(f'\t{foreign_key_function}')

        return '\n'.join(foreign_key_use_effects)


    def __build_foreign_key_flags(self):
        foreign_key_flags = set()
        relation = ForeignKeyRelation.objects.filter(model_field_origin__app_model=self.__app_model)

        for foreign_key_relation in relation:
            foreign_key_flag = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_use_state_hook'])
            related_model_field = foreign_key_relation.model_field_related
            related_model_name = related_model_field.app_model.name
            related_model_field_name = related_model_field.name

            foreign_key_flag = foreign_key_flag.replace('{{MODEL_FIELD_NAME_LOWER}}', 'flag' + related_model_name.title() + related_model_field_name.title() + 's')
            foreign_key_flag = foreign_key_flag.replace('{{MODEL_FIELD_NAME_TITLE}}', 'Flag' + related_model_name.title() + related_model_field_name.title() + 's')
            foreign_key_flag = foreign_key_flag.replace('{{DEFAULT_VALUE}}', 'false')

            foreign_key_flags.add(f'\t{foreign_key_flag}')

        return '\n'.join(foreign_key_flags)


    def __build_foreign_key_selected_item_hooks(self):
        many_to_many_fields = ModelField.objects.filter(app_model=self.__app_model, data_type__name='ManytoManyForeignKey')

        foreign_key_selected_item_hooks = set()

        for many_to_many_field in many_to_many_fields:
            foreign_key_selected_item_hook = get_template_file_content(SCRIPT_TEMPLATE_URLS['web_client_use_state_hook'])
            relation_field = ForeignKeyRelation.objects.get(model_field_origin=many_to_many_field)
            related_model_field = relation_field.model_field_related
            related_model_name = related_model_field.app_model.name
            related_model_field_name = related_model_field.name
            foreign_key_selected_item_hook = foreign_key_selected_item_hook.replace('{{MODEL_FIELD_NAME_LOWER}}', f'{many_to_many_field.name.lower()}{related_model_name.title()}{related_model_field_name.title()}SelectedItems')
            foreign_key_selected_item_hook = foreign_key_selected_item_hook.replace('{{MODEL_FIELD_NAME_TITLE}}', f'{many_to_many_field.name.title()}{related_model_name.title()}{related_model_field_name.title()}SelectedItems')
            foreign_key_selected_item_hook = foreign_key_selected_item_hook.replace('{{DEFAULT_VALUE}}', '[]')

            foreign_key_selected_item_hooks.add(f'\t{foreign_key_selected_item_hook}')

        return '\n'.join(foreign_key_selected_item_hooks)


    def _build_foreign_key_table_columns(self):
        many_to_many_relations = ForeignKeyRelation.objects.filter(model_field_origin__app_model=self.__app_model, model_field_origin__data_type__name='ManytoManyForeignKey')
        table_columns_template = get_template_file_content(READ_ONLY_INPUT_FIELD_TEMPLATES['table_columns'])
        table_columns = ''

        for many_to_many_relation in many_to_many_relations:
            related_model_field = many_to_many_relation.model_field_related
            related_model_field_name = related_model_field.name
            origin_model_field = many_to_many_relation.model_field_origin
            origin_model_field_name = origin_model_field.name

            field_columns = table_columns_template.replace('{{MODEL_FIELD_NAME_LOWER}}', origin_model_field_name.lower())
            field_columns = field_columns.replace('{{FOREIGN_KEY_FIELD_NAME}}', related_model_field_name)
            field_columns = field_columns.replace('{{FOREIGN_KEY_FIELD_NAME_TITLE}}', related_model_field_name.title())

            table_columns += '\t' + field_columns

        return table_columns












