/**
 * Handle search mode change
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
 * Initialize filter system manually
 * This function attaches event listeners to filter controls
 */
function setupFilters() {
    console.log('🔧 Setting up filter system...');
    
    // Get elements
    const ratingFilter = document.getElementById('rating-filter');
    const wifiFilter = document.getElementById('wifi-filter');
    const outdoorFilter = document.getElementById('outdoor-filter');
    const clearButton = document.getElementById('clear-filters-btn');
    
    // Verify elements exist
    if (!ratingFilter || !wifiFilter || !outdoorFilter) {
        console.error('❌ Filter elements not found!');
        return false;
    }
    
    console.log('✅ Filter elements found');
    
    // Rating filter change handler
    ratingFilter.addEventListener('change', function(e) {
        const value = parseFloat(e.target.value) || 0;
        console.log('📊 Rating filter changed to:', value);
        activeFilters.minRating = value;
        applyFilters();
    });
    
    // WiFi filter change handler
    wifiFilter.addEventListener('change', function(e) {
        const checked = e.target.checked;
        console.log('📶 WiFi filter changed to:', checked);
        activeFilters.hasWifi = checked;
        applyFilters();
    });
    
    // Outdoor filter change handler
    outdoorFilter.addEventListener('change', function(e) {
        const checked = e.target.checked;
        console.log('🌳 Outdoor filter changed to:', checked);
        activeFilters.hasOutdoor = checked;
        applyFilters();
    });
    
    // Clear filters button
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            console.log('🔄 Clearing filters...');
            
            // Reset state
            activeFilters = {
                minRating: 0,
                hasWifi: false,
                hasOutdoor: false
            };
            
            // Reset UI
            ratingFilter.value = '0';
            wifiFilter.checked = false;
            outdoorFilter.checked = false;
            
            // Reapply (show all)
            applyFilters();
            
            // Show notification
            if (typeof showFilterNotification === 'function') {
                showFilterNotification('All filters cleared!', 'success');
            }
        });
    }
    
    console.log('✅ Filter event listeners attached');
    return true;
}

/**
 * Initialize the entire application
 * This runs when DOM is ready
 */
function initializeApp() {
    console.log('🚀 Initializing Dublin Coffee Finder...');
    
    // Step 1: Load coffee shops
    loadCoffeeShops()
        .then(() => {
            console.log('✅ Coffee shops loaded successfully');
            
            // Step 2: Setup filters (after shops loaded)
            const filtersReady = setupFilters();
            
            if (filtersReady) {
                console.log('✅ Filter system ready');
            } else {
                console.error('❌ Filter system failed to initialize');
            }
            
            // Step 3: Initialize submissions (if available)
            if (typeof initializeSubmissions === 'function') {
                initializeSubmissions();
                console.log('✅ Submissions ready');
            }
            
            // Step 4: Update map click handler for submission mode
            if (typeof updateMapClickHandler === 'function') {
                updateMapClickHandler();
                console.log('✅ Map click handler updated');
            }
            
            // Step 5: Initialize neighborhoods
            if (typeof initializeNeighborhoods === 'function') {
                initializeNeighborhoods();
                console.log('✅ Neighborhoods ready');
            }

            // Initialize routes
            if (typeof initializeRoutes === 'function') {
                initializeRoutes();
                console.log('✅ Routes ready');
            }
            
            console.log('🎉 Application ready!');
        })
        .catch(error => {
            console.error('❌ Failed to load coffee shops:', error);
        });
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    console.log('⏳ Waiting for DOM...');
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM already loaded
    console.log('✅ DOM ready, starting app...');
    initializeApp();
}