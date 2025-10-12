from django.utils.timezone import now
from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    return render(request, "planner/index.html" , {
        "summer":now().month in [6, 7, 8, 9]
    })

def about(request):
    return render(request, "planner/about.html")

def product(request):
    return render(request, "planner/product.html")

def blog(request):
    return render(request, "planner/blog.html")

