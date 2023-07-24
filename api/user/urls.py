"""
URL mappings for the user API.
"""
from django.urls import path, include

from knox import views as knox_views
from rest_framework import routers


from user import views


router = routers.SimpleRouter()

router.register('', views.UserViewSet, basename='user')

app_name = 'user'

urlpatterns = [
    path('auth/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('logout-all/', views.LogoutAllView.as_view(), name='logoutall'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    path('change-status/<int:pk>/', views.ChangeUserStatusView.as_view(), name='change-status'),
    path('', include(router.urls))
]
