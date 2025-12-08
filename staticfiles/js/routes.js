
// State for routes
let currentRoute = null;
let routeLayer = L.layerGroup();
let routeMarkers = L.layerGroup();

// Walking speed in km/h (average human walking speed)
const WALKING_SPEED_KMH = 5;

/**
 * Initialize route functionality
 */
function initializeRoutes() {
    routeLayer.addTo(map);
    routeMarkers.addTo(map);
}

/**
 * Plan walking route through all shops in neighborhood
 */
async function planWalkingRoute(neighborhoodName) {
    console.log(`🚶 Planning walking route in ${neighborhoodName}...`);
    
    // Get shops in this neighborhood
    const shopsInArea = allCoffeeShops.filter(feature => {
        const shopArea = feature.properties.area;
        return shopArea && shopArea.toLowerCase().includes(neighborhoodName.toLowerCase());
    });
    
    // Also apply active filters
    const filteredShops = shopsInArea.filter(shop => {
        if (typeof passesFilters === 'function') {
            return passesFilters(shop);
        }
        return true;
    });
    
    if (filteredShops.length < 2) {
        alert(`Need at least 2 coffee shops in ${neighborhoodName} to plan a route!`);
        return;
    }
    
    if (filteredShops.length > 10) {
        const proceed = confirm(`This will create a route through ${filteredShops.length} shops. This might take a moment. Continue?`);
        if (!proceed) return;
    }
    
    // Show loading
    showRouteLoading(true);
    
    // Calculate optimal route
    const route = calculateOptimalRoute(filteredShops);
    
    // Draw route on map
    drawWalkingRoute(route, neighborhoodName);
    
    // Show route info panel
    displayRouteInfo(route, neighborhoodName);
    
    // Hide loading
    showRouteLoading(false);
    
    currentRoute = route;
}

/**
 * Calculate optimal route using nearest neighbor algorithm (TSP approximation)
 */
function calculateOptimalRoute(shops) {
    if (shops.length === 0) return null;
    
    // Start from first shop
    const route = {
        shops: [],
        segments: [],
        totalDistance: 0,
        totalTime: 0
    };
    
    // Create array of unvisited shops
    let unvisited = [...shops];
    let current = unvisited[0];
    
    route.shops.push({
        ...current,
        order: 1,
        coords: current.geometry.coordinates
    });
    unvisited.shift();
    
    // Greedy nearest neighbor approach
    while (unvisited.length > 0) {
        let nearestShop = null;
        let minDistance = Infinity;
        let nearestIndex = -1;
        
        // Find nearest unvisited shop
        unvisited.forEach((shop, index) => {
            const distance = calculateDistanceBetweenPoints(
                current.geometry.coordinates,
                shop.geometry.coordinates
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestShop = shop;
                nearestIndex = index;
            }
        });
        
        // Add segment
        route.segments.push({
            from: current.properties.name,
            to: nearestShop.properties.name,
            distance: minDistance
        });
        
        route.totalDistance += minDistance;
        
        // Add to route
        route.shops.push({
            ...nearestShop,
            order: route.shops.length + 1,
            coords: nearestShop.geometry.coordinates
        });
        
        // Remove from unvisited
        unvisited.splice(nearestIndex, 1);
        current = nearestShop;
    }
    
    // Calculate total time (distance / speed)
    route.totalTime = (route.totalDistance / WALKING_SPEED_KMH) * 60; // minutes
    
    return route;
}

/**
 * Calculate distance between two points (Haversine formula)
 */
function calculateDistanceBetweenPoints(coords1, coords2) {
    const R = 6371; // Earth's radius in km
    const lat1 = coords1[1] * Math.PI / 180;
    const lat2 = coords2[1] * Math.PI / 180;
    const deltaLat = (coords2[1] - coords1[1]) * Math.PI / 180;
    const deltaLng = (coords2[0] - coords1[0]) * Math.PI / 180;
    
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in km
}

/**
 * Draw walking route on map
 */
