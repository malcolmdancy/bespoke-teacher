from django.urls import path
from . import views

app_name = 'planner' 
urlpatterns = [
    path("", views.index, name='index'),
    path("index/", views.index, name='index'),
    path("blog/", views.blog, name='blog'),
    path("product/", views.product, name='product'),
    path("about/", views.about, name='about'),
]