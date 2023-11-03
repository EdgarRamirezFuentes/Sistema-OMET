
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
}
