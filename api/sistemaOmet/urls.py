from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView
)

urlpatterns = [
    # Swagger endpoints
    path('admin/', admin.site.urls),
        path('api/v1/schema/', SpectacularAPIView.as_view(), name='api-schema'),
    path(
        'api/v1/docs/',
        SpectacularSwaggerView.as_view(url_name='api-schema'),
        name='api-docs'
    ),

    # Sistema Omet API endpoints
    path('api/v1/user/', include('user.urls')),
    path('api/v1/customer/', include('customer.urls')),
    path('api/v1/project/', include('project.urls')),
    path('api/v1/data-type/', include('dataType.urls')),
]

if settings.DEBUG:
    urlpatterns +=  static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
