from django.urls import path
from database_logs import views

app_name = 'database_logs'

urlpatterns = [
    path('customer/create/', views.GetCustomerCreateLogsView.as_view(), name='get-client-create-logs'),
    path('customer/update/', views.GetCustomerUpdateLogsView.as_view(), name='get-client-update-logs'),
    path('user/create/', views.GetUserCreateLogsView.as_view(), name='get-user-create-logs'),
    path('user/update/', views.GetUserUpdateLogsView.as_view(), name='get-user-update-logs'),
    path('project/create/', views.GetProjectCreateLogsView.as_view(), name='get-project-create-logs'),
    path('project/update/', views.GetProjectUpdateLogsView.as_view(), name='get-project-update-logs'),
]
