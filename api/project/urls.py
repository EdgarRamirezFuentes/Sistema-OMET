from django.urls import path, include
from project import views
from rest_framework import routers

app_name = 'project'

router = routers.SimpleRouter()

router.register('maintenance', views.MaintenanceViewSet, basename='maintenance')
router.register('apps', views.ProjectAppViewSet, basename='project-app')
router.register('models', views.AppModelViewSet, basename='app-model')
router.register('fields', views.ModelFieldViewSet, basename='model-field')
router.register('validator-value', views.ValidatorValueViewSet, basename='validator-value')
router.register('', views.ProjectViewSet, basename='project')


urlpatterns = [
    path('change-status/<int:pk>/', views.ChangeProjectStatusView.as_view(), name='project-change-status'),
    path('models/change-status/<int:pk>/', views.ChangeAppModelStatusView.as_view(), name='app-model-change-status'),
    path('fields/change-status/<int:pk>/', views.ChangeModelFieldStatusView.as_view(), name='model-field-change-status'),
    path('validator-value/change-status/<int:pk>/', views.ChangeValidatorValueStatusView.as_view(), name='validator-value-change-status'),
    path('export/<int:pk>/', views.ExportProjectApiView.as_view(), name='project-export'),
    path('', include(router.urls)),
]
