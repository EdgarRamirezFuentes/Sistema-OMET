
import os
from django.conf import settings

SCRIPT_TEMPLATE_URLS = {
    'web_client_sidebar': os.path.join(settings.BASE_DIR, 'script_templates/web_client/sidebar/sidebar.txt'),
    'web_client_sidebar_app_item': os.path.join(settings.BASE_DIR, 'script_templates/web_client/sidebar/sidebarAppItem.txt'),
    'web_client_sidebar_model_item': os.path.join(settings.BASE_DIR, 'script_templates/web_client/sidebar/sidebarModelItem.txt'),
    'web_client_login': os.path.join(settings.BASE_DIR, 'script_templates/web_client/login/login.txt'),
    'web_client_index': os.path.join(settings.BASE_DIR, 'script_templates/web_client/index/index.txt'),
    'web_client_controller': os.path.join(settings.BASE_DIR, 'script_templates/web_client/controllers/controller.txt'),
    'web_client_actions': os.path.join(settings.BASE_DIR, 'script_templates/web_client/actions/actions.txt'),
    'web_client_list_view': os.path.join(settings.BASE_DIR, 'script_templates/web_client/list_view/list_view.txt'),
    'web_client_router': os.path.join(settings.BASE_DIR, 'script_templates/web_client/router/router.txt'),
    'web_client_list_view_route': os.path.join(settings.BASE_DIR, 'script_templates/web_client/router/list_views/listViewRoute.txt'),
    'web_client_list_view_import': os.path.join(settings.BASE_DIR, 'script_templates/web_client/router/list_views/listViewImport.txt'),
    'web_client_create_view': os.path.join(settings.BASE_DIR, 'script_templates/web_client/create_view/createView.txt'),
    'web_client_update_view': os.path.join(settings.BASE_DIR, 'script_templates/web_client/update_view/updateView.txt'),
    'web_client_use_state_hook': os.path.join(settings.BASE_DIR, 'script_templates/web_client/hooks/useState.txt'),
}


INPUT_FIELD_TEMPLATES = {
    'CharField': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/CharField.txt'),
    'EmailField': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/EmailField.txt'),
    'URLField': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/URLField.txt'),
    'IntegerField': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/NumberField.txt'),
    'BigIntegerField': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/NumberField.txt'),
    'PositiveIntegerField': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/NumberField.txt'),
    'PositiveBigIntegerField': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/NumberField.txt'),
    'FloatField': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/NumberField.txt'),
    'DecimalField': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/NumberField.txt'),
    'DateField': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/DateField.txt'),
    'DateTimeField': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/DateTimeField.txt'),
    'TimeField': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/TimeField.txt'),
    'BooleanField': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/BooleanField.txt'),
    'OnetoOneForeignKey': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/OneToOneField.txt'),
    'OnetoManyForeignKey': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/ForeignKey.txt'),
    'ManytoManyForeignKey': os.path.join(settings.BASE_DIR, 'script_templates/web_client/input_fields/ManyToManyField.txt'),
}

DEFAULT_DATA_TYPE_VALUES = {
    'CharField': '""',
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
}
