#!/bin/bash

# Wait for the database to be ready
python manage.py wait_for_db

# Make the migrations and migrate
python manage.py makemigrations
python manage.py migrate

# Load the fixtures
python manage.py loaddata ./fixtures/user.json
python manage.py loaddata ./fixtures/validator.json
python manage.py loaddata ./fixtures/dataType.json
python manage.py loaddata ./fixtures/customer.json
python manage.py loaddata ./fixtures/project.json
python manage.py loaddata ./fixtures/projectApp.json
python manage.py loaddata ./fixtures/projectModel.json
python manage.py loaddata ./fixtures/modelField.json
python manage.py loaddata ./fixtures/validatorValue.json
