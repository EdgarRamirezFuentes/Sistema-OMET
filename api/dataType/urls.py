from rest_framework import routers
from dataType import views
from django.urls import path, include

app_name = 'dataType'

router = routers.SimpleRouter()

router.register('config-fields', views.ConfigFieldsViewSet, basename='config-fields')
router.register('', views.DataTypeViewSet, basename='data-type')


urlpatterns = [
    path('config-fields/value-type', views.ValueTypeChoicesListView.as_view(), name='value-type-choices'),
    path('input-types/', views.InputTypeChoicesListView.as_view(), name='input-type-choices'),
    path('', include(router.urls))
]
