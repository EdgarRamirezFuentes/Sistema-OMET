from rest_framework import routers
from dataType import views
from django.urls import path, include

app_name = 'dataType'

router = routers.SimpleRouter()

router.register('', views.DataTypeViewSet, basename='data-type')

urlpatterns = [
    path('', include(router.urls))
]