function drawWalkingRoute(route, neighborhoodName) {
    // Clear existing route
    clearRoute();
    
    if (!route || route.shops.length < 2) return;
    
    // Draw line connecting all shops
    const routeCoords = route.shops.map(shop => [shop.coords[1], shop.coords[0]]);
    
    const routeLine = L.polyline(routeCoords, {
        color: '#3498db',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 5'
    });
    
    routeLine.bindPopup(`
        <strong>${neighborhoodName} Coffee Crawl</strong><br>
        ${route.shops.length} shops<br>
        ${route.totalDistance.toFixed(2)} km<br>
        ~${Math.round(route.totalTime)} minutes
    `);
    
    routeLayer.addLayer(routeLine);
    
    // Add numbered markers for each shop
    route.shops.forEach(shop => {
        const marker = L.marker([shop.coords[1], shop.coords[0]], {
            icon: L.divIcon({
                className: 'route-marker',
                html: `<div class="route-marker-inner">${shop.order}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            }),
            zIndexOffset: 1000
        });
        
        marker.bindPopup(`
            <strong>#${shop.order}: ${shop.properties.name}</strong><br>
            ${shop.properties.address}
        `);
        
        routeMarkers.addLayer(marker);
    });
    
    // Fit map to show entire route
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
}

/**
 * Display route information panel
 */
function displayRouteInfo(route, neighborhoodName) {
    // Create or update route info panel
    let panel = document.getElementById('route-info-panel');
    
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'route-info-panel';
        panel.className = 'route-info-panel';
        document.body.appendChild(panel);
    }
    
    // Build route steps HTML
    let stepsHTML = '<ol class="route-steps">';
    
    route.shops.forEach((shop, index) => {
        stepsHTML += `
            <li>
                <strong>${shop.properties.name}</strong>
                <div class="route-step-details">
                    <small>${shop.properties.address}</small>
                    ${shop.properties.rating ? `<br><small>⭐ ${shop.properties.rating}/5</small>` : ''}
                </div>
                ${index < route.shops.length - 1 ? `
                    <div class="route-segment">
                        <i class="fas fa-arrow-down"></i> 
                        ${(route.segments[index].distance * 1000).toFixed(0)}m walk 
                        (~${Math.round((route.segments[index].distance / WALKING_SPEED_KMH) * 60)} min)
                    </div>
                ` : ''}
            </li>
        `;
    });
    
    stepsHTML += '</ol>';
    
    // Update panel content
    panel.innerHTML = `
        <div class="route-header">
            <h5>
                <i class="fas fa-route"></i> 
                ${neighborhoodName} Coffee Crawl
            </h5>
            <button class="btn-close" onclick="clearRoute()"></button>
        </div>
        
        <div class="route-summary">
            <div class="route-stat">
                <i class="fas fa-walking"></i>
                <div>
                    <strong>${route.totalDistance.toFixed(2)} km</strong>
                    <small>Total Distance</small>
                </div>
            </div>
            <div class="route-stat">
                <i class="fas fa-clock"></i>
                <div>
                    <strong>${Math.round(route.totalTime)} min</strong>
                    <small>Walking Time</small>
                </div>
            </div>
            <div class="route-stat">
                <i class="fas fa-mug-hot"></i>
                <div>
                    <strong>${route.shops.length}</strong>
                    <small>Coffee Shops</small>
                </div>
            </div>
        </div>
        
        <div class="route-directions">
            <h6>Route Order:</h6>
            ${stepsHTML}
        </div>
        
        <div class="route-actions">
            <button class="btn btn-primary btn-sm" onclick="exportRoute()">
                <i class="fas fa-download"></i> Export Route
            </button>
            <button class="btn btn-secondary btn-sm" onclick="clearRoute()">
                <i class="fas fa-times"></i> Clear Route
            </button>
        </div>
    `;
    
    panel.style.display = 'block';
}

/**
 * Clear current route
 */
function clearRoute() {
    routeLayer.clearLayers();
    routeMarkers.clearLayers();
    currentRoute = null;
    
    const panel = document.getElementById('route-info-panel');
    if (panel) {
        panel.style.display = 'none';
    }
    
    // Reapply neighborhood filter to show shops again
    if (activeNeighborhood) {
        filterByNeighborhood(activeNeighborhood);
    }
}

/**
 * Show/hide loading indicator
 */
function showRouteLoading(show) {
    let loader = document.getElementById('route-loader');
    
    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'route-loader';
            loader.className = 'route-loader';
            loader.innerHTML = `
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p>Calculating optimal route...</p>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    } else {
        if (loader) {
            loader.style.display = 'none';
        }
    }
}

/**
 * Export route to text file
 */
function exportRoute() {
    if (!currentRoute) return;
    
    let text = `Coffee Crawl Route\n`;
    text += `==================\n\n`;
    text += `Total Distance: ${currentRoute.totalDistance.toFixed(2)} km\n`;
    text += `Walking Time: ${Math.round(currentRoute.totalTime)} minutes\n`;
    text += `Shops: ${currentRoute.shops.length}\n\n`;
    text += `Route:\n`;
    text += `------\n`;
    
    currentRoute.shops.forEach((shop, index) => {
        text += `${shop.order}. ${shop.properties.name}\n`;
        text += `   ${shop.properties.address}\n`;
        if (shop.properties.rating) {
            text += `   Rating: ${shop.properties.rating}/5\n`;
        }
        
        if (index < currentRoute.shops.length - 1) {
            const segment = currentRoute.segments[index];
            text += `   ↓ Walk ${(segment.distance * 1000).toFixed(0)}m (~${Math.round((segment.distance / WALKING_SPEED_KMH) * 60)} min)\n`;
        }
        text += `\n`;
    });
    
    // Download as file
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coffee-route-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}