
// Global variables
let map;
let userMarkers = [];

// Initialize application when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🗺️ Initializing Hello Map application...');
    initializeMap();
    setupEventListeners();
    loadSampleData();
});

/**
 * Initialize the Leaflet map
 */
function initializeMap() {
    try {
        // Create map instance centered on Europe
        map = L.map('map').setView([54.0, 15.0], 4);
        
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
            minZoom: 2
        }).addTo(map);
        
        // Add scale control
        L.control.scale({
            position: 'bottomright',
            imperial: false
        }).addTo(map);
        
        console.log('Map initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize map:', error);
        showAlert('danger', 'Failed to initialize map. Please refresh the page.');
    }
}

/**
 * Set up event listeners for user interactions
 */
function setupEventListeners() {
    // Map click event for coordinates
    map.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        
        // Update coordinate display
        document.getElementById('map-coordinates').textContent = 
            `Coordinates: ${lat}, ${lng}`;
        
        // Fill form inputs
        document.getElementById('location-lat').value = lat;
        document.getElementById('location-lng').value = lng;
        
        // Show temporary marker
        showTemporaryMarker(e.latlng);
    });
    
    // Quick add form submission
    document.getElementById('quick-add-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addUserLocation();
    });
    
    // Layer toggle controls
    document.getElementById('locations-layer').addEventListener('change', function(e) {
        toggleSampleLocations(e.target.checked);
    });
    
    document.getElementById('user-locations').addEventListener('change', function(e) {
        toggleUserLocations(e.target.checked);
    });
    
    // Reset view button
    document.getElementById('reset-view').addEventListener('click', function() {
        resetMapView();
    });
}

/**
 * Load sample location data to demonstrate the map
 */
function loadSampleData() {
    showMapLoading(true);
    
    // Sample European cities for demonstration
    const sampleLocations = [
        { name: "Dublin, Ireland", lat: 53.3498, lng: -6.2603 },
        { name: "London, UK", lat: 51.5074, lng: -0.1278 },
        { name: "Paris, France", lat: 48.8566, lng: 2.3522 },
        { name: "Berlin, Germany", lat: 52.5200, lng: 13.4050 },
        { name: "Madrid, Spain", lat: 40.4168, lng: -3.7038 },
        { name: "Rome, Italy", lat: 41.9028, lng: 12.4964 },
        { name: "Amsterdam, Netherlands", lat: 52.3676, lng: 4.9041 }
    ];
    
    // Add markers for sample locations
    sampleLocations.forEach((location, index) => {
        setTimeout(() => {
            addSampleMarker(location);
        }, index * 200); // Stagger the animations
    });
    
    setTimeout(() => {
        showMapLoading(false);
        showAlert('success', `Loaded ${sampleLocations.length} sample locations successfully!`);
    }, sampleLocations.length * 200 + 500);
}

/**
 * Add a sample location marker
 */
function addSampleMarker(location) {
    const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background-color: #0d6efd;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
    
    const marker = L.marker([location.lat, location.lng], { icon }).addTo(map);
    
    const popupContent = `
        <div class="custom-popup">
            <h6>${location.name}</h6>
            <div class="coordinates">${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</div>
            <small class="text-muted">Sample location from database</small>
        </div>
    `;
    
    marker.bindPopup(popupContent);
    marker.location = location;
    
    // Add bounce animation
    setTimeout(() => {
        const element = marker.getElement();
        if (element) {
            element.classList.add('bounce-in');
        }
    }, 100);
}

/**
 * Add user-created location
 */
function addUserLocation() {
    const name = document.getElementById('location-name').value.trim();
    const lat = parseFloat(document.getElementById('location-lat').value);
    const lng = parseFloat(document.getElementById('location-lng').value);
    
    // Validation
    if (!name) {
        showAlert('warning', 'Please enter a location name');
        return;
    }
    
    if (isNaN(lat) || isNaN(lng)) {
        showAlert('warning', 'Please enter valid coordinates');
        return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        showAlert('danger', 'Coordinates are out of valid range');
        return;
    }
    
    // Create user marker with different styling
    const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background-color: #198754;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });
    
    const marker = L.marker([lat, lng], { icon }).addTo(map);
    
    const popupContent = `
        <div class="custom-popup">
            <h6><i class="fas fa-user-plus me-2 text-success"></i>${name}</h6>
            <div class="coordinates">${lat.toFixed(6)}, ${lng.toFixed(6)}</div>
            <small class="text-muted">Added by user</small>
            <hr>
            <button class="btn btn-danger btn-sm" onclick="removeUserMarker(${userMarkers.length})">
                <i class="fas fa-trash me-1"></i>Remove
            </button>
        </div>
    `;
    
    marker.bindPopup(popupContent);
    marker.userIndex = userMarkers.length;
    userMarkers.push(marker);
    
    // Clear form
    document.getElementById('quick-add-form').reset();
    
    // Focus on new marker
    map.setView([lat, lng], Math.max(map.getZoom(), 10));
    marker.openPopup();
    
    showAlert('success', `Added "${name}" to the map!`);
}

