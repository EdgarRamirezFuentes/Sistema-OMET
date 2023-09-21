import os
from django.conf import settings

SCRIPT_TEMPLATE_URLS = {
    'api_apps': os.path.join(settings.BASE_DIR, 'script_templates/api/apps/app.txt'),
    'api_models': os.path.join(settings.BASE_DIR, 'script_templates/api/models/model.txt'),
    'api_serializers': os.path.join(settings.BASE_DIR, 'script_templates/api/serializers/serializer.txt'),
    'api_views': os.path.join(settings.BASE_DIR, 'script_templates/api/views/views.txt'),
    'api_urls': os.path.join(settings.BASE_DIR, 'script_templates/api/urls/urls.txt'),
    'api_global_urls': os.path.join(settings.BASE_DIR, 'script_templates/api/urls/global_urls.txt'),
    'api_settings': os.path.join(settings.BASE_DIR, 'script_templates/api/settings/settings.txt'),
    'dockerfile': os.path.join(settings.BASE_DIR, 'script_templates/docker/Dockerfile'),
    'docker_compose': os.path.join(settings.BASE_DIR, 'script_templates/docker/docker-compose.yml'),
    'env_file_api': os.path.join(settings.BASE_DIR, 'script_templates/env_files/api.env'),
    'env_file_postgresql': os.path.join(settings.BASE_DIR, 'script_templates/env_files/postgresql.env'),
    'env_file_rabbitmq': os.path.join(settings.BASE_DIR, 'script_templates/env_files/rabbitmq.env'),
}

EXPORTED_PROJECT_TEMPLATE_URLS = {
    'api': os.path.join(settings.BASE_DIR, 'exported_project_template/api'),
    'env_files_api': os.path.join(settings.BASE_DIR, 'exported_project_template/env_files/api'),
    'env_files_postgresql': os.path.join(settings.BASE_DIR, 'exported_project_template/env_files/postgresql'),
    'env_files_rabbitmq': os.path.join(settings.BASE_DIR, 'exported_project_template/env_files/rabbitmq'),
}

SERIALIZERS_TEMPLATE_URLS = {
    'model_serializer': os.path.join(settings.BASE_DIR, 'script_templates/api/serializers/model_serializer.txt'),
    'model_field_serializer': os.path.join(settings.BASE_DIR, 'script_templates/api/serializers/model_field_serializer.txt'),
    'foreign_key_serializer': os.path.join(settings.BASE_DIR, 'script_templates/api/serializers/foreign_key_serializer.txt'),
    'foreign_key_field': os.path.join(settings.BASE_DIR, 'script_templates/api/serializers/foreign_key_field.txt'),
}

VIEWS_TEMPLATE_URLS = {
    'view': os.path.join(settings.BASE_DIR, 'script_templates/api/views/view.txt'),
    'foreign_key_view': os.path.join(settings.BASE_DIR, 'script_templates/api/views/foreign_key_view.txt'),
}

MODEL_FIELD_TEMPLATE_URLS = {
    'integerfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/IntegerField.txt'),
    'floatfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/FloatField.txt'),
    'charfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/CharField.txt'),
    'textfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/TextField.txt'),
    'booleanfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/BooleanField.txt'),
    'datefield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/DateField.txt'),
    'datetimefield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/DateTimeField.txt'),
    'timefield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/TimeField.txt'),
    'decimalfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/DecimalField.txt'),
    'positiveintegerfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/PositiveIntegerField.txt'),
    'positivebigintegerfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/PositiveBigIntegerField.txt'),
    'bigintegerfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/BigIntegerField.txt'),
    'urlfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/URLField.txt'),
    'emailfield': os.path.join(settings.BASE_DIR, 'script_templates/api/models/EmailField.txt'),
    'onetooneforeignkey': os.path.join(settings.BASE_DIR, 'script_templates/api/models/OneToOneForeignKey.txt'),
    'onetomanyforeignkey': os.path.join(settings.BASE_DIR, 'script_templates/api/models/OneToManyForeignKey.txt'),
    'manytomanyforeignkey': os.path.join(settings.BASE_DIR, 'script_templates/api/models/ManyToManyForeignKey.txt'),
}

VALIDATOR_IMPORTS = {
    'min_value': 'from django.core.validators import MinValueValidator',
    'max_value': 'from django.core.validators import MaxValueValidator',
    'min_length': 'from django.core.validators import MinLengthValidator',
    'regex': 'from django.core.validators import RegexValidator',
}

ATTRIBUTES = ['max_digits', 'decimal_places', 'null',
                'required', 'db_index', 'unique',
                'auto_now_add', 'auto_now', 'max_length']

VALIDATORS = {
    'min_value': 'MinValueValidator({{VALUE}})',
    'max_value': 'MaxValueValidator({{VALUE}})',
    'min_length': 'MinLengthValidator({{VALUE}})',
    'regex': 'RegexValidator({{VALUE}})',
}
