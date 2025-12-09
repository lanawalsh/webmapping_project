
// Layer for neighborhood polygons

let activeNeighborhood = null;

/**
 * Initialize neighborhood boundaries
 */
function initializeNeighborhoods() {
    console.log('🗺️ Loading neighborhood boundaries...');
    
    // Add neighborhoods layer to map
    neighborhoodsLayer.addTo(map);
    
    // Load and display polygons
    loadNeighborhoodPolygons();
    
    // Add toggle button
    addNeighborhoodToggle();
    
    console.log('✅ Neighborhoods loaded');
}

/**
 * Load neighborhood polygons onto map
 */
function loadNeighborhoodPolygons() {
    dublinNeighborhoods.features.forEach(feature => {
        const props = feature.properties;
        const coords = feature.geometry.coordinates[0];
        
        // Convert coordinates to Leaflet format [lat, lng]
        const latLngs = coords.map(coord => [coord[1], coord[0]]);
        
        // Create polygon
        const polygon = L.polygon(latLngs, {
            color: props.color,
            fillColor: props.color,
            fillOpacity: 0.1,
            weight: 2,
            opacity: 0.6
        });
        
        // Add popup
        polygon.bindPopup(`
            <strong>${props.name}</strong><br>
            <span class="badge bg-secondary">${props.area_code}</span><br>
            <button class="btn btn-sm btn-primary mt-2 w-100" onclick="filterByNeighborhood('${props.name}')">
                <i class="fas fa-filter"></i> Show Coffee Shops
            </button>
            <button class="btn btn-sm btn-success mt-1 w-100 btn-plan-route" onclick="planWalkingRoute('${props.name}')">
                <i class="fas fa-route"></i> Plan Walking Route
            </button>
        `);
                
        // Hover effects
        polygon.on('mouseover', function(e) {
            this.setStyle({
                fillOpacity: 0.3,
                weight: 3
            });
        });
        
        polygon.on('mouseout', function(e) {
            if (activeNeighborhood !== props.name) {
                this.setStyle({
                    fillOpacity: 0.1,
                    weight: 2
                });
            }
        });
        
        // Click to filter
        polygon.on('click', function(e) {
            L.DomEvent.stopPropagation(e);
            filterByNeighborhood(props.name);
        });
        
        // Add to layer
        neighborhoodsLayer.addLayer(polygon);
    });
}

/**
 * Filter coffee shops by neighborhood
 */
function filterByNeighborhood(neighborhoodName) {
    console.log(`🎯 Filtering by neighborhood: ${neighborhoodName}`);
    
    activeNeighborhood = neighborhoodName;
    
    // Clear current markers
    coffeeLayer.clearLayers();
    
    // Count shops in this neighborhood
    let count = 0;
    
    allCoffeeShops.forEach(feature => {
        const shopArea = feature.properties.area;
        
        // Check if shop is in this neighborhood
        // (You can improve this with actual point-in-polygon check)
        if (shopArea && shopArea.toLowerCase().includes(neighborhoodName.toLowerCase())) {
            // Also check if passes active filters
            if (typeof passesFilters === 'function' && passesFilters(feature)) {
                addCoffeeMarker(feature);
                count++;
            }
        }
    });
    
    // Update display
    updateNeighborhoodDisplay(neighborhoodName, count);
    
    // Highlight the polygon
    highlightNeighborhood(neighborhoodName);
}

/**
 * Highlight selected neighborhood
 */
function highlightNeighborhood(name) {
    neighborhoodsLayer.eachLayer(polygon => {
        const feature = dublinNeighborhoods.features.find(f => f.properties.name === name);
        
        if (feature && polygon.getLatLngs) {
            polygon.setStyle({
                fillOpacity: 0.3,
                weight: 3
            });
        } else if (polygon.getLatLngs) {
            polygon.setStyle({
                fillOpacity: 0.1,
                weight: 2
            });
        }
    });
}

/**
 * Update neighborhood display
 */
