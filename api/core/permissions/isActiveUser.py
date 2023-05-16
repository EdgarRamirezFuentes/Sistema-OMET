from rest_framework import permissions


class isActiveUser(permissions.BasePermission):
    """Check if the user is active"""
    def has_permission(self, request, view):
        return request.user.is_staff
