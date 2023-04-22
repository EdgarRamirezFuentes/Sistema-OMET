from django.urls import path, include
from customer import views
from rest_framework import routers

app_name = 'customer'

router = routers.SimpleRouter()

router.register(r'', views.CustomerViewSet, basename='customer')


urlpatterns = [
    path('', include(router.urls)),
]
