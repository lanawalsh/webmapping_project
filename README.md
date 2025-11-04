##Web mapping assignment</H1>

# Table of Contents

1. Introduction & Project Overview
2. System Architecture & Technology Stack
3. Database Design & Spatial Data Management
4. Backend Implementation (Django MVC
5. API Design & RESTful Endpoints
6. Frontend Development & User Interface
7. Spatial Query Implementation
8. Security Considerations

# Introduction & Project Overview
<p>The application implements three primary spatial operations</p>

1. Proximity Search (K-Nearest Neighbors): Finds the N nearest coffee shops to any point on the map, ranked by distance
2. Radius Search (Buffer Query): Discovers all coffee shops within a user-defined circular area
3. Distance Calculation: Measures the precise distance between any two coffee shop locations

<p>Technical Requirements Met</p>
1. PostgreSQL/PostGIS spatial database implementation
2. Django MVC architecture
3. RESTful API design
4. Responsive Bootstrap 5 interface
5. Leaflet.js mapping integration
6. Cross-platform compatibility
7. local deployment capability

#2. System Architecture & Technology Stack
<p> Overall Architecture
The application follows a three-tier architecture</p>
<p>Presentation Layer</p>
- HTML5, CSS3, JavaScript
- Bootstrap 5 for responsive design
- Leaflet.js for interactive mapping
- Font Awesome for icons

<p>Application layer</p>
- Django 4.2+ web framework
- Django REST Framework for API
- GeoDjango for spatial operations
- Python 3.9.6

<p>Data Layer</p>
- PostgreSQL 17
- PostGIS
- Spatial indexing
<p>PostgreSQL/PostGIS: spatial data support, including advanced geometry operations, spatial indexing, and distance calculations. PostGIS provides SQL functions like ST_Distance, ST_DWithin, and ST_Within that are essential for location-based queries.
</p>
<p>Django/GeoDjango: clean MVC architecture with built-in spatial database support.
</p>
<p>Leaflet.js: lightweight, extensive documentation, and mobile-friendly design. Leaflet is open-source and works  with OpenStreetMap tiles.
</p>
<p>Bootstrap 5: Ensures responsive design with minimal custom CSS, providing a consistent user experience across devices without requiring extensive frontend framework knowledge.
</p>

#Database Design & Spatial Data Management
<p>The core data model revolves around the CoffeeShop table, which stores both traditional attributes and spatial geometry
</p>
<img width="278" height="198" alt="image" src="https://github.com/user-attachments/assets/52e2ee78-da9c-4a88-9a3b-63aef53d41ba" />

<p>The application includes 16 coffee shops across Dublin set up like this 
</p>

<p>A Django management command (load_coffee_shops.py) populates the database</p>
<code>python manage.py load_coffee_shops </code>

<p>this command Reads structured Python data
Creates PostGIS Point geometries
Uses get_or_create() to prevent duplicates
Provides console feedback on success/failure
</p>
<p>The application follows Django's MTV (Model-Template-View) pattern, which is Django's implementation of MVC
</p>
<code>Model (models.py)
class CoffeeShop(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=300)
    area = models.CharField(max_length=100)
    location = models.PointField(srid=4326)
    rating = models.DecimalField(max_digits=2, decimal_places=1, 
                                  null=True, blank=True)
    description = models.TextField(blank=True)
    wifi = models.BooleanField(default=False)
    outdoor_seating = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def latitude(self):
        return self.location.y if self.location else None
    
    @property
    def longitude(self):
        return self.location.x if self.location else None
</code>
<p>Key Model Features:

Uses models.PointField from GeoDjango for spatial data
Includes property methods for convenient coordinate access
Provides automatic timestamp management
Implements __str__ for admin interface readability

</p>

<code>views (views.py)
Django views handle HTTP requests and orchestrate data retrieval
@api_view(['POST'])
@csrf_exempt
def find_nearest_coffee(request):
    data = request.data
    lat = float(data.get('lat'))
    lng = float(data.get('lng'))
    limit = int(data.get('limit', 5))
    
    search_point = Point(lng, lat, srid=4326)
    
    nearest_shops = CoffeeShop.objects.annotate(
        distance=Distance('location', search_point)
    ).order_by('distance')[:limit]
</code>

### Templates (map.html)
<p>The template layer provides the HTML structure and includes JavaScript for interactivity. Django's template engine allows for dynamic content rendering, though this application primarily uses client-side rendering via JavaScript.</p>

### URL Configuration
<p>Django's URL dispatcher maps URLs to views</p>
<code>urlpatterns = [
    path('', views.map_view, name='map'),
    path('api/all/', views.all_coffee_shops, name='all_shops'),
    path('api/nearest/', views.find_nearest_coffee, name='nearest'),
    path('api/radius/', views.coffee_within_radius, name='radius'),
    path('api/distance/<int:shop1_id>/<int:shop2_id>/', 
         views.distance_between_shops, name='distance_between'),
]
</code>

<p>URL Design Principles:

RESTful conventions (resources as nouns)
Clear, descriptive endpoint names
Consistent URL structure
URL parameters for resource identification

</p>

### 
Django Settings Configuration
<p>INSTALLED_APPS = [
    'django.contrib.gis',  # GeoDjango
    'rest_framework',      # API framework
    'corsheaders',         # Cross-origin support
    'coffee_shops',        # Application
]

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'coffee_db',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

</p>

# API Design & RESTful Endpoints
## API Architecture
<p>The application exposes a RESTful API using Django REST Framework, following REST principles:
</p>
1. Stateless: Each request contains all necessary information
2. Resource-based: URLs represent resources (coffee shops)
3. Standard HTTP methods: GET for retrieval, POST for searches
4. JSON format: Consistent data exchange format

### Endpoint Documentation
<p>Get All Coffee Shops</p>
- GET /coffee/api/all/
-  Response Format

<code>
  {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-6.2603, 53.3498]
      },
      "properties": {
        "id": 1,
        "name": "3fe Coffee",
        "address": "32 Grand Canal Street Lower",
        "area": "Grand Canal Dock",
        "rating": 4.6,
        "wifi": true,
        "outdoor_seating": false
      }
    }
  ]
}
</code>
<p>Find Nearest Coffee Shops</p>
- POST /coffee/api/nearest/
<p>request</p>
<code>
  {
  "lat": 53.3498,
  "lng": -6.2603,
  "limit": 5
}
</code>
<p>responce</p>
<code> 
  {
  "search_point": {"lat": 53.3498, "lng": -6.2603},
  "total_found": 5,
  "nearest_shops": [
    {
      "rank": 1,
      "id": 5,
      "name": "Cloud Picker Coffee",
      "address": "Bachelors Walk",
      "area": "Temple Bar",
      "coordinates": {"lat": 53.3469, "lng": -6.2658},
      "distance_km": 0.42,
      "distance_m": 420,
      "rating": 4.4
    }
  ]

</code>
<p>SQL Query Generated</p>
<code>sqlSELECT *, ST_Distance(location::geography, 
       ST_SetSRID(ST_MakePoint(-6.2603, 53.3498), 4326)::geography) as distance
FROM coffee_shops_coffeeshop
ORDER BY distance
LIMIT 5;
</code>

### API Security Considerations
<p>CSRF Protection</p>
<code>@csrf_exempt  # For development
def api_view(request):
    # In production, use proper CSRF tokens
    pass</code>

<p>
CORS Configuration</p>
<code>CORS_ALLOW_ALL_ORIGINS = True  # Development only
# Production should whitelist specific origins
</code>


#6.Frontend Development & User Interface
<p>The interface uses Bootstrap 5's grid system and components for responsive layout
</p>
<code><div class="container-fluid">
  <div class="row">
    <div class="col-12">
      <!-- Map container -->
    </div>
  </div>
</div>
</code>
### Responsive Breakpoints:
Desktop (>992px): Full control panel and results sidebar
Tablet (768-992px): Stacked controls, optimized map
Mobile (<768px): Touch-optimized buttons, full-screen map
</p>
    
###  Bootstrap Components Used
- Navigation bar for branding
- Form controls for user input
- Cards for results display
- Alerts for notifications
- Buttons with icon integration

### Leaflet.js Map Integration
<p>Map Initialization</p>
<code>const map = L.map('map').setView([53.3498, -6.2603], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);
</code>

### Layer Management:
<p> The application uses separate layers for different marker types:
<code> const coffeeLayer = L.layerGroup().addTo(map);  // Brown coffee icons
const searchLayer = L.layerGroup().addTo(map);  // Search results</code>


### Custom Markers:
<p> Coffee shop markers use custom div icons:
<code> const icon = L.divIcon({
    className: 'coffee-marker',
    html: '<div class="coffee-icon"><i class="fas fa-mug-hot"></i></div>',
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5]
});
</code>

