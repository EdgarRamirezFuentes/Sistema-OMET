#!/bin/bash

# Wait for the database to be ready
python manage.py wait_for_db

# Make the migrations and migrate
python manage.py makemigrations
python manage.py migrate

# Load the fixtures
python manage.py loaddata ./fixtures/user.json
