from rest_framework import permissions

from economeeApi.models import Account, Balance


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsAccountOwner(permissions.BasePermission):
    message = "Not a valid User ID."

    def has_permission(self, request, view):
        account = Account.objects.filter(user_id=request.user.id)
        if account:
            return True
        else:
            return False


class IsObjOwner(permissions.BasePermission):
    message = "Not a valid User ID."

    def has_permission(self, request, view):
        account = Account.objects.filter(user_id=request.user.id)
        balance = Balance.objects.filter(account=account)
        if balance is not None:
            return True
        else:
            return False

    def has_object_permission(self, request, view, obj):
        account = Account.objects.filter(user_id=request.user.id).first()
        balance = Balance.objects.filter(account=account).first()
        if balance == obj.balance:
            return True
        else:
            return False
