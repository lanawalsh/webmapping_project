from django.urls import path
from . import views

app_name = 'coffee_shops'

urlpatterns = [
    path('', views.map_view, name='map'),
    
    path('api/all/', views.all_coffee_shops, name='all_shops'),
    path('api/nearest/', views.find_nearest_coffee, name='nearest'),
    path('api/radius/', views.coffee_within_radius, name='radius'),
    path('api/distance/<int:shop1_id>/<int:shop2_id>/', views.distance_between_shops, name='distance_between'),
    
]