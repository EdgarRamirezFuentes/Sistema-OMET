from rest_framework import permissions
from core.models import (
    AppModel,
    Maintenance,
    ModelField,
    Maintenance
)


class isMaintainer(permissions.BasePermission):
    def has_permission(self, request, view):

        pass

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True

        if object is AppModel:
            return Maintenance.objects.filter(
                app_model=obj,
                user=request.user,
                is_active=True
            ).exists()

        if object is ModelField:
            return Maintenance.objects.filter(
                app_model=obj.app_model,
                user=request.user,
                is_active=True
            ).exists()
