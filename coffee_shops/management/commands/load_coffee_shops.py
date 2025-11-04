from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from coffee_shops.models import CoffeeShop

class Command(BaseCommand):
    help = 'Load sample Dublin coffee shops'
    
    def handle(self, *args, **options):
        # Sample Dublin coffee shops with real coordinates
        coffee_data = [
            {
                'name': '3fe Coffee',
                'address': '32 Grand Canal Street Lower',
                'area': 'Grand Canal Dock',
                'location': Point(-6.2405, 53.3361, srid=4326),
                'rating': 4.6,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Specialty coffee roaster with excellent espresso'
            },
            {
                'name': 'Clement & Pekoe',
                'address': '50 South William Street',
                'area': 'City Centre',
                'location': Point(-6.2633, 53.3426, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Cozy cafe with great brunch options'
            },
            {
                'name': 'Brother Hubbard',
                'address': '153 Capel Street',
                'area': 'North City',
                'location': Point(-6.2686, 53.3487, srid=4326),
                'rating': 4.7,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Middle Eastern inspired cafe with amazing coffee'
            },
            {
                'name': 'Cloud Picker Coffee',
                'address': 'Bachelors Walk',
                'area': 'Temple Bar',
                'location': Point(-6.2658, 53.3469, srid=4326),
                'rating': 4.4,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Riverside location with specialty coffee'
            },
            {
                'name': 'The Bald Barista',
                'address': 'Aungier Street',
                'area': 'City Centre',
                'location': Point(-6.2646, 53.3390, srid=4326),
                'rating': 4.6,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Popular spot for quality coffee and pastries'
            },
            {
                'name': 'Kaph',
                'address': '31 Drury Street',
                'area': 'City Centre',
                'location': Point(-6.2637, 53.3417, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Minimalist cafe with excellent coffee'
            },
            {
                'name': 'Network',
                'address': '39 Aungier Street',
                'area': 'City Centre',
                'location': Point(-6.2643, 53.3397, srid=4326),
                'rating': 4.3,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Student-friendly cafe with good wifi'
            },
            {
                'name': 'Two Pups Coffee',
                'address': 'Francis Street',
                'area': 'The Liberties',
                'location': Point(-6.2734, 53.3416, srid=4326),
                'rating': 4.7,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Dog-friendly cafe in the Liberties'
            },
            {
                'name': 'Vice Coffee Inc.',
                'address': '54 Middle Abbey Street',
                'area': 'City Centre',
                'location': Point(-6.2630, 53.3486, srid=4326),
                'rating': 4.4,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Specialty coffee in the heart of Dublin'
            },
            {
                'name': 'Proper Order Coffee',
                'address': 'Smithfield Square',
                'area': 'Smithfield',
                'location': Point(-6.2778, 53.3478, srid=4326),
                'rating': 4.6,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Spacious cafe with great outdoor seating'
            },

            {
                'name': 'Mugs Cafe',
                'address': '61A Castle Street, Dalkey, Co. Dublin',
                'area': 'Dalkey',
                'location': Point(-6.1200, 53.2800, srid=4326),  # approximate, to verify
                'rating': 4.5,  # per local listings / reviews :contentReference[oaicite:0]{index=0}
                'wifi': True,  # indoor reviews mention free wifi and fast wifi (Corner Note mentions wifi, Mugs likely too) :contentReference[oaicite:1]{index=1}
                'outdoor_seating': True,  # reviewer notes pavement seating across the street for Mugs :contentReference[oaicite:2]{index=2}
                'description': 'Cozy, community-oriented café with strong coffee, pastries, upstairs seating and pavement seating'
            },
            {
                'name': 'The Corner Note Cafe',
                'address': '1 Coliemore Road, Dalkey, Co. Dublin',
                'area': 'Dalkey',
                'location': Point(-6.1215, 53.2795, srid=4326),  # approximate
                'rating': 3.8,  # per Tripadvisor listing :contentReference[oaicite:3]{index=3}
                'wifi': True,  # they advertise “fast & open wifi” :contentReference[oaicite:4]{index=4}
                'outdoor_seating': False,  # not clearly stated in sources I found
                'description': 'Restaurant-quality food in a café setting, free & open wifi, heritage town location'
            },
            {
                'name': 'Thyme Out',
                'address': '33/34 Castle Street, Dalkey, Co. Dublin',
                'area': 'Dalkey',
                'location': Point(-6.1208, 53.2799, srid=4326),  # approximate
                'rating': None,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Gourmet food shop / deli with café elements, daily fresh produce and house-made items' 
            },
            {
                'name': 'Happy Out',
                'address': 'Windsor Terrace, Dún Laoghaire, Co. Dublin, A96 WP7A, Ireland',
                'area': 'Dún Laoghaire',
                'location': Point(-6.1350, 53.2935, srid=4326),  # approximate, to verify
                'rating': 4.4,  # per Wanderlog listing :contentReference[oaicite:7]{index=7}
                'wifi': False,
                'outdoor_seating': True,  # they mention outdoor seating overlooking harbour :contentReference[oaicite:8]{index=8}
                'description': 'Harbour-side café with strong views, pastries, food options, buzz on sunny days' 
            },
            {
                'name': 'Shoe Lane Coffee (Dún Laoghaire)',
                'address': 'Unit 107, Dún Laoghaire Shopping Centre, George’s Street Upper, Dún Laoghaire',
                'area': 'Dún Laoghaire',
                'location': Point(-6.1275, 53.2960, srid=4326),  # approximate
                'rating': None,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Chain café, commuter-friendly spot with reliable coffee and pastry options'  
            },
            
            {
                'name': 'Pepper Laine',
                'address': 'Blue Court, 2 Convent Rd, Dalkey Commons, Dalkey',
                'area': 'Dalkey',
                'location': Point(-6.1210, 53.2802, srid=4326),  # approximate
                'rating': None,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Stylish café in Dalkey village, good for coffee and local design/retail items'
            }

        ]
        
        created_count = 0
        for shop_data in coffee_data:
            shop, created = CoffeeShop.objects.get_or_create(
                name=shop_data['name'],
                defaults=shop_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(f"✓ Created: {shop.name}")
            else:
                self.stdout.write(f"○ Already exists: {shop.name}")
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Successfully loaded {created_count} new coffee shops'
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                f'Total coffee shops in database: {CoffeeShop.objects.count()}'
            )
        )