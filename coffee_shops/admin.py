from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from .models import CoffeeShop

@admin.register(CoffeeShop)
class CoffeeShopAdmin(OSMGeoAdmin):
    list_display = ['name', 'area', 'address', 'rating', 'wifi', 'outdoor_seating']
    list_filter = ['area', 'wifi', 'outdoor_seating']
    search_fields = ['name', 'address', 'description']
    ordering = ['name']
    
    # Map widget settings for Dublin
    default_lon = -6.2603
    default_lat = 53.3498
    default_zoom = 13
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'address', 'area')
        }),
        ('Location', {
            'fields': ('location',)
        }),
        ('Details', {
            'fields': ('rating', 'description', 'wifi', 'outdoor_seating'),
            'classes': ('collapse',)
        }),
    )