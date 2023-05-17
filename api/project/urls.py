from django.urls import path, include
from project import views
from rest_framework import routers

app_name = 'project'

router = routers.SimpleRouter()

router.register('maintenance', views.MaintenanceViewSet, basename='maintenance')
router.register('models', views.ProjectModelViewSet, basename='project-model')
router.register('fields', views.ModelFieldViewSet, basename='model-field')
router.register('config-values', views.ConfigValuesViewSet, basename='config-values')
router.register('', views.ProjectViewSet, basename='project')


urlpatterns = [
    path('change-status/<int:pk>/', views.ChangeProjectStatusView.as_view(), name='project-change-status'),
    path('models/change-status/<int:pk>/', views.ChangeProjectModelStatusView.as_view(), name='project-model-change-status'),
    path('fields/change-status/<int:pk>/', views.ChangeModelFieldStatusView.as_view(), name='model-field-change-status'),
    path('config-values/change-status/<int:pk>/', views.ChangeConfigValuesStatusView.as_view(), name='config-values-change-status'),
    path('', include(router.urls)),
]
