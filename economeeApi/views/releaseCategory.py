from django.db.models import Q
from django.http import HttpResponse
from django_rest.permissions import IsAuthenticated
from rest_framework import viewsets, authentication

from economeeApi.models import ReleaseCategory
from economeeApi.permissions import IsObjOwner
from economeeApi.serializers import ReleaseCategorySerializer


class ReleaseCategoryView(viewsets.ModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = ReleaseCategorySerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list' or self.action == 'post' or self.action == 'delete':
            permission_classes = [IsObjOwner, IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return ReleaseCategory.objects.filter(Q(owner_id=self.request.user.id) | Q(owner_id=None))

    def create(self, request, *args, **kwargs):
        release_category = ReleaseCategory.objects.create(
            name=self.request.data.get('name'),
            owner_id=self.request.user.id). \
            save()
        return HttpResponse(self.get_serializer(release_category).data, content_type="application/json")
