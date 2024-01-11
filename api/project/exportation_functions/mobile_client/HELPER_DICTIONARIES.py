
import os
from django.conf import settings



"""MOBILE CLIENT"""
SCRIPT_TEMPLATE_URLS = {
    #Drawer
    'mobile_client_drawer': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/drawer.txt'),
    'mobile_client_drawer_stack_element': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/drawer_stack_element.txt'),
    'mobile_client_drawer_stack_import': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/drawer_stack_import.txt'),

    'mobile_client_drawer_custom_content': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/custom_drawer_content.txt'),
    'mobile_client_drawer_custom_content_element': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/custom_drawer_element.txt'),
    #stack
    'mobile_client_stack': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/stack/stack.txt'),
    'mobile_client_stack_element': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/stack/stack_element.txt'),
    'mobile_client_stack_import': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/stack/stack_element_import.txt'),
    'mobile_client_stack_button': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/stack/stack_button.txt'),
    #stack_model
    'mobile_client_stack_model': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/stack/stack_model/stack_model.txt'),
    'mobile_client_stack_model_create_view': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/stack/stack_model/stack_model_create_view.txt'),
    'mobile_client_stack_model_update_view': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/stack/stack_model/stack_model_update_view.txt'),
    'mobile_client_stack_model_retrieve_view': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/stack/stack_model/stack_model_retrieve_view.txt'),
    'mobile_client_stack_model_list_view': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/stack/stack_model/stack_model_list_view.txt'),
    'mobile_client_stack_model_import': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/drawer/stack/stack_model/stack_model_import.txt'),
    #hooks
    'mobile_client_use_state_hook': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/hooks/useState.txt'),
    'mobile_client_foreign_key_use_effect': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/hooks/foreignKeyUseEffect.txt'),

    'mobile_client_create_view': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/create_view/create_view.txt'),
    'mobile_client_update_view': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/update_view/update_view.txt'),
    'mobile_client_retrieve_view': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/retrieve_view/retrieve_view.txt'),
    'mobile_client_list_view': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/list_view/list_view.txt'),

    'mobile_client_not_null_validation': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/validations/notEmpty.txt'),

    'mobile_client_foreign_key_get_data': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/requests/getforeignKeyData.txt'),
    'mobile_client_foreign_key_many_get_data': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/requests/manyGetForeignKeyData.txt'),
    'mobile_client_foreign_key_use_effect': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/hooks/foreignKeyUseEffect.txt'),

    #Login
    'mobile_client_login': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/login/login.txt'),
}

INPUT_FIELD_TEMPLATES = {
    'CharField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/CharField.txt'),
    'TextField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/TextField.txt'),
    'EmailField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/EmailField.txt'),
    'URLField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/URLField.txt'),
    'IntegerField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/NumberField.txt'),
    'BigIntegerField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/NumberField.txt'),
    'PositiveIntegerField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/NumberField.txt'),
    'PositiveBigIntegerField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/NumberField.txt'),
    'FloatField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/NumberField.txt'),
    'DecimalField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/NumberField.txt'),
    'DateField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/DateField.txt'),
    'DateTimeField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/DateTimeField.txt'),
    'TimeField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/TimeField.txt'),
    'BooleanField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/BooleanField.txt'),
    'OnetoOneForeignKey': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/OneToOneField.txt'),
    'OnetoManyForeignKey': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/OneToManyField.txt'),
    'ManytoManyForeignKey': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/ManyToManyField.txt'),
}

READ_ONLY_INPUT_FIELD_TEMPLATES = {
    'CharField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/CharField.txt'),
    'TextField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/TextField.txt'),
    'EmailField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/EmailField.txt'),
    'URLField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/URLField.txt'),
    'IntegerField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/NumberField.txt'),
    'BigIntegerField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/NumberField.txt'),
    'PositiveIntegerField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/NumberField.txt'),
    'PositiveBigIntegerField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/NumberField.txt'),
    'FloatField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/NumberField.txt'),
    'DecimalField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/NumberField.txt'),
    'DateField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/DateField.txt'),
    'DateTimeField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/DateTimeField.txt'),
    'TimeField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/TimeField.txt'),
    'BooleanField': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/BooleanField.txt'),
    'OnetoOneForeignKey': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/OneToOneField.txt'),
    'OnetoManyForeignKey': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/OneToManyField.txt'),
    'ManytoManyForeignKey': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/ManyToManyField.txt'),
    'table_columns': os.path.join(settings.BASE_DIR, 'script_templates/mobile_client/input_fields/read_only/tableColumns.txt'),
}

DEFAULT_DATA_TYPE_VALUES = {
    'CharField': '""',
    'TextField': '""',
    'EmailField': '""',
    'URLField': '""',
    'IntegerField': '0',
    'BigIntegerField': '0',
    'PositiveIntegerField': '0',
    'PositiveBigIntegerField': '0',
    'FloatField': '0.0',
    'DecimalField': '0.0',
    'DateField': '""',
    'DateTimeField': '""',
    'TimeField': '""',
    'BooleanField': 'false',
    'OnetoOneForeignKey': 'null',
    'OnetoManyForeignKey': 'null',
    'ManytoManyForeignKey': '[]',
}