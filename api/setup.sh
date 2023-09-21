# superuser information
ADMIN_NAME="admin"
ADMIN_LASTNAME="istrador"
ADMIN_EMAIL="admin@admin.com"
ADMIN_PASSWORD="Vw4XtWh4h"

# Verify if the database is ready
while ! nc -z postgresql 5432; do
  sleep 0.1
done

# Apply database migrations
python manage.py makemigrations
python manage.py migrate

# Populate database
python manage.py loaddata ./fixtures/validator.json
python manage.py loaddata ./fixtures/dataType.json

# Create superuser
echo "from django.contrib.auth import get_user_model; get_user_model().objects.create_superuser(name='$ADMIN_NAME', email='$ADMIN_EMAIL', password='$ADMIN_PASSWORD', rfc='adminrfc')" | python manage.py shell
