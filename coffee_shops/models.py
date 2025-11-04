from django.contrib.gis.db import models
from django.contrib.gis.geos import Point

class CoffeeShop(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=300)
    area = models.CharField(max_length=100)  # e.g., "Temple Bar", "Rathmines"
    
    # Spatial field - this stores the location
    location = models.PointField(srid=4326)
    
    # Additional info
    rating = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)
    description = models.TextField(blank=True)
    wifi = models.BooleanField(default=False)
    outdoor_seating = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = "Coffee Shop"
        verbose_name_plural = "Coffee Shops"
    
    def __str__(self):
        return f"{self.name} - {self.area}"
    
    @property
    def latitude(self):
        return self.location.y if self.location else None
    
    @property
    def longitude(self):
        return self.location.x if self.location else None
    
    @property
    def coordinates(self):
        return [self.longitude, self.latitude] if self.location else None