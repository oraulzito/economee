from django_rest.permissions import IsAuthenticated
from rest_framework import viewsets, authentication

from economeeApi.models import RecurringRelease
from economeeApi.permissions import IsObjOwner
from economeeApi.serializers import RecurringReleaseSerializer


class RecurringReleaseView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = RecurringReleaseSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list' or self.action == 'post' or self.action == 'delete':
            permission_classes = [IsObjOwner, IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return RecurringRelease.objects.filter(balance__account__owner_id=self.request.user.id).all()

    # TODO - Update release if the date of the release change, it has to change the balance/invoice ID as well
