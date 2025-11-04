from rest_framework import serializers
from .models import CoffeeShop

class CoffeeShopSerializer(serializers.ModelSerializer):
    coordinates = serializers.ReadOnlyField()
    latitude = serializers.ReadOnlyField()
    longitude = serializers.ReadOnlyField()
    
    class Meta:
        model = CoffeeShop
        fields = [
            'id', 'name', 'address', 'area', 
            'latitude', 'longitude', 'coordinates',
            'rating', 'description', 'wifi', 'outdoor_seating'
        ]