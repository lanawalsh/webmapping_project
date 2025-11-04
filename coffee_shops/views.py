from django.shortcuts import render
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CoffeeShop

def map_view(request):
    """Main map view"""
    return render(request, 'coffee_shops/map.html')

@api_view(['GET'])
def all_coffee_shops(request):
    """Return all coffee shops as GeoJSON"""
    shops = CoffeeShop.objects.all()
    
    features = []
    for shop in shops:
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [float(shop.longitude), float(shop.latitude)]
            },
            "properties": {
                "id": shop.id,
                "name": shop.name,
                "address": shop.address,
                "area": shop.area,
                "rating": float(shop.rating) if shop.rating else None,
                "description": shop.description,
                "wifi": shop.wifi,
                "outdoor_seating": shop.outdoor_seating
            }
        }
        features.append(feature)
    
    return Response({
        "type": "FeatureCollection",
        "features": features
    })

# 1. FIND NEAREST COFFEE SHOPS
@api_view(['POST'])
@csrf_exempt
def find_nearest_coffee(request):
    """Find nearest coffee shops to a point"""
    try:
        if hasattr(request, 'data'):
            data = request.data
        else:
            import json
            data = json.loads(request.body)
        
        lat = float(data.get('lat'))
        lng = float(data.get('lng'))
        limit = int(data.get('limit', 5))
        
        search_point = Point(lng, lat, srid=4326)
        
        nearest_shops = CoffeeShop.objects.annotate(
            distance=Distance('location', search_point)
        ).order_by('distance')[:limit]
        
        results = []
        for i, shop in enumerate(nearest_shops, 1):
            results.append({
                'rank': i,
                'id': shop.id,
                'name': shop.name,
                'address': shop.address,
                'area': shop.area,
                'coordinates': {
                    'lat': float(shop.latitude),
                    'lng': float(shop.longitude)
                },
                'distance_km': round(shop.distance.km, 2),
                'distance_m': round(shop.distance.m, 0),
                'rating': float(shop.rating) if shop.rating else None
            })
        
        return Response({
            'search_point': {'lat': lat, 'lng': lng},
            'total_found': len(results),
            'nearest_shops': results
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# 2. FIND COFFEE SHOPS WITHIN RADIUS
@api_view(['POST'])
@csrf_exempt
def coffee_within_radius(request):
    """Find coffee shops within radius"""
    try:
        if hasattr(request, 'data'):
            data = request.data
        else:
            import json
            data = json.loads(request.body)
            
        lat = float(data.get('lat'))
        lng = float(data.get('lng'))
        radius_km = float(data.get('radius_km', 1))
        
        if radius_km <= 0 or radius_km > 20:
            return Response({'error': 'Radius must be between 0 and 20 km'}, status=400)
        
        search_point = Point(lng, lat, srid=4326)
        
        shops_in_radius = CoffeeShop.objects.filter(
            location__distance_lte=(search_point, D(km=radius_km))
        ).annotate(
            distance=Distance('location', search_point)
        ).order_by('distance')
        
        results = []
        for shop in shops_in_radius:
            results.append({
                'id': shop.id,
                'name': shop.name,
                'address': shop.address,
                'area': shop.area,
                'coordinates': {
                    'lat': float(shop.latitude),
                    'lng': float(shop.longitude)
                },
                'distance_km': round(shop.distance.km, 2),
                'distance_m': round(shop.distance.m, 0),
                'rating': float(shop.rating) if shop.rating else None
            })
        
        return Response({
            'success': True,
            'search_point': {'lat': lat, 'lng': lng},
            'radius_km': radius_km,
            'total_found': len(results),
            'shops': results
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# 3. DISTANCE BETWEEN TWO SHOPS
@api_view(['GET'])
def distance_between_shops(request, shop1_id, shop2_id):
    """Calculate distance between two coffee shops"""
    try:
        shop1 = CoffeeShop.objects.get(id=shop1_id)
        shop2 = CoffeeShop.objects.get(id=shop2_id)
        
        distance_degrees = shop1.location.distance(shop2.location)
        distance_km = distance_degrees * 111.32
        
        return Response({
            'success': True,
            'shop1': {
                'id': shop1.id,
                'name': shop1.name,
                'coordinates': {
                    'lat': float(shop1.latitude),
                    'lng': float(shop1.longitude)
                }
            },
            'shop2': {
                'id': shop2.id,
                'name': shop2.name,
                'coordinates': {
                    'lat': float(shop2.latitude),
                    'lng': float(shop2.longitude)
                }
            },
            'distance': {
                'km': round(distance_km, 2),
                'meters': round(distance_km * 1000, 0),
                'miles': round(distance_km * 0.621371, 2)
            }
        })
        
    except CoffeeShop.DoesNotExist:
        return Response({'success': False, 'error': 'Coffee shop not found'}, status=404)
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=500)