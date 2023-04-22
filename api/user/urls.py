"""
URL mappings for the user API.
"""
from django.urls import path, include

from knox import views as knox_views
from rest_framework import routers


from user import views


router = routers.SimpleRouter()

router.register('', views.UserViewSet)

app_name = 'user'

urlpatterns = [
    path('auth/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('logout-all/', views.LogoutAllView.as_view(), name='logoutall'),
    path('', include(router.urls))
]
