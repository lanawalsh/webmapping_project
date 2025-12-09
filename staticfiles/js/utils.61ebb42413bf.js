// Utility Functions

/**
 * Get CSRF token from cookies
 */
function getCsrfToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }
    return '';
}

/**
 * Zoom map to specific shop location
 */
function zoomToShop(lat, lng) {
    map.setView([lat, lng], 16);
}

/**
 * Clear all search results and reset map
 */
function clearSearch() {
    searchLayer.clearLayers();
    radiusCircle = null;
    distanceLine = null;
    distanceModeShops = [];
    document.getElementById('results-panel').style.display = 'none';
    document.getElementById('distance-result').style.display = 'none';
    map.setView([53.3498, -6.2603], 13);
}

/**
 * Show results in the floating panel
 */
function showResults(title, shops) {
    const resultsPanel = document.getElementById('results-panel');
    const resultsTitle = document.getElementById('results-title');
    const resultsContent = document.getElementById('results-content');
    
    resultsTitle.textContent = title;
    
    resultsContent.innerHTML = shops.map(shop => `
        <div class="shop-item p-3" onclick="zoomToShop(${shop.coordinates.lat}, ${shop.coordinates.lng})">
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center mb-1">
                        <span class="badge ${shop.badgeClass} me-2">${shop.badge}</span>
                        <strong>${shop.name}</strong>
                    </div>
                    <div class="small text-muted mb-1">
                        <i class="fas fa-map-marker-alt"></i> ${shop.address}
                    </div>
                    <div class="small text-muted">
                        <i class="fas fa-location-dot"></i> ${shop.area}
                    </div>
                </div>
                <div class="text-end">
                    <div class="distance-badge">
                        ${shop.distance_km} km
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    resultsPanel.style.display = 'block';
}