// Map Markers and Display Functions

/**
 * Load all coffee shops from API and display on map
 */
async function loadCoffeeShops() {
    try {
        const response = await fetch('/coffee/api/all/');
        const data = await response.json();
        
        allCoffeeShops = data.features;
        coffeeLayer.clearLayers();
        
        data.features.forEach(feature => {
            addCoffeeMarker(feature);
        });
        
        document.getElementById('shop-count').textContent = 
            `${data.features.length} coffee shops in Dublin`;
            
    } catch (error) {
        console.error('Error loading coffee shops:', error);
        document.getElementById('shop-count').textContent = 'Error loading shops';
    }
}

/**
 * Add a coffee shop marker to the map
 */
function addCoffeeMarker(feature) {
    const coords = feature.geometry.coordinates;
    const props = feature.properties;
    
    const icon = L.divIcon({
        className: 'coffee-marker',
        html: '<div class="coffee-icon"><i class="fas fa-mug-hot"></i></div>',
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5]
    });
    
    const marker = L.marker([coords[1], coords[0]], { icon: icon });
    
    const popupContent = `
        <div style="min-width: 200px;">
            <h6 class="mb-2"><i class="fas fa-coffee"></i> ${props.name}</h6>
            <p class="mb-1 small"><i class="fas fa-map-marker-alt"></i> ${props.address}</p>
            <p class="mb-1 small"><i class="fas fa-location-dot"></i> ${props.area}</p>
            ${props.rating ? `<p class="mb-1 small"><i class="fas fa-star rating"></i> ${props.rating}/5</p>` : ''}
            ${props.wifi ? '<span class="badge bg-info me-1"><i class="fas fa-wifi"></i> WiFi</span>' : ''}
            ${props.outdoor_seating ? '<span class="badge bg-success"><i class="fas fa-tree"></i> Outdoor</span>' : ''}
        </div>
    `;
    
    marker.bindPopup(popupContent);
    
    // Add click handler for distance mode
    marker.on('click', function(e) {
        if (currentMode === 'distance') {
            L.DomEvent.stopPropagation(e);
            handleDistanceClick(props.id, props.name, coords);
        }
    });
    
    coffeeLayer.addLayer(marker);
}

/**
 * Display results for nearest search
 */
function displayNearestResults(data) {
    searchLayer.clearLayers();
    
    // Add search marker
    const searchMarker = L.marker(
        [data.search_point.lat, data.search_point.lng],
        {
            icon: L.divIcon({
                className: 'search-marker',
                html: '<div class="search-marker"><i class="fas fa-location-dot"></i></div>',
                iconSize: [35, 35],
                iconAnchor: [17.5, 17.5]
            })
        }
    );
    
    searchMarker.bindPopup(`
        <strong>Your Location</strong><br>
        ${data.search_point.lat.toFixed(4)}, ${data.search_point.lng.toFixed(4)}
    `).openPopup();
    
    searchLayer.addLayer(searchMarker);
    
    // Add numbered markers for nearest shops
    data.nearest_shops.forEach(shop => {
        const marker = L.marker(
            [shop.coordinates.lat, shop.coordinates.lng],
            {
                icon: L.divIcon({
                    className: 'nearest-marker',
                    html: `<div class="nearest-marker">${shop.rank}</div>`,
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                })
            }
        );
        
        marker.bindPopup(`
            <div style="min-width: 220px;">
                <h6><span class="badge bg-success">#${shop.rank}</span> ${shop.name}</h6>
                <p class="small mb-1">${shop.address}</p>
                <p class="small"><strong>${shop.distance_km} km away</strong></p>
            </div>
        `);
        
        searchLayer.addLayer(marker);
    });
    
    showResults(
        `${data.total_found} Nearest Coffee Shops`,
        data.nearest_shops.map(shop => ({
            ...shop,
            badge: `#${shop.rank}`,
            badgeClass: 'bg-success'
        }))
    );
    
    // Fit map to show all results
    const allMarkers = searchLayer.getLayers();
    if (allMarkers.length > 0) {
        const group = new L.featureGroup(allMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

/**
 * Display results for radius search
 */
function displayRadiusResults(data) {
    searchLayer.clearLayers();
    
    // Add center marker
    const centerMarker = L.marker(
        [data.search_point.lat, data.search_point.lng],
        {
            icon: L.divIcon({
                className: 'search-marker',
                html: '<div class="search-marker"><i class="fas fa-bullseye"></i></div>',
                iconSize: [35, 35],
                iconAnchor: [17.5, 17.5]
            })
        }
    );
    
    centerMarker.bindPopup(`
        <strong>Search Center</strong><br>
        Radius: ${data.radius_km} km
    `).openPopup();
    
    searchLayer.addLayer(centerMarker);
    
    // Draw circle
    radiusCircle = L.circle([data.search_point.lat, data.search_point.lng], {
        radius: data.radius_km * 1000,
        color: '#007bff',
        fillColor: '#007bff',
        fillOpacity: 0.1,
        weight: 2
    });
    
    searchLayer.addLayer(radiusCircle);
    
    // Add markers for shops in radius
    data.shops.forEach((shop, index) => {
        const marker = L.marker(
            [shop.coordinates.lat, shop.coordinates.lng],
            {
                icon: L.divIcon({
                    className: 'radius-marker',
                    html: `<div class="radius-marker">${index + 1}</div>`,
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                })
            }
        );
        
        marker.bindPopup(`
            <div style="min-width: 220px;">
                <h6><span class="badge bg-primary">#${index + 1}</span> ${shop.name}</h6>
                <p class="small mb-1">${shop.address}</p>
                <p class="small"><strong>${shop.distance_km} km away</strong></p>
            </div>
        `);
        
        searchLayer.addLayer(marker);
    });
    
    showResults(
        `${data.total_found} Shops in ${data.radius_km}km Radius`,
        data.shops.map((shop, index) => ({
            ...shop,
            badge: `#${index + 1}`,
            badgeClass: 'bg-primary',
            rank: index + 1
        }))
    );
    
    // Fit map to show circle
    if (radiusCircle) {
        map.fitBounds(radiusCircle.getBounds(), { padding: [50, 50] });
    }
}

/**
 * Display distance calculation result
 */
function displayDistanceResult(data, shop1, shop2) {
    searchLayer.clearLayers();
    
    // Draw line between shops
    distanceLine = L.polyline(
        [[shop1.coords[1], shop1.coords[0]], [shop2.coords[1], shop2.coords[0]]],
        { color: '#dc3545', weight: 3, dashArray: '10, 10' }
    );
    
    distanceLine.bindPopup(`<strong>Distance:</strong> ${data.distance.km} km`).openPopup();
    searchLayer.addLayer(distanceLine);
    
    // Show distance in panel
    const resultDiv = document.getElementById('distance-result');
    const textDiv = document.getElementById('distance-text');
    
    textDiv.innerHTML = `
        <strong>${shop1.name}</strong> to <strong>${shop2.name}</strong><br>
        📏 ${data.distance.km} km<br>
        📏 ${data.distance.meters} meters<br>
        📏 ${data.distance.miles} miles
    `;
    
    resultDiv.style.display = 'block';
    
    // Fit map to show both shops
    const bounds = L.latLngBounds([
        [shop1.coords[1], shop1.coords[0]],
        [shop2.coords[1], shop2.coords[0]]
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });
}