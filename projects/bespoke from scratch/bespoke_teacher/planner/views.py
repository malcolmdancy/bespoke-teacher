from django import forms
from django.http import HttpResponseBadRequest, HttpResponseRedirect, Http404
from django.shortcuts import render
from django.urls import reverse

# Create your views here.
def index(request):
    return render(request, "planner/index.html", {
        "task":["chalk", "cheese"]
        })