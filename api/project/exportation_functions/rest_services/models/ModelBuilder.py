from core.models import (
    ModelField,
    ValidatorValue,
    ForeignKeyRelation
)


from ..HELPER_DICTIONARIES import (
    SCRIPT_TEMPLATE_URLS,
    MODEL_FIELD_TEMPLATE_URLS,
    ATTRIBUTES,
    VALIDATORS,
    VALIDATOR_IMPORTS
)

from project.utils import get_template_file_content


class ModelBuilder():
    def __init__(self, app_model):
        self.__app_model = app_model
        self.__model_name = app_model.name
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

        if model_field_data_type in ['onetooneforeignkey', 'onetomanyforeignkey', 'manytomanyforeignkey']:
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
        try:
            foreign_key_relation = ForeignKeyRelation.objects.get(model_field_origin=model_field)
        except ForeignKeyRelation.DoesNotExist:
            raise ValueError(f'El campo {model_field.name} debe tener una relación con otro modelo.')

        related_model_field = foreign_key_relation.model_field_related
        related_model = related_model_field.app_model
        related_model_name = related_model.name
        related_model_app_name = related_model.project_app.name.lower()

        self.__foreign_key_imports.add(f'from {related_model_app_name}.models import {related_model_name}\n')
        model_field_body = model_field_body.replace('{{FOREIGN_KEY_MODEL}}', related_model_name)

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
        print(model_field_body)
        model_field_body = model_field_body.replace('{{VALIDATORS}}, ', '')
        print(model_field_body)
        model_field_body = model_field_body.replace('{{ATTRIBUTES}}, ', '')
        print(model_field_body)
        model_field_body = model_field_body.replace('validators=[]', '')
        print(model_field_body)

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