### Result markers are numbered for easy identification
<code> const marker = L.divIcon({
    html: `<div class="nearest-marker">${rank}</div>`,
    iconSize: [28, 28]
});</code>

### User Interface Components
<p>Control Panel</p>
- Mode selector dropdown (Nearest/Radius/Distance)
- Dynamic settings based on selected mode
- Input validation feedback
- Clear results button

<p>Results Panel </p>
- Collapsible sidebar
- Scrollable results list
- Click-to-zoom functionality 
- Distance badges for quick reference

<p>Visual Feedback</p>
- Loading states during API calls
- Error alerts for invalid input
- Success notifications
- Animated markers for search points

### JavaScript Architecture
<code> document.getElementById('search-mode').addEventListener('change', (e) => {
    currentMode = e.target.value;
    updateUI();
});

map.on('click', (e) => {
    handleMapClick(e.latlng.lat, e.latlng.lng);
});


Asynchronous API Calls
async function findNearest(lat, lng) {
    try {
        const response = await fetch('/coffee/api/nearest/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({lat, lng, limit: 5})
        });
        
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

</code>

### State Management
<code> let currentMode = 'nearest';
let distanceModeShops = [];
let radiusCircle = null;</code>

### Accessibility Features- ARIA Labels
<code> 
<button aria-label="Find nearest coffee shops">
    Search
</button>
</code>

# Spatial Query Implementation
### Proximity Search (K-Nearest Neighbors)
<code>
search_point = Point(lng, lat, srid=4326)

nearest_shops = CoffeeShop.objects.annotate(
    distance=Distance('location', search_point)
).order_by('distance')[:limit]
</code>

<p>
    How It Works
</p>
 1. User clicks on map, providing coordinates
2.  JavaScript sends POST request with lat/lng
3. Django creates PostGIS Point geometry
4. Distance() function annotates each shop with calculated distance
5. Results ordered by distance
6. Response includes distance in km and meters
<p>Visual Representation</p>
- Red marker at search point
- Green numbered markers for results
- Results sorted by proximity in sidebar


### Radius Search (Buffer Query)
<code>search_point = Point(lng, lat, srid=4326)

shops_in_radius = CoffeeShop.objects.filter(
    location__distance_lte=(search_point, D(km=radius_km))
).annotate(
    distance=Distance('location', search_point)
).order_by('distance')</code>

<p>
    How It Works:
</p>
1. User specifies radius
2. User clicks map for center point
3. PostGIS creates circular buffer zone
4. ST_DWithin() tests if shop locations fall within buffer
5. Results include all shops meeting criteria
6. Sorted by distance from center

<p>Visual Representation</p>
- Green circle overlay showing search radius
- Red center marker
- Blue numbered markers for shops within radius

### Distance Calculation Between Two Points
<code>shop1 = CoffeeShop.objects.get(id=shop1_id)
shop2 = CoffeeShop.objects.get(id=shop2_id)

distance_degrees = shop1.location.distance(shop2.location)
distance_km = distance_degrees * 111.32  # Convert to kilometers</code>

<p>How it works</p>
1. User clicks first coffee shop marker
2. Application stores first selection
3. User clicks second coffee shop marker
4. API call with both shop IDs
5. PostGIS calculates geodesic distance
6. Response includes multiple units (km, m, miles)
<p>Visual Representation</p>
- Dashed red line connecting two shops
- Distance displayed in popup






