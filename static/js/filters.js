
// Global filter state
let activeFilters = {
    minRating: 0,
    hasWifi: false,
    hasOutdoor: false
};

/**
 * Check if a coffee shop passes all active filters
 * @param {Object} feature - GeoJSON feature with properties
 * @returns {Boolean} - True if shop should be visible
 */
function passesFilters(feature) {
    const props = feature.properties || feature;
    
    // Check rating filter
    if (activeFilters.minRating > 0) {
        const shopRating = parseFloat(props.rating);
        if (isNaN(shopRating) || shopRating < activeFilters.minRating) {
            return false;
        }
    }
    
    // Check WiFi filter
    if (activeFilters.hasWifi === true) {
        if (props.wifi !== true) {
            return false;
        }
    }
    
    // Check outdoor seating filter
    if (activeFilters.hasOutdoor === true) {
        if (props.outdoor_seating !== true) {
            return false;
        }
    }
    
    return true;
}

/**
 * Apply filters and update map
 * This is called every time a filter changes
 */
function applyFilters() {
    if (!allCoffeeShops || allCoffeeShops.length === 0) {
        console.log('⚠️ No coffee shops loaded yet');
        return;
    }
    
    console.log('🔍 Applying filters:', activeFilters);
    
    // Clear all markers
    coffeeLayer.clearLayers();
    
    let visibleCount = 0;
    
    // Add back only shops that pass filters
    allCoffeeShops.forEach(feature => {
        if (passesFilters(feature)) {
            addCoffeeMarker(feature);
            visibleCount++;
        }
    });
    
    console.log(`✅ Showing ${visibleCount} out of ${allCoffeeShops.length} shops`);
    
    // Update the counter
    updateFilterCount(visibleCount);
    
    // Show notification
    if (visibleCount === 0) {
        showFilterNotification('No shops match your filters. Try adjusting them!', 'warning');
    } else if (visibleCount < allCoffeeShops.length) {
        showFilterNotification(`Showing ${visibleCount} shops`, 'info');
    }
}

/**
 * Update the filter count display
 * @param {Number} count - Number of visible shops
 */
function updateFilterCount(count) {
    const filterCountEl = document.getElementById('filter-count');
    if (filterCountEl) {
        filterCountEl.textContent = count;
        
        // Update styling
        const alertEl = filterCountEl.parentElement;
        alertEl.classList.remove('alert-light', 'alert-success', 'alert-warning');
        
        if (count === 0) {
            alertEl.classList.add('alert-warning');
        } else if (count < allCoffeeShops.length) {
            alertEl.classList.add('alert-success');
        } else {
            alertEl.classList.add('alert-light');
        }
    }
}

/**
 * Show a notification to user
 * @param {String} message - Message to display
 * @param {String} type - Bootstrap alert type
 */
function showFilterNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.filter-notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed filter-notification`;
    notification.style.cssText = 'top: 70px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}