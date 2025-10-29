from django import forms
from django.http import HttpResponseBadRequest, HttpResponseRedirect, Http404
from django.shortcuts import render
from django.urls import reverse

from .models import Blog

# Create your views here.
def index(request):
    return render(request, "planner/index.html")

def about(request):
    return render(request, "planner/about.html")

def product(request):
    return render(request, "planner/product.html")

def blog(request):
    return render(request, "planner/blog.html", {
        "blogs": Blog.objects.all().order_by('-date')  # Added .order_by('-date')
    })