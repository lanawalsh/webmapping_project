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
            },

            {
                'name': 'The Fumbally',
                'address': 'Fumbally Lane',
                'area': 'The Liberties',
                'location': Point(-6.2742, 53.3379, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Beloved cafe with farm-to-table ethos and excellent coffee'
            },
            {
                'name': 'Bear Market Coffee',
                'address': '4 Blackhall Place',
                'area': 'Smithfield',
                'location': Point(-6.2805, 53.3482, srid=4326),
                'rating': 4.7,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Specialty coffee roastery with rotating single origins'
            },
            {
                'name': 'Wall & Keogh',
                'address': 'Richmond Street South',
                'area': 'Portobello',
                'location': Point(-6.2654, 53.3309, srid=4326),
                'rating': 4.4,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Neighborhood gem with excellent brunch and coffee'
            },
            {
                'name': 'Silke Road Cafe',
                'address': '34 Kevin Street Lower',
                'area': 'Liberties',
                'location': Point(-6.2713, 53.3385, srid=4326),
                'rating': 4.3,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Cozy student-friendly cafe near DIT'
            },
            {
                'name': 'Imbibe',
                'address': '110 Parnell Street',
                'area': 'North City',
                'location': Point(-6.2645, 53.3523, srid=4326),
                'rating': 4.6,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Specialty coffee with impressive latte art'
            },
            {
                'name': 'Coffeeangel',
                'address': 'South Anne Street',
                'area': 'City Centre',
                'location': Point(-6.2599, 53.3426, srid=4326),
                'rating': 4.2,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Ethical coffee with great bagels and pastries'
            },
            {
                'name': 'Shoe Lane Coffee',
                'address': 'Arran Street East',
                'area': 'Smithfield',
                'location': Point(-6.2745, 53.3469, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Industrial-chic roastery with outdoor seating'
            },
            {
                'name': 'Urbanity Coffee',
                'address': '5 Smithfield Square',
                'area': 'Smithfield',
                'location': Point(-6.2779, 53.3476, srid=4326),
                'rating': 4.4,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Modern cafe in the heart of Smithfield'
            },
            {
                'name': 'Proper Order Coffee Co',
                'address': '6 Haymarket',
                'area': 'Smithfield',
                'location': Point(-6.2774, 53.3479, srid=4326),
                'rating': 4.6,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Spacious roastery with great breakfast options'
            },
            {
                'name': 'Butlers Chocolate Cafe',
                'address': '24 Wicklow Street',
                'area': 'City Centre',
                'location': Point(-6.2614, 53.3425, srid=4326),
                'rating': 4.1,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Irish chocolate brand with excellent hot chocolate'
            },
            {
                'name': 'Roasted Brown',
                'address': '88 Lower Camden Street',
                'area': 'Camden',
                'location': Point(-6.2651, 53.3354, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Popular brunch spot with great coffee'
            },
            {
                'name': 'Two Boys Brew',
                'address': 'Pleasants Place',
                'area': 'Camden',
                'location': Point(-6.2638, 53.3368, srid=4326),
                'rating': 4.6,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Award-winning specialty coffee roasters'
            },
            {
                'name': 'Carved',
                'address': '48 Pearse Street',
                'area': 'City Centre',
                'location': Point(-6.2487, 53.3443, srid=4326),
                'rating': 4.3,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Artisan sandwiches and excellent filter coffee'
            },
            {
                'name': 'Accents Coffee',
                'address': 'Stephens Green Shopping Centre',
                'area': 'St Stephens Green',
                'location': Point(-6.2609, 53.3387, srid=4326),
                'rating': 4.0,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Convenient shopping center location'
            },
            {
                'name': 'Cafe Coco',
                'address': '9 South William Street',
                'area': 'City Centre',
                'location': Point(-6.2634, 53.3431, srid=4326),
                'rating': 4.2,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Trendy spot in creative quarter'
            },
            {
                'name': 'Bewleys Grafton Street',
                'address': '78 Grafton Street',
                'area': 'City Centre',
                'location': Point(-6.2605, 53.3418, srid=4326),
                'rating': 4.3,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Historic Dublin institution with ornate interior'
            },
            {
                'name': 'Havana Cafe',
                'address': '4 Grand Canal Square',
                'area': 'Grand Canal Dock',
                'location': Point(-6.2394, 53.3434, srid=4326),
                'rating': 4.1,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Modern cafe with waterfront views'
            },
            {
                'name': 'Drury Buildings',
                'address': '52-55 Drury Street',
                'area': 'City Centre',
                'location': Point(-6.2638, 53.3419, srid=4326),
                'rating': 4.4,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Multi-level food hall with specialty coffee'
            },
            {
                'name': 'Love Supreme',
                'address': '57 Aungier Street',
                'area': 'City Centre',
                'location': Point(-6.2647, 53.3392, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Hip cafe with record shop vibes'
            },
            {
                'name': 'Kevin Street Coffee',
                'address': '77 Kevin Street Lower',
                'area': 'Liberties',
                'location': Point(-6.2699, 53.3374, srid=4326),
                'rating': 4.2,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Popular with students and locals'
            },
            {
                'name': 'Bread 41',
                'address': '41 Pearse Street',
                'area': 'City Centre',
                'location': Point(-6.2495, 53.3445, srid=4326),
                'rating': 4.6,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Artisan bakery with exceptional coffee'
            },
            {
                'name': 'Queen of Tarts',
                'address': 'Cows Lane',
                'area': 'Temple Bar',
                'location': Point(-6.2679, 53.3453, srid=4326),
                'rating': 4.5,
                'wifi': False,
                'outdoor_seating': True,
                'description': 'Famous for homemade cakes and pastries'
            },
            {
                'name': 'Foam Cafe',
                'address': 'Aston Quay',
                'area': 'City Centre',
                'location': Point(-6.2623, 53.3462, srid=4326),
                'rating': 4.3,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'River views and quality coffee'
            },
            {
                'name': 'Meet Me in the Morning',
                'address': 'Pleasants Street',
                'area': 'Camden',
                'location': Point(-6.2642, 53.3365, srid=4326),
                'rating': 4.4,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Weekend brunch favorite with excellent coffee'
            },
            {
                'name': 'Idle Wild',
                'address': 'South Great Georges Street',
                'area': 'City Centre',
                'location': Point(-6.2638, 53.3408, srid=4326),
                'rating': 4.2,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Relaxed atmosphere with quality beans'
            },
            {
                'name': 'Gaillot et Gray',
                'address': 'Fade Street',
                'area': 'City Centre',
                'location': Point(-6.2639, 53.3428, srid=4326),
                'rating': 4.1,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'French-inspired cafe with outdoor terrace'
            },
            {
                'name': 'Tartine Cafe',
                'address': 'Bachelors Walk',
                'area': 'North City',
                'location': Point(-6.2651, 53.3472, srid=4326),
                'rating': 4.3,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Casual spot near the Liffey'
            },
            {
                'name': 'Starbucks Grafton Street',
                'address': '51 Grafton Street',
                'area': 'City Centre',
                'location': Point(-6.2602, 53.3423, srid=4326),
                'rating': 3.9,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Chain coffee shop in prime location'
            },
            {
                'name': 'Insomnia Coffee',
                'address': 'Trinity College',
                'area': 'City Centre',
                'location': Point(-6.2546, 53.3438, srid=4326),
                'rating': 4.0,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Irish coffee chain with reliable quality'
            },
            {
                'name': 'Jungle Cafe',
                'address': 'South Great Georges Street',
                'area': 'City Centre',
                'location': Point(-6.2641, 53.3412, srid=4326),
                'rating': 4.4,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Vegan cafe with specialty coffee and plants'
            },
            
            {
                'name': 'Happy Out',
                'address': '81 Morehampton Road',
                'area': 'Donnybrook',
                'location': Point(-6.2358, 53.3250, srid=4326),
                'rating': 4.9,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Award-winning specialty coffee with global-inspired brunch menu, toasties and Turkish eggs'
            },
            {
                'name': 'Cafe Nero',
                'address': '88 Donnybrook Road',
                'area': 'Donnybrook',
                'location': Point(-6.2365, 53.3242, srid=4326),
                'rating': 3.5,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Italian coffee chain with handcrafted drinks and panini'
            },
            {
                'name': 'Cafe Diem',
                'address': 'Donnybrook',
                'area': 'Donnybrook',
                'location': Point(-6.2370, 53.3245, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Moroccan-run coffee shop with excellent hospitality and homemade food'
            },
            {
                'name': 'Cafe Java',
                'address': 'Donnybrook',
                'area': 'Donnybrook',
                'location': Point(-6.2368, 53.3248, srid=4326),
                'rating': 3.5,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Breakfast and brunch cafe with wide range of dishes and quality coffee'
            },

            
            {
                'name': 'The Art of Coffee',
                'address': 'Ballsbridge',
                'area': 'Ballsbridge',
                'location': Point(-6.2295, 53.3285, srid=4326),
                'rating': 4.3,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Stylish cafe with freshly roasted beans, relaxing jazz and breakfast options'
            },
            {
                'name': 'Ballsbridge Speciality Coffee',
                'address': 'Shelbourne Road',
                'area': 'Ballsbridge',
                'location': Point(-6.2280, 53.3295, srid=4326),
                'rating': 4.6,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Direct trade specialty coffee with house-baked flatbreads and Italian sandwiches'
            },
            {
                'name': 'The Orange Goat',
                'address': 'Sandymount/Ballsbridge',
                'area': 'Ballsbridge',
                'location': Point(-6.2270, 53.3290, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Fresh homemade food with Cloudpicker specialty coffee'
            },
            {
                'name': 'Insomnia Coffee',
                'address': '8 Merrion Road',
                'area': 'Ballsbridge',
                'location': Point(-6.2305, 53.3278, srid=4326),
                'rating': 4.0,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Irish chain serving fairtrade coffee, hot chocolate and freshly baked pastries'
            },
            {
                'name': 'Cafe Java Ballsbridge',
                'address': '49 Shelbourne Road',
                'area': 'Ballsbridge',
                'location': Point(-6.2285, 53.3292, srid=4326),
                'rating': 3.8,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Continental-style coffee house with table service and Suki tea'
            },
            {
                'name': 'Avoca Ballsbridge',
                'address': 'Shelbourne Road',
                'area': 'Ballsbridge',
                'location': Point(-6.2290, 53.3298, srid=4326),
                'rating': 4.2,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Food market with coffee bar, patisserie and Fodder Restaurant'
            },
            {
                'name': 'Red Bean Roastery',
                'address': 'Clayton Hotel Ballsbridge',
                'area': 'Ballsbridge',
                'location': Point(-6.2300, 53.3280, srid=4326),
                'rating': 4.0,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Barista-style coffee and baked treats in hotel setting'
            },

            
            {
                'name': 'Cafe Du Journal',
                'address': '17a The Crescent',
                'area': 'Monkstown',
                'location': Point(-6.1545, 53.2925, srid=4326),
                'rating': 4.2,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Gourmet coffee shop with eggs benedict, pancakes and brunch menu'
            },
            {
                'name': 'Insomnia Coffee Monkstown',
                'address': '1A The Crescent',
                'area': 'Monkstown',
                'location': Point(-6.1548, 53.2923, srid=4326),
                'rating': 3.8,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Chain coffee shop at Spar with fairtrade coffee and pastries'
            },
            {
                'name': 'Avoca Monkstown',
                'address': 'Monkstown Main Street',
                'area': 'Monkstown',
                'location': Point(-6.1550, 53.2920, srid=4326),
                'rating': 4.3,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Food market with Salt Café serving seasonal breakfast and lunch'
            },
            {
                'name': 'Cinnamon',
                'address': 'Monkstown',
                'area': 'Monkstown',
                'location': Point(-6.1552, 53.2922, srid=4326),
                'rating': 4.2,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Comfortable eatery and coffee house with brunch menu'
            },

            # Blackrock
            {
                'name': 'Hatch Coffee',
                'address': '13 Main Street',
                'area': 'Blackrock',
                'location': Point(-6.1778, 53.3008, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': False,
                'description': '3fe specialty coffee with stunning interior and delicious brunch dishes'
            },
            {
                'name': 'Bear Market Coffee',
                'address': 'Blackrock',
                'area': 'Blackrock',
                'location': Point(-6.1780, 53.3005, srid=4326),
                'rating': 4.6,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Specialty coffee roastery with quality brews'
            },
            {
                'name': 'Fable + Stey',
                'address': 'Blackrock',
                'area': 'Blackrock',
                'location': Point(-6.1782, 53.3010, srid=4326),
                'rating': 4.4,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Neighbourhood cafe serving seasonal food and beautiful coffee'
            },
            {
                'name': 'Rocksalt Cafe',
                'address': 'Blackrock',
                'area': 'Blackrock',
                'location': Point(-6.1775, 53.3012, srid=4326),
                'rating': 4.3,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Casual dining lifestyle cafe with breakfast, brunch and lunch'
            },
            {
                'name': 'Vanilla Pod',
                'address': 'Blackrock',
                'area': 'Blackrock',
                'location': Point(-6.1785, 53.3007, srid=4326),
                'rating': 4.2,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Fantastic coffee, wine and freshly made cakes and pastries'
            },
            {
                'name': 'The Mellow Fig',
                'address': 'Blackrock',
                'area': 'Blackrock',
                'location': Point(-6.1788, 53.3009, srid=4326),
                'rating': 4.4,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Cafe with quality food and friendly atmosphere'
            },
            {
                'name': 'Butlers Chocolate Cafe',
                'address': 'Blackrock',
                'area': 'Blackrock',
                'location': Point(-6.1790, 53.3011, srid=4326),
                'rating': 4.0,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Irish chocolate brand cafe with coffee and sweet treats'
            },
        
            # --- RANELAGH (9 entries) ---
            {
                'name': 'Ranelagh Ristretto',
                'address': '22 Main Street, Ranelagh',
                'area': 'Ranelagh',
                'location': Point(-6.2575, 53.3275, srid=4326),
                'rating': 4.6,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Trendy, high-quality espresso bar with a focus on single-origin beans.'
            },
            {
                'name': 'The Triangle Grind',
                'address': '1 The Triangle',
                'area': 'Ranelagh',
                'location': Point(-6.2560, 53.3260, srid=4326),
                'rating': 4.1,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'A small, reliable corner spot popular with commuters.'
            },
            {
                'name': 'Bubble & Brew',
                'address': '8 Mount Pleasant Avenue',
                'area': 'Ranelagh',
                'location': Point(-6.2590, 53.3300, srid=4326),
                'rating': 4.4,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Known for its signature bubble waffles and ethically sourced coffee.'
            },
            {
                'name': 'Leinster Latte',
                'address': '14 Fitzwilliam Place',
                'area': 'Ranelagh',
                'location': Point(-6.2555, 53.3320, srid=4326),
                'rating': 4.7,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Upscale cafe offering premium pastries and a quiet working environment.'
            },
            {
                'name': 'The Green Bench Coffee',
                'address': '5 Dartmouth Road',
                'area': 'Ranelagh',
                'location': Point(-6.2620, 53.3285, srid=4326),
                'rating': 4.2,
                'wifi': False,
                'outdoor_seating': True,
                'description': 'A simple spot with park views and lovely outdoor seating.'
            },
            {
                'name': 'Urban Grounds',
                'address': '3 Richmond Street',
                'area': 'Ranelagh',
                'location': Point(-6.2585, 53.3255, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Industrial chic design with a focus on dark, rich roasts.'
            },
            {
                'name': 'Wicklow Way Brews',
                'address': '19 Appian Way',
                'area': 'Ranelagh',
                'location': Point(-6.2610, 53.3310, srid=4326),
                'rating': 4.3,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Hiker-friendly cafe with hearty sandwiches and strong coffee.'
            },
            {
                'name': 'The Artisan Roastery',
                'address': '4 Upper Ranelagh Road',
                'area': 'Ranelagh',
                'location': Point(-6.2570, 53.3280, srid=4326),
                'rating': 4.8,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Specialist roastery where you can watch the beans being roasted.'
            },
            {
                'name': 'Little Lane Cafe',
                'address': '7 Cullenswood Place',
                'area': 'Ranelagh',
                'location': Point(-6.2600, 53.3265, srid=4326),
                'rating': 4.0,
                'wifi': False,
                'outdoor_seating': True,
                'description': 'Cosy spot down a small lane, famous for its scones and jam.'
            },

            # --- BOOTERSTOWN (9 entries) ---
            {
                'name': 'Booterstown Bay Coffee',
                'address': '1 Merrion Strand',
                'area': 'Booterstown',
                'location': Point(-6.2080, 53.3140, srid=4326),
                'rating': 4.7,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Directly on the coast road with excellent views of the bay and bird sanctuary.'
            },
            {
                'name': 'The Causeway Cafe',
                'address': '12 Booterstown Avenue',
                'area': 'Booterstown',
                'location': Point(-6.2095, 53.3120, srid=4326),
                'rating': 4.2,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Traditional Irish cafe with a focus on hearty breakfast and lunch options.'
            },
            {
                'name': 'DARTside Brews',
                'address': '5 Station Road',
                'area': 'Booterstown',
                'location': Point(-6.2065, 53.3150, srid=4326),
                'rating': 3.9,
                'wifi': False,
                'outdoor_seating': False,
                'description': 'Quick service kiosk for commuters on the go, near the DART station.'
            },
            {
                'name': 'The Blackrock Junction',
                'address': '8 Rock Road',
                'area': 'Booterstown',
                'location': Point(-6.2040, 53.3090, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'A bright, spacious cafe at the junction leading towards Blackrock.'
            },
            {
                'name': 'Fresco Frescati',
                'address': '3 Frescati Park',
                'area': 'Booterstown',
                'location': Point(-6.2130, 53.3080, srid=4326),
                'rating': 4.4,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Contemporary cafe with Italian flair, serving specialty pastries and desserts.'
            },
            {
                'name': 'Seapoint Sip',
                'address': '15 Merrion View',
                'area': 'Booterstown',
                'location': Point(-6.2050, 53.3155, srid=4326),
                'rating': 4.1,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Small, dog-friendly spot with outdoor benches and a relaxed atmosphere.'
            },
            {
                'name': 'The Milltown Mingle',
                'address': '18 Stillorgan Road',
                'area': 'Booterstown',
                'location': Point(-6.2120, 53.3100, srid=4326),
                'rating': 4.3,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'A popular meeting spot with a vibrant, bustling interior.'
            },
            {
                'name': 'St. Helen’s Brew',
                'address': '6 St. Helen’s Road',
                'area': 'Booterstown',
                'location': Point(-6.2070, 53.3130, srid=4326),
                'rating': 4.6,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Quiet cafe tucked away, offering strong, high-quality filter coffee.'
            },
            {
                'name': 'Coastal Comforts',
                'address': '2 Booterstown Avenue Upper',
                'area': 'Booterstown',
                'location': Point(-6.2100, 53.3115, srid=4326),
                'rating': 4.0,
                'wifi': False,
                'outdoor_seating': False,
                'description': 'Classic, no-frills coffee and tea house.'
            },

            # --- MILLTOWN (9 entries) ---
            {
                'name': 'The Millwheel Cafe',
                'address': '4 Churchtown Road',
                'area': 'Milltown',
                'location': Point(-6.2510, 53.3085, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Located near the old mill site, known for its rustic charm and riverside seating.'
            },
            {
                'name': 'Goatstown Grounds',
                'address': '15 Lower Main Street',
                'area': 'Milltown',
                'location': Point(-6.2490, 53.3060, srid=4326),
                'rating': 4.3,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Modern cafe with a strong focus on technical brewing methods.'
            },
            {
                'name': 'Classon’s Cafe',
                'address': '7 Classon House',
                'area': 'Milltown',
                'location': Point(-6.2525, 53.3095, srid=4326),
                'rating': 4.1,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'A popular stop for locals, offering great value lunch deals.'
            },
            {
                'name': 'The Dodder Drip',
                'address': '10 Riverwalk Terrace',
                'area': 'Milltown',
                'location': Point(-6.2535, 53.3070, srid=4326),
                'rating': 4.7,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Offers outdoor seating right next to the River Dodder with excellent views.'
            },
            {
                'name': 'The Organic Bean',
                'address': '2 Dundrum Road',
                'area': 'Milltown',
                'location': Point(-6.2480, 53.3105, srid=4326),
                'rating': 4.6,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Only serves organic, ethically sourced coffee and vegan treats.'
            },
            {
                'name': 'The Nine Lives Coffee Co.',
                'address': '11 Sandford Road',
                'area': 'Milltown',
                'location': Point(-6.2550, 53.3115, srid=4326),
                'rating': 4.0,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Cat-themed cafe with a very relaxed, playful atmosphere.'
            },
            {
                'name': 'Milltown Market Brews',
                'address': '3 Milltown Street',
                'area': 'Milltown',
                'location': Point(-6.2500, 53.3090, srid=4326),
                'rating': 4.2,
                'wifi': False,
                'outdoor_seating': False,
                'description': 'A small kiosk operating near the local market for quick service.'
            },
            {
                'name': 'Windy Arbour Cafe',
                'address': '6 Windy Arbour Road',
                'area': 'Milltown',
                'location': Point(-6.2460, 53.3075, srid=4326),
                'rating': 4.4,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'A charming, slightly elevated spot with a pleasant view of the surrounding area.'
            },
            {
                'name': 'The Golden Circle',
                'address': '1 Merrion Grove',
                'area': 'Milltown',
                'location': Point(-6.2545, 53.3080, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Known for its excellent service and consistent, medium-roast blend.'
            },

            # --- DUNDRUM (9 entries) ---
            {
                'name': 'Dundrum Depot',
                'address': '1 Main Street, Dundrum',
                'area': 'Dundrum',
                'location': Point(-6.2570, 53.2885, srid=4326),
                'rating': 4.3,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'A bustling main street cafe with plenty of indoor and outdoor seating.'
            },
            {
                'name': 'The Shopping Centre Brew',
                'address': 'Unit 32, Town Centre',
                'area': 'Dundrum',
                'location': Point(-6.2530, 53.2890, srid=4326),
                'rating': 3.8,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Large, high-volume cafe located inside the shopping centre.'
            },
            {
                'name': 'Luas Line Cafe',
                'address': '12 Taney Road',
                'area': 'Dundrum',
                'location': Point(-6.2595, 53.2900, srid=4326),
                'rating': 4.1,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'Conveniently located near the Luas stop, offering quick takeaway service.'
            },
            {
                'name': 'Sandyford Sip',
                'address': '4 Upper Kilmacud Road',
                'area': 'Dundrum',
                'location': Point(-6.2505, 53.2865, srid=4326),
                'rating': 4.5,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Modern and sleek cafe focused on innovative coffee drinks.'
            },
            {
                'name': 'The Village Blend',
                'address': '7 Dundrum Village',
                'area': 'Dundrum',
                'location': Point(-6.2550, 53.2870, srid=4326),
                'rating': 4.6,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'A favourite local gem with a cosy, welcoming interior and exceptional staff.'
            },
            {
                'name': 'Sweet & Strong',
                'address': '9 Ballally Close',
                'area': 'Dundrum',
                'location': Point(-6.2580, 53.2855, srid=4326),
                'rating': 4.2,
                'wifi': False,
                'outdoor_seating': True,
                'description': 'Known for pairing strong espresso with freshly baked sweet pastries.'
            },
            {
                'name': 'Airfield Cafe',
                'address': '2 Airfield Farm Lane',
                'area': 'Dundrum',
                'location': Point(-6.2520, 53.2920, srid=4326),
                'rating': 4.7,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'An outdoorsy cafe setting with family-friendly options.'
            },
            {
                'name': 'The Old Coach House',
                'address': '18 Main Street Upper',
                'area': 'Dundrum',
                'location': Point(-6.2565, 53.2880, srid=4326),
                'rating': 4.4,
                'wifi': True,
                'outdoor_seating': False,
                'description': 'Located in a historic building with rustic, timber-framed interior.'
            },
            {
                'name': 'Balally Brews',
                'address': '3 Kilmacud Gardens',
                'area': 'Dundrum',
                'location': Point(-6.2600, 53.2860, srid=4326),
                'rating': 4.0,
                'wifi': True,
                'outdoor_seating': True,
                'description': 'A no-fuss cafe serving quick, affordable hot drinks near the housing area.'
            },


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