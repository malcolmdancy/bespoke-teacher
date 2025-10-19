from django.contrib import admin
from .models import Blog, Schools, Orders, Product

# Register your models here.
admin.site.register(Product)
admin.site.register(Schools)
admin.site.register(Orders)
admin.site.register(Blog)

