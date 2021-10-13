from rest_framework import permissions

from economeeApi.models import Account, Balance, Card


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsAccountOwner(permissions.BasePermission):
    message = "Not a valid User ID."

    def has_permission(self, request, view):
        account = Account.objects.filter(user=request.user)
        if account:
            return True
        else:
            return False


# FIXME it's not working properly
class IsObjOwner(permissions.BasePermission):
    message = "Not a valid User ID."

    def has_permission(self, request, view):
        account = Account.objects.filter(user=request.user.id).all()
        balance = Balance.objects.filter(account__in=account)
        card = Card.objects.filter(account__in=account)
        if balance is not None or card is not None:
            return True
        else:
            return False

    def has_object_permission(self, request, view, obj):
        account = Account.objects.filter(user=request.user).first()
        balance = Balance.objects.filter(account=account).first()
        if balance == obj.balance:
            return True
        else:
            return False


class Deny(permissions.BasePermission):
    message = "Not a valid User ID."

    def has_permission(self, request, view):
        return False


class IsAdmin(permissions.BasePermission):
    message = "Not a valid User ID."

    def has_permission(self, request, view):
        return request.user.is_superuser