function updateNeighborhoodDisplay(name, count) {
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'alert alert-info alert-dismissible fade show position-fixed';
    notification.style.cssText = 'top: 70px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <h6><i class="fas fa-map-marked-alt"></i> ${name}</h6>
        <p class="mb-2">Showing ${count} coffee shops in this neighborhood</p>
        <button class="btn btn-sm btn-secondary" onclick="clearNeighborhoodFilter()">
            Show All Neighborhoods
        </button>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Remove old notification
    const existing = document.querySelector('.alert-info.position-fixed');
    if (existing) existing.remove();
    
    document.body.appendChild(notification);
    
    // Update filter count if exists
    if (typeof updateFilterCount === 'function') {
        updateFilterCount(count);
    }
}

/**
 * Clear neighborhood filter
 */
function clearNeighborhoodFilter() {
    console.log('🔄 Clearing neighborhood filter');
    
    activeNeighborhood = null;
    
    // Reset polygon styles
    neighborhoodsLayer.eachLayer(polygon => {
        if (polygon.setStyle) {
            polygon.setStyle({
                fillOpacity: 0.1,
                weight: 2
            });
        }
    });
    
    // Reapply filters (shows all shops that pass filters)
    if (typeof applyFilters === 'function') {
        applyFilters();
    } else {
        // Fallback: show all shops
        coffeeLayer.clearLayers();
        allCoffeeShops.forEach(feature => {
            addCoffeeMarker(feature);
        });
    }
    
    // Remove notification
    const notification = document.querySelector('.alert-info.position-fixed');
    if (notification) notification.remove();
}

/**
 * Add toggle button for neighborhoods
 */
function addNeighborhoodToggle() {
    const sidebar = document.querySelector('.sidebar');
    
    // Create toggle section
    const toggleSection = document.createElement('div');
    toggleSection.className = 'control-group mt-3';
    toggleSection.innerHTML = `
        <hr>
        <h6 class="mb-3"><i class="fas fa-map-marked-alt"></i> Neighborhoods</h6>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="neighborhoods-toggle" checked>
            <label class="form-check-label" for="neighborhoods-toggle">
                Show Neighborhood Boundaries
            </label>
        </div>
        <div class="alert alert-light small mt-2">
            <i class="fas fa-info-circle"></i> Click a neighborhood to filter shops
        </div>
    `;
    
    // Insert before "Add Coffee Shop" button
    const addShopBtn = document.getElementById('add-shop-btn');
    if (addShopBtn) {
        sidebar.insertBefore(toggleSection, addShopBtn);
    } else {
        sidebar.appendChild(toggleSection);
    }
    
    // Add toggle handler
    document.getElementById('neighborhoods-toggle').addEventListener('change', function(e) {
        if (e.target.checked) {
            neighborhoodsLayer.addTo(map);
        } else {
            map.removeLayer(neighborhoodsLayer);
        }
    });
}

/**
 * Get shops count by neighborhood
 */
function getNeighborhoodStats() {
    const stats = {};
    
    dublinNeighborhoods.features.forEach(feature => {
        const name = feature.properties.name;
        stats[name] = 0;
        
        allCoffeeShops.forEach(shop => {
            const shopArea = shop.properties.area;
            if (shopArea && shopArea.toLowerCase().includes(name.toLowerCase())) {
                stats[name]++;
            }
        });
    });
    
    console.log('📊 Neighborhood Stats:', stats);
    return stats;
}

/**
 * Show neighborhood legend
 */
function showNeighborhoodLegend() {
    const stats = getNeighborhoodStats();
    
    let legendHTML = '<div class="neighborhood-legend"><h6>Neighborhoods</h6><ul class="list-unstyled">';
    
    dublinNeighborhoods.features.forEach(feature => {
        const props = feature.properties;
        const count = stats[props.name] || 0;
        
        legendHTML += `
            <li>
                <span class="legend-color" style="background-color: ${props.color}"></span>
                <strong>${props.name}</strong> (${count} shops)
            </li>
        `;
    });
    
    legendHTML += '</ul></div>';
    
    return legendHTML;
}