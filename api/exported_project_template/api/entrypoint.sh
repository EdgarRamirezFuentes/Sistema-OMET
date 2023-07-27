#!/bin/bash

# Run the server
celery -A api beat -l INFO --scheduler django_celery_beat.schedulers:DatabaseScheduler --detach
celery -A api worker -l INFO -c 1 -n apiWorker@%h --detach
python manage.py wait_for_db
python manage.py makemigrations
python manage.py runserver 0.0.0.0:8000
