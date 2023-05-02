from django.urls import path, include
from customer import views
from rest_framework import routers

app_name = 'customer'

router = routers.SimpleRouter()

router.register('', views.CustomerViewSet, basename='customer')


urlpatterns = [
    path('change-status/<int:pk>/', views.ChangeCustomerStatus.as_view(), name='customer-change-status'),
    path('', include(router.urls)),
]
