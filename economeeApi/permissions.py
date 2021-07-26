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
        account = Account.objects.filter(id_user=request.user)
        if account:
            return True
        else:
            return False


class IsObjOwner(permissions.BasePermission):
    message = "Not a valid User ID."

    def has_permission(self, request, view):
        account = Account.objects.filter(id_user=request.user)
        balance = Balance.objects.filter(id_account=account)
        if balance is not None:
            return True
        else:
            return False

    def has_object_permission(self, request, view, obj):
        account = Account.objects.filter(id_user=request.user).first()
        balance = Balance.objects.filter(id_account=account).first()
        if balance == obj.balance:
            return True
        else:
            return False
