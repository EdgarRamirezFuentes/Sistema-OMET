from core.models import (
    ModelField,
    ValidatorValue
)


from ..HELPER_DICTIONARIES import (
    SCRIPT_TEMPLATE_URLS,
    MODEL_FIELD_TEMPLATE_URLS,
    ATTRIBUTES,
    VALIDATORS,
    VALIDATOR_IMPORTS
)

from project.utils import (
    format_project_name,
    get_template_file_content
)


class ModelBuilder():
    def __init__(self, app_model):
        self.__app_model = app_model
        self.__model_name = format_project_name(app_model.name)
        self.__app_model_script = get_template_file_content(SCRIPT_TEMPLATE_URLS['api_models'])
        self.__validator_imports = set()
        self.__foreign_key_imports = set()
        self.__model_fields = ''


    def get_model_script(self):
        self.__build()
        return self.__app_model_script


    def __build(self):
        self.__build_model_fields()
        self.__app_model_script = self.__app_model_script.replace('{{MODEL_NAME}}', self.__model_name)
        self.__app_model_script = self.__app_model_script.replace('{{MODEL_FIELDS}}', self.__model_fields)
        self.__app_model_script = self.__app_model_script.replace('{{VALIDATOR_IMPORTS}}', '\n'.join(self.__validator_imports))
        self.__app_model_script = self.__app_model_script.replace('{{FOREIGN_KEY_IMPORTS}}', '\n'.join(self.__foreign_key_imports))


    def __build_model_fields(self):
        """Build the model fields for the model script."""
        model_fields = ModelField.objects.filter(app_model=self.__app_model)

        if not model_fields:
            raise ValueError(f'El modelo {self.__app_model.name} debe tener al menos un campo.')

        for model_field in model_fields:
            self.__build_model_field(model_field)


    def __build_model_field(self, model_field):
        """Build the model field for the model script.

        Args:
            model_field (ModelField): The model field
        """
        model_field_name = model_field.name
        model_field_data_type = model_field.data_type.name.lower()
        model_field_body = get_template_file_content(MODEL_FIELD_TEMPLATE_URLS[model_field_data_type])
        model_field_body = model_field_body.replace('{{FIELD_NAME}}', model_field_name) + '    '

        if model_field_data_type in ['onetomanyforeignkey', 'manytomanyforeignkey']:
            self.__add_foreign_key(model_field, model_field_body)
        else:
            self.__add_validators(model_field, model_field_body)


    def __add_foreign_key(self, model_field, model_field_body):
        """Add the foreign key to the model field body.

        Args:
            model_field (ModelField): The model field
            model_field_body (str): The model field body
        """
        # Getting the foreign key model data
        foreign_key_model = model_field.model_field_relation.app_model
        foreign_key_model_app = foreign_key_model.project_app.name
        foreign_key_model_name = foreign_key_model.name
        foreign_key_model_app_name = format_project_name(foreign_key_model_app).lower()

        self.__foreign_key_imports.add(f'from {foreign_key_model_app_name}.models import {foreign_key_model_name}\n')
        model_field_body = model_field_body.replace('{{FOREIGN_KEY_MODEL}}', foreign_key_model_name)

        self.__model_fields += model_field_body


    def __add_validators(self, model_field, model_field_body):
        """Add the validators to the model field body.

        Args:
            model_field (ModelField): The model field
            model_field_body (str): The model field body
        """
        # Getting the validators
        validators = ValidatorValue.objects.filter(model_field=model_field)

        for validator in validators:
            model_field_body = self.__add_validator(validator, model_field_body)

        # Removing the validators and attributes placeholders
        model_field_body = model_field_body.replace('{{VALIDATORS}}, ', '')
        model_field_body = model_field_body.replace('{{ATTRIBUTES}}, ', '')
        model_field_body = model_field_body.replace('validators=[]', '')

        self.__model_fields += model_field_body


    def __add_validator(self, validator, model_field_body):
        """Add the validator to the model field body.

        Args:
            validator (ValidatorValue): The validator
            model_field_body (str): The model field body

        Returns:
            str: The model field body with the validator
        """
        validator_name = validator.validator.name
        validator_value = validator.value

        if validator_name in ATTRIBUTES:
            model_field_body = model_field_body.replace('{{ATTRIBUTES}}, ',
                                                f'{validator_name}={validator_value}, ' + '{{ATTRIBUTES}}, ')
        elif validator_name in VALIDATORS.keys():
            self.__validator_imports.add(VALIDATOR_IMPORTS[validator_name])
            validator_method = VALIDATORS[validator_name]
            validator_method = validator_method.replace('{{VALUE}}', validator_value)
            model_field_body = model_field_body.replace('{{VALIDATORS}}, ', f'{validator_method}, ' + '{{VALIDATORS}}, ')

        return model_field_body
