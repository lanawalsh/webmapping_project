# Web Mapping Assignment

## Table of Contents

1. [Introduction & Project Overview](#introduction--project-overview)
2. [System Architecture & Technology Stack](#system-architecture--technology-stack)
3. [Database Design & Spatial Data Management](#database-design--spatial-data-management)
4. [Backend Implementation (Django MVC)](#backend-implementation-django-mvc)
5. [API Design & RESTful Endpoints](#api-design--restful-endpoints)
6. [Frontend Development & User Interface](#frontend-development--user-interface)
7. [Spatial Query Implementation](#spatial-query-implementation)
8. [Security Considerations](#security-considerations)

---

## 1. Introduction & Project Overview

The application implements three primary spatial operations:

1. **Proximity Search (K-Nearest Neighbors):** Finds the N nearest coffee shops to any point on the map, ranked by distance
2. **Radius Search (Buffer Query):** Discovers all coffee shops within a user-defined circular area
3. **Distance Calculation:** Measures the precise distance between any two coffee shop locations

### Technical Requirements Met

1. PostgreSQL/PostGIS spatial database implementation
2. Django MVC architecture
3. RESTful API design
4. Responsive Bootstrap 5 interface
5. Leaflet.js mapping integration
6. Cross-platform compatibility
7. Local deployment capability
8. Docker containers for each teir

---

## 2. System Architecture & Technology Stack

### Overall Architecture

The application follows a three-tier architecture:

#### Presentation Layer

- HTML5, CSS3, JavaScript
- Bootstrap 5 for responsive design
- Leaflet.js for interactive mapping
- Font Awesome for icons

#### Application Layer

- Django 4.2+ web framework
- Django REST Framework for API
- GeoDjango for spatial operations
- Python 3.9.6

#### Data Layer

- PostgreSQL 17
- PostGIS
- Spatial indexing

### Technology Justification

**PostgreSQL/PostGIS:** Provides spatial data support, including advanced geometry operations, spatial indexing, and distance calculations. PostGIS provides SQL functions like `ST_Distance`, `ST_DWithin`, and `ST_Within` that are essential for location-based queries.

**Django/GeoDjango:** Offers clean MVC architecture with built-in spatial database support.

**Leaflet.js:** Lightweight, extensive documentation, and mobile-friendly design. Leaflet is open-source and works with OpenStreetMap tiles.

**Bootstrap 5:** Ensures responsive design with minimal custom CSS, providing a consistent user experience across devices without requiring extensive frontend framework knowledge.

---

## 3. Database Design & Spatial Data Management

The core data model revolves around the `CoffeeShop` table, which stores both traditional attributes and spatial geometry.

![Database Schema](https://github.com/user-attachments/assets/52e2ee78-da9c-4a88-9a3b-63aef53d41ba)

### Sample Data Structure

The application includes 100 coffee shops across Dublin set up like this:
```python
{
    'name': '3fe Coffee',
    'address': '32 Grand Canal Street Lower',
    'area': 'Grand Canal Dock',
    'location': Point(-6.2405, 53.3361, srid=4326),
    'rating': 4.6,
    'wifi': True,
    'outdoor_seating': False,
    'description': 'Specialty coffee roaster with excellent espresso'
}
```

### Data Population

A Django management command (`load_coffee_shops.py`) populates the database:
```bash
python manage.py load_coffee_shops
```

This command:
- Reads structured Python data
- Creates PostGIS Point geometries
- Uses `get_or_create()` to prevent duplicates
- Provides console feedback on success/failure

---

## 4. Backend Implementation (Django MVC)

The application follows Django's MTV (Model-Template-View) pattern, which is Django's implementation of MVC.

### Model (models.py)
```python
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
```

**Key Model Features:**
- Uses `models.PointField` from GeoDjango for spatial data
- Includes property methods for convenient coordinate access
- Provides automatic timestamp management
- Implements `__str__` for admin interface readability

### Views (views.py)

Django views handle HTTP requests and orchestrate data retrieval:
```python
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
```

### Templates (map.html)

The template layer provides the HTML structure and includes JavaScript for interactivity. Django's template engine allows for dynamic content rendering, though this application primarily uses client-side rendering via JavaScript.

### URL Configuration

Django's URL dispatcher maps URLs to views:
```python
urlpatterns = [
    path('', views.map_view, name='map'),
    path('api/all/', views.all_coffee_shops, name='all_shops'),
    path('api/nearest/', views.find_nearest_coffee, name='nearest'),
    path('api/radius/', views.coffee_within_radius, name='radius'),
    path('api/distance///', 
         views.distance_between_shops, name='distance_between'),
]
```

**URL Design Principles:**
- RESTful conventions (resources as nouns)
- Clear, descriptive endpoint names
- Consistent URL structure
- URL parameters for resource identification

### Django Settings Configuration
```python
INSTALLED_APPS = [
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
```

---

## 5. API Design & RESTful Endpoints

### API Architecture

The application exposes a RESTful API using Django REST Framework, following REST principles:

1. **Stateless:** Each request contains all necessary information
2. **Resource-based:** URLs represent resources (coffee shops)
3. **Standard HTTP methods:** GET for retrieval, POST for searches
4. **JSON format:** Consistent data exchange format

### Endpoint Documentation

#### Get All Coffee Shops

**Endpoint:** `GET /coffee/api/all/`

**Response Format:**
```json
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
```

#### Find Nearest Coffee Shops

**Endpoint:** `POST /coffee/api/nearest/`

**Request:**
```json
{
  "lat": 53.3498,
  "lng": -6.2603,
  "limit": 5
}
```

**Response:**
```json
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
}
```

**SQL Query Generated:**
```sql
SELECT *, ST_Distance(location::geography, 
       ST_SetSRID(ST_MakePoint(-6.2603, 53.3498), 4326)::geography) as distance
FROM coffee_shops_coffeeshop
ORDER BY distance
LIMIT 5;
```

### API Security Considerations

#### CSRF Protection
```python
@csrf_exempt  # For development
def api_view(request):
    # In production, use proper CSRF tokens
    pass
```

#### CORS Configuration
```python
CORS_ALLOW_ALL_ORIGINS = True  # Development only
# Production should whitelist specific origins
```

---

## 6. Frontend Development & User Interface

The interface uses Bootstrap 5's grid system and components for responsive layout:
```html

  
    
      
    
  

```

### Responsive Breakpoints

- **Desktop (>992px):** Full control panel and results sidebar
- **Tablet (768-992px):** Stacked controls, optimized map
- **Mobile (<768px):** Touch-optimized buttons, full-screen map

### Bootstrap Components Used

- Navigation bar for branding
- Form controls for user input
- Cards for results display
- Alerts for notifications
- Buttons with icon integration

### Leaflet.js Map Integration

#### Map Initialization
```javascript
const map = L.map('map').setView([53.3498, -6.2603], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);
```

#### Layer Management

The application uses separate layers for different marker types:
```javascript
const coffeeLayer = L.layerGroup().addTo(map);  // Brown coffee icons
const searchLayer = L.layerGroup().addTo(map);  // Search results
```

#### Custom Markers

Coffee shop markers use custom div icons:
```javascript
const icon = L.divIcon({
    className: 'coffee-marker',
    html: '',
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5]
});
```

Result markers are numbered for easy identification:
```javascript
const marker = L.divIcon({
    html: `${rank}`,
    iconSize: [28, 28]
});
```

### User Interface Components

#### Control Panel

- Mode selector dropdown (Nearest/Radius/Distance)
- Dynamic settings based on selected mode
- Input validation feedback
- Clear results button

#### Results Panel

- Collapsible sidebar
- Scrollable results list
- Click-to-zoom functionality
- Distance badges for quick reference

#### Visual Feedback

- Loading states during API calls
- Error alerts for invalid input
- Success notifications
- Animated markers for search points

### JavaScript Architecture
```javascript
document.getElementById('search-mode').addEventListener('change', (e) => {
    currentMode = e.target.value;
    updateUI();
});

map.on('click', (e) => {
    handleMapClick(e.latlng.lat, e.latlng.lng);
});
```

#### Asynchronous API Calls
```javascript
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
```

#### State Management
```javascript
let currentMode = 'nearest';
let distanceModeShops = [];
let radiusCircle = null;
```

#### Accessibility Features - ARIA Labels
```html

    Search

```

---

## 7. Spatial Query Implementation

### Proximity Search (K-Nearest Neighbors)
```python
search_point = Point(lng, lat, srid=4326)

nearest_shops = CoffeeShop.objects.annotate(
    distance=Distance('location', search_point)
).order_by('distance')[:limit]
```

**How It Works:**

1. User clicks on map, providing coordinates
2. JavaScript sends POST request with lat/lng
3. Django creates PostGIS Point geometry
4. `Distance()` function annotates each shop with calculated distance
5. Results ordered by distance
6. Response includes distance in km and meters

**Visual Representation:**
- Red marker at search point
- Green numbered markers for results
- Results sorted by proximity in sidebar

### Radius Search (Buffer Query)
```python
search_point = Point(lng, lat, srid=4326)

shops_in_radius = CoffeeShop.objects.filter(
    location__distance_lte=(search_point, D(km=radius_km))
).annotate(
    distance=Distance('location', search_point)
).order_by('distance')
```

**How It Works:**

1. User specifies radius
2. User clicks map for center point
3. PostGIS creates circular buffer zone
4. `ST_DWithin()` tests if shop locations fall within buffer
5. Results include all shops meeting criteria
6. Sorted by distance from center

**Visual Representation:**
- Green circle overlay showing search radius
- Red center marker
- Blue numbered markers for shops within radius

### Distance Calculation Between Two Points
```python
shop1 = CoffeeShop.objects.get(id=shop1_id)
shop2 = CoffeeShop.objects.get(id=shop2_id)

distance_degrees = shop1.location.distance(shop2.location)
distance_km = distance_degrees * 111.32  # Convert to kilometers
```

**How It Works:**

1. User clicks first coffee shop marker
2. Application stores first selection
3. User clicks second coffee shop marker
4. API call with both shop IDs
5. PostGIS calculates geodesic distance
6. Response includes multiple units (km, m, miles)

**Visual Representation:**
- Dashed red line connecting two shops
- Distance displayed in popup

---

## Advanced Filtering System

### Overview
The application features a sophisticated multi-criteria filtering system that allows users to refine coffee shop results in real-time based on rating, WiFi availability, and outdoor seating.

### Architecture

**Filter State Management:**
```javascript
let activeFilters = {
    minRating: 0,
    wifi: false,
    outdoorSeating: false
};
```

**Real-time Filter Application:**
```javascript
function applyFilters() {
    coffeeLayer.clearLayers();
    let filteredShops = allCoffeeShops.filter(feature => {
        const props = feature.properties;
        
        // Rating filter
        if (props.rating && props.rating < activeFilters.minRating) {
            return false;
        }
        
        // WiFi filter
        if (activeFilters.wifi && !props.wifi) {
            return false;
        }
        
        // Outdoor seating filter
        if (activeFilters.outdoorSeating && !props.outdoor_seating) {
            return false;
        }
        
        return true;
    });
    
    // Display filtered results
    filteredShops.forEach(feature => addCoffeeMarker(feature));
    updateFilterCount(filteredShops.length);
}
```

### User Interface Components

**Filter Controls:**
```html

    
        All Ratings
        3.0+ Stars
        3.5+ Stars
        4.0+ Stars
        4.5+ Stars
    
    
     WiFi
     Outdoor Seating
    
    100 shops match your filters

```

### Key Features
- **Real-time Updates:** Filters apply instantly without page reload
- **Cumulative Filtering:** Multiple filters work together (AND logic)
- **Visual Feedback:** Counter shows number of matching shops
- **State Persistence:** Filter selections persist during session
- **Integration:** Works seamlessly with search functions

### Technical Implementation

**Event Handling:**
```javascript
document.getElementById('rating-filter').addEventListener('change', function() {
    activeFilters.minRating = parseFloat(this.value);
    applyFilters();
});

document.getElementById('wifi-filter').addEventListener('change', function() {
    activeFilters.wifi = this.checked;
    applyFilters();
});

document.getElementById('outdoor-filter').addEventListener('change', function() {
    activeFilters.outdoorSeating = this.checked;
    applyFilters();
});
```
<br>


## Interactive Neighborhood Boundaries

### Overview
Clickable polygon overlays representing Dublin neighborhoods, enabling users to filter coffee shops by geographic area and visualize neighborhood density.

### GeoJSON Data Structure

```javascript
const dublinNeighborhoods = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Temple Bar",
                "area_code": "D02",
                "color": "#e74c3c",
                "description": "Cultural quarter & nightlife"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-6.2670, 53.3450],
                    [-6.2620, 53.3450],
                    [-6.2620, 53.3475],
                    [-6.2670, 53.3475],
                    [-6.2670, 53.3450]
                ]]
            }
        }
        // ... 23 more neighborhoods
    ]
};
```

### Implementation

**Polygon Rendering:**
```javascript
function initializeNeighborhoods() {
    neighborhoodsLayer = L.geoJSON(dublinNeighborhoods, {
        style: function(feature) {
            return {
                fillColor: feature.properties.color,
                weight: 2,
                opacity: 1,
                color: feature.properties.color,
                fillOpacity: 0.2
            };
        },
        onEachFeature: function(feature, layer) {
            const props = feature.properties;
            
            // Hover effects
            layer.on('mouseover', function() {
                layer.setStyle({fillOpacity: 0.4});
            });
            
            layer.on('mouseout', function() {
                layer.setStyle({fillOpacity: 0.2});
            });
            
            // Click to filter
            layer.on('click', function() {
                filterByNeighborhood(props.name, layer.getBounds());
            });
            
            // Popup with details
            layer.bindPopup(`
                ${props.name}
                Area Code: ${props.area_code}
                ${props.description}
                
                    Plan Walking Route
                
            `);
        }
    }).addTo(map);
}
```

**Spatial Filtering:**
```javascript
function filterByNeighborhood(neighborhoodName, bounds) {
    coffeeLayer.clearLayers();
    
    const shopsInNeighborhood = allCoffeeShops.filter(feature => {
        const coords = feature.geometry.coordinates;
        const latLng = L.latLng(coords[1], coords[0]);
        return bounds.contains(latLng);
    });
    
    shopsInNeighborhood.forEach(feature => addCoffeeMarker(feature));
    
    // Fit map to neighborhood
    map.fitBounds(bounds);
    
    updateFilterCount(shopsInNeighborhood.length);
}
```

### Coverage
- **Neighborhoods:** Complete Dublin metropolitan area
- **City Center:** Temple Bar, Portobello
- **South Dublin:** Ballsbridge, Ranelagh, Rathmines, Dundrum
- **Coastal:** Blackrock, Dun Laoghaire
- **North Dublin:** Stoneybatter, Phibsborough

---
---

## Walking Route Optimization

### Overview
Advanced route planning feature that calculates the optimal walking path through multiple coffee shops using a Traveling Salesman Problem (TSP) approximation algorithm.

### Algorithm: Nearest Neighbor Heuristic

**Implementation:**
```javascript
function calculateOptimalRoute(shops) {
    if (shops.length === 0) return [];
    
    const unvisited = [...shops];
    const route = [];
    let current = unvisited[0]; // Start at first shop
    
    route.push(current);
    unvisited.shift();
    
    // Greedy nearest neighbor
    while (unvisited.length > 0) {
        let nearest = null;
        let minDistance = Infinity;
        let nearestIndex = -1;
        
        // Find closest unvisited shop
        unvisited.forEach((shop, index) => {
            const distance = calculateDistance(
                current.geometry.coordinates,
                shop.geometry.coordinates
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearest = shop;
                nearestIndex = index;
            }
        });
        
        route.push(nearest);
        current = nearest;
        unvisited.splice(nearestIndex, 1);
    }
    
    return route;
}
```

**Distance Calculation (Haversine Formula):**
```javascript
function calculateDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in km
    const lat1 = coord1[1] * Math.PI / 180;
    const lat2 = coord2[1] * Math.PI / 180;
    const deltaLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const deltaLng = (coord2[0] - coord1[0]) * Math.PI / 180;
    
    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c; // Distance in km
}
```

### Route Visualization

**Display Route on Map:**
```javascript
function displayRoute(route) {
    // Clear previous route
    if (routeLine) map.removeLayer(routeLine);
    if (routeMarkers) routeMarkers.clearLayers();
    
    // Create coordinate array
    const coordinates = route.map(shop => [
        shop.geometry.coordinates[1],
        shop.geometry.coordinates[0]
    ]);
    
    // Draw blue dashed line
    routeLine = L.polyline(coordinates, {
        color: '#3498db',
        weight: 3,
        dashArray: '10, 10',
        opacity: 0.8
    }).addTo(map);
    
    // Add numbered markers
    routeMarkers = L.layerGroup().addTo(map);
    route.forEach((shop, index) => {
        const marker = L.marker([
            shop.geometry.coordinates[1],
            shop.geometry.coordinates[0]
        ], {
            icon: L.divIcon({
                className: 'route-marker',
                html: `${index + 1}`,
                iconSize: [30, 30]
            })
        });
        
        marker.bindPopup(`
            Stop ${index + 1}
            ${shop.properties.name}
            ${shop.properties.address}
        `);
        
        routeMarkers.addLayer(marker);
    });
    
    // Fit map to route
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
}
```

### Route Information Panel

```javascript
function displayRouteInfo(route) {
    let totalDistance = 0;
    let html = '';
    html += `Optimal Walking Route`;
    html += `${route.length} stops`;
    
    // Calculate segments
    for (let i = 0; i < route.length - 1; i++) {
        const segmentDistance = calculateDistance(
            route[i].geometry.coordinates,
            route[i + 1].geometry.coordinates
        );
        totalDistance += segmentDistance;
        
        html += `
            
                ${i + 1} → ${i + 2}
                
                    ${route[i].properties.name} to 
                    ${route[i + 1].properties.name}
                
                ${segmentDistance.toFixed(2)} km
            
        `;
    }
    
    // Total distance and time
    const walkingSpeed = 5; // km/h
    const totalTime = (totalDistance / walkingSpeed) * 60; // minutes
    
    html += `
        
            Total Distance: ${totalDistance.toFixed(2)} km
            Estimated Time: ${Math.round(totalTime)} minutes
            Walking speed: ${walkingSpeed} km/h
        
    `;
    
    html += `Export Route`;
    html += '';
    
    document.getElementById('route-panel').innerHTML = html;
}
```



- **Optimization:** Near-optimal solution in <1 second for typical use cases
- **Limitations:** Not guaranteed to find absolute optimal route (NP-hard problem)

---

### Design Patterns Applied

**1. Module Pattern:**
```javascript
// Each feature in its own file
const FilterSystem = (function() {
    // Private variables
    let activeFilters = {};
    
    // Public API
    return {
        init: function() { /* ... */ },
        applyFilters: function() { /* ... */ },
        reset: function() { /* ... */ }
    };
})();
```

**2. Observer Pattern:**
```javascript
// Event-driven architecture
map.on('click', handleMapClick);
document.getElementById('filter').addEventListener('change', applyFilters);
```

**3. Separation of Concerns:**
- **Data Layer:** API calls, localStorage
- **Business Logic:** Filtering, routing algorithms
- **Presentation:** DOM manipulation, UI updates

---
## Docker Containerization
### Architecture

```
┌─────────────────────────────────────────────┐
│  Internet (Port 80)                         │
└───────────────┬─────────────────────────────┘
                │
        ┌───────▼────────
        │   Nginx        │  
        │   Port: 80     │  Static Files
        └───────┬────────┘
                │
        ┌───────▼────────┐
        │   Django       │  Web Application
        │   Port: 8000   │  
        └───────┬────────┘
                │
    ┌───────────┴───────────┐
    │                       │
┌───▼─────┐         ┌──────▼──────┐
│PostGIS  │         │  PgAdmin    │
│Port:5432│◄────────┤  Port:5050  │
└─────────┘         └─────────────┘
 Database            Management

```
![Screenshot 2025-12-08 233342](https://github.com/user-attachments/assets/fe905fdc-c0c2-44ea-bd70-5d17a25f314c)

---
### Docker Compose Configuration

```yaml
version: '3.8'

services:
  # PostGIS Database
  postgis:
    image: postgis/postgis:15-3.4
    container_name: coffee_postgis
    restart: unless-stopped
    environment:
      POSTGRES_DB: webmapping_db1
      POSTGRES_USER: webmapping1
      POSTGRES_PASSWORD: awm123
      POSTGRES_HOST_AUTH_METHOD: trust
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - coffee_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U webmapping1 -d webmapping_db1"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Django Application
  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: coffee_django
    restart: unless-stopped
    command: >
      sh -c "python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             gunicorn --bind 0.0.0.0:8000 --workers 3 
                     webmapping_project.wsgi:application"
    environment:
      - DATABASE_URL=postgis://webmapping1:awm123@postgis:5432/webmapping_db1
      - DEBUG=False
      - SECRET_KEY=${SECRET_KEY}
      - ALLOWED_HOSTS=*
    volumes:
      - ./staticfiles:/app/staticfiles
      - ./media:/app/media
    ports:
      - "8000:8000"
    networks:
      - coffee_network
    depends_on:
      postgis:
        condition: service_healthy

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: coffee_nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./staticfiles:/usr/share/nginx/html/static:ro
      - ./media:/usr/share/nginx/html/media:ro
    networks:
      - coffee_network
    depends_on:
      - web

  # PgAdmin
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: coffee_pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@coffeefinder.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    ports:
      - "5050:80"
    networks:
      - coffee_network

volumes:
  postgres_data:
  pgadmin_data:

networks:
  coffee_network:
    driver: bridge
```

### Dockerfile

```dockerfile


# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gdal-bin \
    libgdal-dev \
    python3-gdal \
    binutils \
    libproj-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", 
     "webmapping_project.wsgi:application"]
```

### Nginx Configuration

```nginx
upstream django {
    server web:8000;
}

server {
    listen 80;
    server_name localhost;
    
    # Static files
    location /static/ {
        alias /usr/share/nginx/html/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias /usr/share/nginx/html/media/;
        expires 7d;
    }

    # Proxy to Django
    location / {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Deployment Commands

```bash
# Build containers
docker-compose build

# Start services
docker-compose up -d

# Run migrations
docker-compose exec web python manage.py migrate

# Create superuser
docker-compose exec web python manage.py createsuperuser

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```
![Screenshot 2025-12-08 233403](https://github.com/user-attachments/assets/e1e28331-8a24-4024-aec0-a2406deda4ef)
![Screenshot 2025-12-08 234301](https://github.com/user-attachments/assets/f26f0c5a-9d8c-4abd-a3e8-f9061e5d58b8)
![Screenshot 2025-12-10 110049](https://github.com/user-attachments/assets/c0ce76d9-60a8-44b7-a234-84cd7a9dd870)



---
## AWS ECS Deployment
I attempted two strategies for cloud deployment 
1. ECS (Fargate) + ECR
2. EC2 Instance

## AWS ECS Deployment

I attempted two strategies for cloud deployment to gain hands-on experience with different AWS deployment architectures and understand the trade-offs between serverless container orchestration and traditional virtual machine hosting.

### Deployment Strategy 1: ECS (Fargate) + ECR

#### What I Attempted
I built a Docker image locally → pushed it to Amazon Elastic Container Registry (ECR) → created an ECS cluster → deployed the application using AWS Fargate serverless compute.

#### Goal
To run the containerized application as a serverless task and access it through a browser without managing underlying infrastructure.

#### What Didn't Work

**Issue 1: No Public-Facing Access**
Even though the task was running successfully, I could not reach it through its public IP because:

Fargate tasks require one of the following for external access:
- An **Application Load Balancer (ALB)** or **Network Load Balancer (NLB)**, or
- A **security group** that explicitly allows inbound traffic on the application port, **and**
- A **public subnet** with a correct routing table pointing to an Internet Gateway


** Attemplted fixes **
- I tried to trouble shoot as much as possible
- ** Verified Security Group Rules
-  ** Checked Network ACL (NACL) Configuration
-  ** Verified Route Table Functionality
-  ** Confirmed the Instance Had a Public IP

**Result:**
- Connection timeouts when attempting to access the task's public IP
- `ERR_CONNECTION_TIMED_OUT` in browser
- No response from `curl` or `telnet` commands

![Screenshot 2025-12-09 012117](https://github.com/user-attachments/assets/74505d82-a155-4ba0-807e-275b81908724)
![Screenshot 2025-12-09 012136](https://github.com/user-attachments/assets/b2481756-2697-45d1-a819-81ea0daa56c7)
![Screenshot 2025-12-09 013111](https://github.com/user-attachments/assets/a71de8a0-ab56-497b-ac1c-69dbe582cb61)
![Screenshot 2025-12-09 013453](https://github.com/user-attachments/assets/b80f2895-f3b2-40d0-bc37-f00cdec28d2c)



![Screenshot 2025-12-09 012845](https://github.com/user-attachments/assets/59d7f5b2-3b68-4f75-bb25-cc7260e3aa2a)


---

### Deployment Strategy 2: EC2 Instance (Manual Deployment)

#### What I Attempted
I launched an Amazon EC2 instance, SSH'd into the virtual machine, and attempted to install required packages using `yum` and deploy the application manually.

#### Goal
Run the application directly on an EC2 virtual machine instead of using Fargate's serverless container platform.

#### What Went Wrong

**Issue: SSH Connection Timed Out**

Despite configuring SSH access in the security group, I could not connect via:
```bash
ssh -i key.pem ec2-user@PUBLIC_IP
```

**Root Causes:**
The EC2 instance was launched in the ECS-created VPC, and the subnets were **private**, meaning:

1. **No Internet Gateway** attached to the VPC
2. **No public route** to `0.0.0.0/0` in the subnet's route table
3. **No functional public IPv4 address** or it was assigned but non-routable
4. **Private instances cannot receive external SSH traffic** without:
   - A bastion host (jump server) in a public subnet, or
   - AWS Systems Manager Session Manager, or
   - A VPN/Direct Connect connection to the VPC
  

** Attemplted fixes **
- I tried to trouble shoot as much as possible
- ** Verified Security Group Rules
-  ** Checked Network ACL (NACL) Configuration
-  ** Verified Route Table Functionality
-  ** Confirmed the Instance Had a Public IP
-   **Attempted Fresh Instances
-    **Attempted to Update and Install Packages Internally

  ![Screenshot 2025-12-09 175533](https://github.com/user-attachments/assets/e687516c-8d5e-4515-ba15-196a932ddec1)

  ![Screenshot 2025-12-09 175354](https://github.com/user-attachments/assets/b8c3a7f3-2658-4fb1-94da-14b0d35f9be0)



 



**Result:**
- SSH connection always timed out
- `Connection timed out` error
- Unable to access the instance for manual deployment
- Instance remained unreachable from the internet

<p>Although I am able to troubleshoot and resolve many common issues in aws — such as verifying security groups, checking NACL rules, confirming route tables, and ensuring proper public IP configuration—this project highlighted an important limitation in my current skill set. When the standard fixes did not solve the problem, I struggled to progress further because I lacked deeper knowledge of advanced AWS networking and diagnostic methods.</p>
---

# 8. Cordova

### What I Attempted

In this deployment strategy, I attempted to build a **Cordova-based mobile application** that would act as the mobile front-end for the project. This required installing and configuring all tools necessary for Android development, including the Android SDK, Java JDK, and Gradle.

The goal was to generate an Android APK using:
```bash
cordova build android
```

### What Went Wrong

The build repeatedly failed because several required components were either:
* **Missing**
* **Incorrectly installed**
* **Incompatible**
* **Not being detected by Cordova**

Cordova's Android tooling is extremely sensitive to versions and environment configuration, and even a single mismatch can cause the entire build process to break.

---

### Core Reasons the Cordova Build Requirements Failed

#### 1. Java JDK Version Mismatch

**Problem:**
Cordova Android builds only support **JDK 8** or **JDK 11**. Modern Windows systems typically install JDK 17 or 21, which are incompatible.

**Errors Encountered:**
```
Unsupported major.minor version
Failed to apply plugin 'com.android.internal.version-check'
```

**Root Cause:**
- Cordova's Android platform was built against older JDK versions
- Newer JDK releases changed internal APIs that Cordova's build scripts depend on
- Java bytecode compiled with JDK 17+ cannot be executed by Cordova's JDK 8-targeted toolchain

---

#### 2. Missing or Incorrect Android SDK / Build-Tools

**Problem:**
Cordova requires specific platform versions, such as:
* `platforms/android-33`
* `build-tools/33.0.0`
* `platform-tools/adb`

**Errors Encountered:**
```
SDK platform not found
Could not find build-tools
Failed to find target with hash string 'android-33'
```

**Root Cause:**
- Android Studio installs SDK components to user-specific directories
- Cordova's detection scripts look in hardcoded or expected paths
- SDK Manager may have installed components to non-standard locations
- Multiple SDK installations can create path conflicts

---

#### 3. Missing or Incorrect Environment Variables

**Problem:**
Cordova depends on correctly configured system variables:
```bash
ANDROID_HOME
JAVA_HOME
PATH
```

**Required Configuration:**
```bash
ANDROID_HOME=C:\Users\\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Java\jdk1.8.0_202
PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools
```

**Result:**
If these paths are incorrect or missing, Cordova reports that **Android is not installed** even when it is physically present on the system.

**Common Issues:**
- Spaces in paths (e.g., `Program Files`) causing parsing errors
- Environment variables set at user level vs. system level
- Variables not propagated to command prompt/terminal sessions
- Conflicting variables from multiple Java or Android installations

---

#### 4. Gradle Issues

**Problem:**
Cordova uses a very specific Gradle version (typically 6.x or 7.x). Newer versions installed by Android Studio (8.x+) often break compatibility.

**Errors Encountered:**
```
Could not install Gradle distribution from 'https://...'
Unsupported method: BaseConfig.getApplicationIdSuffix()
gradle-wrapper.jar missing or corrupted
```

**Root Cause:**
- Gradle wrapper version specified in `gradle-wrapper.properties` incompatible with project
- Gradle plugin versions in `build.gradle` don't match Gradle distribution version
- Gradle cache corruption from interrupted downloads
- Network issues downloading Gradle distribution

---

#### 5. Cordova's Android Build Tools Are Outdated

**Problem:**
Cordova's Android platform typically **lags behind Google's tools by years**.

**Implications:**
* New SDK versions are not supported
* Build-tools and plugins break with API changes
* Gradle sync becomes incompatible with modern Android Gradle Plugin
* Google deprecates APIs that Cordova still depends on

**Example Incompatibilities:**
- Android SDK 34+ requires Gradle 8+, but Cordova Android 11 only supports Gradle 7
- Build-tools 34.x changed internal structure, breaking Cordova's build scripts
- Google Play now requires API level 33+, but Cordova's default templates target older APIs

**Result:**
Persistent build failures even after installing the "required" components, because the requirements themselves are outdated.

---

###  Despite Installing Everything, It Still Wouldn't Build

I installed all required software:

-  **JDK 8** (AdoptOpenJDK)  
-  **Android Studio** (latest version)  
-  **Android SDKs** (API 33, 34)  
-  **Build-tools** (33.0.0, 34.0.0)  
-  **Platform-tools** (adb, fastboot)  
-  **Gradle** (6.9, 7.6)  
-  **Cordova CLI** (12.0.0)  

<img width="653" height="42" alt="image" src="https://github.com/user-attachments/assets/8f9012e3-92ae-4868-a584-24db88802128" />

<img width="647" height="301" alt="image" src="https://github.com/user-attachments/assets/cca48f24-5e42-4b75-baab-b1734d7c6fd2" />

<img width="332" height="59" alt="image" src="https://github.com/user-attachments/assets/b1c6d776-650a-4377-80e2-6074b402b787" />

<img width="193" height="245" alt="image" src="https://github.com/user-attachments/assets/ca56e7db-1fc9-484b-bfc7-8009b43bc9ff" />




---

###  Time Constraints
*** i did as much trouble shooting as i could within the time frame but could not resolve the issue despite extensive troubleshooting efforts:

**Attempts Made:**
-  Adjusting environment variables (`ANDROID_HOME`, `JAVA_HOME`, `PATH`)
-  Reinstalling SDK components via Android Studio SDK Manager
-  Clearing Gradle cache (`~/.gradle/caches`)
-  Editing `gradle-wrapper.properties` and `build.gradle

---

# 8. Security Considerations
###  Input Validation
<p>Coordinate Validation</p>
<code>if not (-90 <= lat <= 90):
    return Response({'error': 'Invalid latitude'}, status=400)
if not (-180 <= lng <= 180):
    return Response({'error': 'Invalid longitude'}, status=400)</code>
<p>Radius Validation</p>
<code>if radius_km <= 0 or radius_km > 20:
    return Response({'error': 'Invalid radius'}, status=400)</code>
    <p>removed code from env before commiting code</p>

### CSRF Protection
<code> @csrf_exempt  # Disabled for development
def api_view(request):
    pass</code>

### CORS Configuration
- Development (allows all origins)
- Production (whitelist specific domains)



