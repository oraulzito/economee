"""Economee URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from rest_framework import routers

from economeeApi import views

router = routers.DefaultRouter()
router.register(r'account', views.AccountView, 'Account')
router.register(r'user', views.UserView, 'User')
router.register(r'balance', views.BalanceView, 'Balance')
router.register(r'card', views.CardView, 'Card')
router.register(r'charts', views.ChartsView, 'Charts')
router.register(r'release', views.ReleaseView, 'Release')
router.register(r'releaseCategory', views.ReleaseCategoryView, 'ReleaseCategory')
router.register(r'recurringRelease', views.RecurringReleaseView, 'RecurringRelease')
router.register(r'invoice', views.InvoiceView, 'Invoice')
router.register(r'currency', views.CurrencyView, 'Currency')