/**
 * Remove user marker
 */
function removeUserMarker(index) {
    if (userMarkers[index]) {
        map.removeLayer(userMarkers[index]);
        userMarkers[index] = null;
        showAlert('info', 'Location removed from map');
    }
}

/**
 * Show temporary marker for coordinate selection
 */
function showTemporaryMarker(latlng) {
    // Remove existing temporary marker if any
    if (window.tempMarker) {
        map.removeLayer(window.tempMarker);
    }
    
    const tempIcon = L.divIcon({
        className: 'temp-marker',
        html: `<div style="
            background-color: #ffc107;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            animation: pulse 1s infinite;
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });
    
    window.tempMarker = L.marker(latlng, { icon }).addTo(map);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (window.tempMarker) {
            map.removeLayer(window.tempMarker);
            window.tempMarker = null;
        }
    }, 3000);
}

/**
 * Toggle sample locations visibility
 */
function toggleSampleLocations(show) {
    map.eachLayer(function(layer) {
        if (layer.location && !layer.userIndex !== undefined) {
            if (show) {
                layer.addTo(map);
            } else {
                map.removeLayer(layer);
            }
        }
    });
}

/**
 * Toggle user locations visibility
 */
function toggleUserLocations(show) {
    userMarkers.forEach(marker => {
        if (marker) {
            if (show) {
                marker.addTo(map);
            } else {
                map.removeLayer(marker);
            }
        }
    });
}

/**
 * Reset map to default view
 */
function resetMapView() {
    map.setView([54.0, 15.0], 4);
    document.getElementById('map-coordinates').textContent = 'Click on map to see coordinates';
    showAlert('info', 'Map view reset to default');
}

/**
 * Show/hide map loading overlay
 */
function showMapLoading(show) {
    const overlay = document.getElementById('map-loading');
    if (show) {
        overlay.classList.remove('d-none');
    } else {
        overlay.classList.add('d-none');
    }
}

/**
 * Show Bootstrap alert
 */
function showAlert(type, message) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }
    }, 5000);
}

// CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);



// filepath: static/js/map.js
class ProximitySearch {

    constructor(map) {

        this.map = map;

        this.searchMarker = null;

        this.nearestCitiesLayer = L.layerGroup().addTo(this.map);

        this.radiusCircle = null;

        this.isProximityMode = false;

       

        this.initializeProximityFeatures();

    }

   

    initializeProximityFeatures() {

        // Add proximity search toggle button

        this.addProximityControls();

       

        // Add click handler for proximity search

        this.map.on('click', (e) => {

            if (this.isProximityMode) {

                this.performProximitySearch(e.latlng.lat, e.latlng.lng);

            }

        });

    }

   

    addProximityControls() {

        // Add toggle button to existing controls

        const proximityToggle = document.createElement('button');

        proximityToggle.id = 'proximity-toggle';

        proximityToggle.className = 'btn btn-outline-primary';

        proximityToggle.innerHTML = '📍 Proximity Search';

        proximityToggle.onclick = () => this.toggleProximityMode();

       

        // Add to existing control panel

        const controlPanel = document.querySelector('.map-controls') || document.body;

        controlPanel.appendChild(proximityToggle);

       

        // Add radius input

        const radiusInput = document.createElement('input');

        radiusInput.id = 'radius-input';

        radiusInput.type = 'number';

        radiusInput.value = '100';

        radiusInput.placeholder = 'Radius (km)';

        radiusInput.className = 'form-control d-none';

        radiusInput.style.width = '120px';

        radiusInput.style.display = 'inline-block';

        radiusInput.style.marginLeft = '10px';

       

        controlPanel.appendChild(radiusInput);

    }

   

    toggleProximityMode() {

        this.isProximityMode = !this.isProximityMode;

        const toggleBtn = document.getElementById('proximity-toggle');

        const radiusInput = document.getElementById('radius-input');

       

        if (this.isProximityMode) {

            toggleBtn.innerHTML = 'Exit Proximity';

            toggleBtn.className = 'btn btn-danger';

            radiusInput.classList.remove('d-none');

            this.map.getContainer().style.cursor = 'crosshair';

            showAlert('Click anywhere on the map to find nearest cities', 'info');

        } else {

            toggleBtn.innerHTML = 'Proximity Search';

            toggleBtn.className = 'btn btn-outline-primary';

            radiusInput.classList.add('d-none');

            this.map.getContainer().style.cursor = '';

            this.clearProximityResults();

        }

    }

   

    async performProximitySearch(lat, lng) {

        // Clear previous results

        this.clearProximityResults();

       

        // Add search marker

        this.searchMarker = L.marker([lat, lng], {

            icon: L.icon({

                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',

                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',

                iconSize: [25, 41],

                iconAnchor: [12, 41],

                popupAnchor: [1, -34]

            })

        }).addTo(this.map);

       

        this.searchMarker.bindPopup(`

            <strong>Search Point</strong><br>

            Lat: ${lat.toFixed(6)}<br>

            Lng: ${lng.toFixed(6)}

        `).openPopup();

       

        // Show loading

        showLoading(true);

       

        try {

            const response = await fetch('/cities/api/nearest/', {

                method: 'POST',

                headers: {

                    'Content-Type': 'application/json',

                    'X-CSRFToken': getCsrfToken()

                },

                body: JSON.stringify({ lat, lng })

            });

           

            if (!response.ok) {

                throw new Error(`HTTP error! status: ${response.status}`);

            }

           

            const data = await response.json();

            this.displayNearestCities(data.nearest_cities);

            this.updateResultsPanel(data);

           

        } catch (error) {

            console.error('Error finding nearest cities:', error);

            showAlert('Error performing proximity search. Please try again.', 'danger');

        } finally {

            showLoading(false);

        }

    }

   

    displayNearestCities(cities) {

        cities.forEach((city, index) => {

            const marker = L.marker([city.coordinates.lat, city.coordinates.lng], {

                icon: this.getNumberedIcon(city.rank)

            });

           

            const popupContent = `

                <div class="city-popup proximity-result">

                    <h6>#${city.rank} ${city.name}</h6>

                    <p><strong>Country:</strong> ${city.country}</p>

                    <p><strong>Population:</strong> ${city.population.toLocaleString()}</p>

                    <p><strong>Distance:</strong> ${city.distance_km} km (${city.distance_miles} mi)</p>

                    ${city.founded_year ? `<p><strong>Founded:</strong> ${city.founded_year}</p>` : ''}

                    ${city.description ? `<p><em>${city.description}</em></p>` : ''}

                    <button class="btn btn-sm btn-primary" onclick="proximitySearch.zoomToCity(${city.coordinates.lat}, ${city.coordinates.lng})">

                        Zoom Here

                    </button>

                </div>

            `;

           

            marker.bindPopup(popupContent);

            this.nearestCitiesLayer.addLayer(marker);

        });

       

        // Fit map to show search point and results

        if (cities.length > 0) {

            const group = new L.featureGroup([

                this.searchMarker,

                ...this.nearestCitiesLayer.getLayers()

            ]);

            this.map.fitBounds(group.getBounds().pad(0.1));

        }

    }

   

    getNumberedIcon(number) {

        return L.divIcon({

            className: 'numbered-marker',

            html: `<div class="marker-number">${number}</div>`,

            iconSize: [30, 30],

            iconAnchor: [15, 15]

        });

    }

   

    updateResultsPanel(data) {

        // Create or update results panel

        let resultsPanel = document.getElementById('proximity-results');

        if (!resultsPanel) {

            resultsPanel = document.createElement('div');

            resultsPanel.id = 'proximity-results';

            resultsPanel.className = 'proximity-results-panel';

            document.body.appendChild(resultsPanel);

        }

       

        resultsPanel.innerHTML = `

            <div class="card">

                <div class="card-header">

                    <h5>Nearest Cities Results</h5>

                    <button type="button" class="btn-close" onclick="proximitySearch.clearProximityResults()"></button>

                </div>

                <div class="card-body">

                    <p><strong>Search Point:</strong> ${data.search_point.lat.toFixed(4)}, ${data.search_point.lng.toFixed(4)}</p>

                    <p><strong>Cities Found:</strong> ${data.total_found}</p>

                    <div class="results-list">

                        ${data.nearest_cities.map(city => `

                            <div class="result-item" onclick="proximitySearch.zoomToCity(${city.coordinates.lat}, ${city.coordinates.lng})">

                                <strong>#${city.rank} ${city.name}, ${city.country}</strong><br>

                                <small>${city.distance_km} km away • Population: ${city.population.toLocaleString()}</small>

                            </div>

                        `).join('')}

                    </div>

                </div>

            </div>

        `;

       

        resultsPanel.style.display = 'block';

    }

   

    zoomToCity(lat, lng) {

        this.map.setView([lat, lng], 12);

    }

   

    clearProximityResults() {

        if (this.searchMarker) {

            this.map.removeLayer(this.searchMarker);

            this.searchMarker = null;

        }

       

        this.nearestCitiesLayer.clearLayers();

       

        if (this.radiusCircle) {

            this.map.removeLayer(this.radiusCircle);

            this.radiusCircle = null;

        }

       

        const resultsPanel = document.getElementById('proximity-results');

        if (resultsPanel) {

            resultsPanel.style.display = 'none';

        }

    }

}

 

// Initialize proximity search when map loads

document.addEventListener('DOMContentLoaded', function() {

    // Wait for your existing map to be initialized

    setTimeout(() => {

        if (window.map) {

            window.proximitySearch = new ProximitySearch(window.map);

        }

    }, 1000);

});