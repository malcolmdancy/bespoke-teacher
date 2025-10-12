from django.urls import path
from . import views

app_name = "planner"
urlpatterns = [
    path("", views.index, name = "index"),
    path("", views.about, name = "about"),
    path("", views.product, name = "product"),
    path("", views.blog, name = "blog"),
]