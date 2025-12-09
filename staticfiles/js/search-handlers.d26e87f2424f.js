// Search Handlers and API Calls

/**
 * Find nearest coffee shops
 */
async function findNearest(lat, lng) {
    const limit = document.getElementById('limit-select').value;
    
    try {
        const response = await fetch('/coffee/api/nearest/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({ lat, lng, limit: parseInt(limit) })
        });
        
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        displayNearestResults(data);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error finding nearest coffee shops. Please try again.');
    }
}

/**
 * Search by radius
 */
async function searchRadius(lat, lng) {
    const radiusKm = parseFloat(document.getElementById('radius-km').value);
    
    if (isNaN(radiusKm) || radiusKm <= 0 || radiusKm > 20) {
        alert('Please enter a valid radius between 0.5 and 20 km');
        return;
    }
    
    try {
        const response = await fetch('/coffee/api/radius/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({ lat, lng, radius_km: radiusKm })
        });
        
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        displayRadiusResults(data);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error searching radius. Please try again.');
    }
}

/**
 * Handle distance mode click on markers
 */
function handleDistanceClick(shopId, shopName, coords) {
    distanceModeShops.push({ id: shopId, name: shopName, coords: coords });
    
    if (distanceModeShops.length === 1) {
        alert(`First shop selected: ${shopName}\n\nNow click on another coffee shop marker.`);
    } else if (distanceModeShops.length === 2) {
        calculateDistance();
    }
}

/**
 * Calculate distance between two shops
 */
async function calculateDistance() {
    const shop1 = distanceModeShops[0];
    const shop2 = distanceModeShops[1];
    
    try {
        const response = await fetch(`/coffee/api/distance/${shop1.id}/${shop2.id}/`);
        
        if (!response.ok) throw new Error('Distance calculation failed');
        
        const data = await response.json();
        
        if (data.success) {
            displayDistanceResult(data, shop1, shop2);
        } else {
            alert('Error calculating distance: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error calculating distance. Please try again.');
    }
    
    // Reset
    distanceModeShops = [];
}