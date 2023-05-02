from django.urls import path, include
from project import views
from rest_framework import routers

app_name = 'project'

router = routers.SimpleRouter()

router.register('', views.ProjectViewSet, basename='project')
router.register('maintenance', views.MaintenanceViewSet, basename='maintenance')
router.register('models', views.ProjectModelViewSet, basename='project-model')
router.register('models/fields/', views.ModelFieldViewSet, basename='model-field')


urlpatterns = [
    path('change-status/<int:pk>/', views.ChangeProjectStatusView.as_view(), name='project-change-status'),
    path('', include(router.urls)),
]
