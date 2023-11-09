from django.urls import path, include
from project import views
from rest_framework import routers

app_name = 'project'

router = routers.SimpleRouter()

router.register('apps', views.ProjectAppViewSet, basename='project-app')
router.register('models', views.AppModelViewSet, basename='app-model')
router.register('fields', views.ModelFieldViewSet, basename='model-field')
router.register('validator-value', views.ValidatorValueViewSet, basename='validator-value')
router.register('', views.ProjectViewSet, basename='project')


urlpatterns = [
    path('structure/<int:pk>/', views.ProjectStructureApiView.as_view(), name='project-structure'),
    path('export/<int:pk>/', views.ExportProjectApiView.as_view(), name='project-export'),
    path('', include(router.urls)),
]
