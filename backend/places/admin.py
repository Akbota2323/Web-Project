from django.contrib import admin
from .models import Category, Place, Booking, Favorite

admin.site.register(Category)
admin.site.register(Place)
admin.site.register(Booking)
admin.site.register(Favorite)