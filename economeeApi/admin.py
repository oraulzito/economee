from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Account)
admin.site.register(Balance)
admin.site.register(Card)
admin.site.register(Release)
admin.site.register(ReleaseCategory)
admin.site.register(Invoice)
