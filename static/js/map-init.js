// Map Initialization and Event Listeners

/**
 * Handle mode change
 */
document.getElementById('search-mode').addEventListener('change', (e) => {
    currentMode = e.target.value;
    
    // Hide all settings
    document.getElementById('nearest-settings').style.display = 'none';
    document.getElementById('radius-settings').style.display = 'none';
    document.getElementById('distance-settings').style.display = 'none';
    
    // Show relevant settings
    if (currentMode === 'nearest') {
        document.getElementById('nearest-settings').style.display = 'block';
    } else if (currentMode === 'radius') {
        document.getElementById('radius-settings').style.display = 'block';
    } else if (currentMode === 'distance') {
        document.getElementById('distance-settings').style.display = 'block';
        distanceModeShops = [];
    }
    
    clearSearch();
});

/**
 * Map click handler
 */
map.on('click', (e) => {
    if (currentMode === 'nearest') {
        findNearest(e.latlng.lat, e.latlng.lng);
    } else if (currentMode === 'radius') {
        searchRadius(e.latlng.lat, e.latlng.lng);
    }
    // Distance mode handles clicks on markers, not map
});

/**
 * Clear button handler
 */
document.getElementById('clear-btn').addEventListener('click', clearSearch);

/**
 * Close results panel handler
 */
document.getElementById('close-results').addEventListener('click', () => {
    document.getElementById('results-panel').style.display = 'none';
});

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    loadCoffeeShops();
});

// Alternative initialization (if DOMContentLoaded already fired)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCoffeeShops);
} else {
    loadCoffeeShops();
}