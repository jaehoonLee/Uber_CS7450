"""CS7450 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from Main.views import *


urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', main),
    url(r'^save_data$', save_data),
    url(r'^save_data2$', save_data2),
    url(r'^save_data3$', save_data3),
    url(r'^save_data5$', save_data5),
    url(r'^update_data$', update_data),
    url(r'^request_data', request_data),
    url(r'^filter_data', filter_data),
    url(r'^filter', filter),
    url(r'^request_start_pos_data', request_start_pos_data),



]
