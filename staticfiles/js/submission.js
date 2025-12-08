// ============================================================================
// USER SUBMISSION FUNCTIONALITY
// ============================================================================

// State for submission mode
let submissionMode = false;
let submissionMarker = null;

/**
 * Initialize submission functionality
 */
function initializeSubmissions() {
    console.log('🎯 Initializing user submissions...');
    
    // Add "Add Coffee Shop" button to sidebar
    addSubmissionButton();
    
    // Setup modal handlers
    setupSubmissionModal();
    
    console.log('✅ Submissions ready');
}

/**
 * Add submission button to sidebar
 */
function addSubmissionButton() {
    const sidebar = document.querySelector('.sidebar');
    
    // Create button
    const button = document.createElement('button');
    button.id = 'add-shop-btn';
    button.className = 'btn btn-success w-100 mt-3';
    button.innerHTML = '<i class="fas fa-plus-circle"></i> Add Coffee Shop';
    
    // Add click handler
    button.addEventListener('click', openSubmissionModal);
    
    // Insert after clear button
    const clearBtn = document.getElementById('clear-btn');
    clearBtn.parentNode.insertBefore(button, clearBtn.nextSibling);
}

/**
 * Open submission modal
 */
function openSubmissionModal() {
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addShopModal'));
    modal.show();
    
    // Enable submission mode
    submissionMode = true;
    
    // Change cursor
    map.getContainer().style.cursor = 'crosshair';
    
    // Update status
    document.getElementById('location-status').innerHTML = 
        '<strong>Click on the map</strong> to set the coffee shop location';
}

/**
 * Setup modal event handlers
 */
function setupSubmissionModal() {
    const modal = document.getElementById('addShopModal');
    const submitBtn = document.getElementById('submit-shop-btn');
    
    // When modal closes, exit submission mode
    modal.addEventListener('hidden.bs.modal', function() {
        exitSubmissionMode();
    });
    
    // Submit button handler
    submitBtn.addEventListener('click', submitCoffeeShop);
}

/**
 * Handle map click in submission mode
 */
function handleSubmissionClick(e) {
    if (!submissionMode) return;
    
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    // Remove old marker if exists
    if (submissionMarker) {
        map.removeLayer(submissionMarker);
    }
    
    // Add new submission marker
    submissionMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'submission-marker',
            html: '<div class="submission-marker"><i class="fas fa-plus-circle"></i></div>',
            iconSize: [35, 35],
            iconAnchor: [17.5, 17.5]
        })
    }).addTo(map);
    
    submissionMarker.bindPopup('<strong>New Coffee Shop Location</strong><br>Click "Submit" to add details').openPopup();
    
    // Update form fields
    document.getElementById('id_latitude').value = lat;
    document.getElementById('id_longitude').value = lng;
    
    // Update status
    document.getElementById('location-status').innerHTML = 
        `<strong class="text-success">✓ Location set:</strong> ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

/**
 * Submit coffee shop form
 */
async function submitCoffeeShop() {
    const form = document.getElementById('submit-shop-form');
    const submitBtn = document.getElementById('submit-shop-btn');
    
    // Validate location
    const lat = document.getElementById('id_latitude').value;
    const lng = document.getElementById('id_longitude').value;
    
    if (!lat || !lng) {
        alert('Please click on the map to set the coffee shop location!');
        return;
    }
    
    // Validate required fields
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    try {
        // Gather form data
        const formData = new FormData(form);
        
        // Submit via AJAX
        const response = await fetch('/coffee/submit/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Success!
            showSubmissionSuccess();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addShopModal'));
            modal.hide();
            
            // Reset form
            form.reset();
            
            // Exit submission mode
            exitSubmissionMode();
            
        } else {
            // Show errors
            let errorMsg = 'Submission failed. Please check the form.\n\n';
            if (data.errors) {
                for (let field in data.errors) {
                    errorMsg += `${field}: ${data.errors[field].join(', ')}\n`;
                }
            }
            alert(errorMsg);
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        alert('Error submitting coffee shop. Please try again.');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit for Review';
    }
}

/**
 * Show success message
 */
function showSubmissionSuccess() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'alert alert-success alert-dismissible fade show position-fixed';
    notification.style.cssText = 'top: 70px; right: 20px; z-index: 9999; min-width: 350px;';
    notification.innerHTML = `
        <h6><i class="fas fa-check-circle"></i> Submission Received!</h6>
        <p class="mb-0">Thank you for contributing! Your coffee shop will be reviewed and added to the map soon.</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

/**
 * Exit submission mode
 */
function exitSubmissionMode() {
    submissionMode = false;
    
    // Reset cursor
    map.getContainer().style.cursor = '';
    
    // Remove submission marker
    if (submissionMarker) {
        map.removeLayer(submissionMarker);
        submissionMarker = null;
    }
    
    // Clear form location fields
    document.getElementById('id_latitude').value = '';
    document.getElementById('id_longitude').value = '';
    
    // Reset status
    document.getElementById('location-status').innerHTML = 
        'Click on the map to set the coffee shop location';
}

/**
 * Load and display pending submissions (optional - for admins/moderators)
 */
async function loadPendingSubmissions() {
    try {
        const response = await fetch('/coffee/api/submissions/pending/');
        const data = await response.json();
        
        console.log(`📋 ${data.features.length} pending submissions`);
        
        // Display pending submissions with different marker
        data.features.forEach(feature => {
            const coords = feature.geometry.coordinates;
            const props = feature.properties;
            
            const marker = L.marker([coords[1], coords[0]], {
                icon: L.divIcon({
                    className: 'pending-marker',
                    html: '<div class="pending-marker"><i class="fas fa-clock"></i></div>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            });
            
            marker.bindPopup(`
                <div style="min-width: 200px;">
                    <h6 class="mb-2">
                        <span class="badge bg-warning">Pending</span>
                        ${props.name}
                    </h6>
                    <p class="mb-1 small">${props.address}</p>
                    <p class="mb-1 small">${props.area}</p>
                    ${props.rating ? `<p class="mb-1 small">⭐ ${props.rating}/5</p>` : ''}
                    <p class="small mb-0 text-muted">Submitted: ${new Date(props.submitted_at).toLocaleDateString()}</p>
                </div>
            `);
            
            coffeeLayer.addLayer(marker);
        });
        
    } catch (error) {
        console.error('Error loading pending submissions:', error);
    }
}

/**
 * Update map click handler to support submission mode
 */
function updateMapClickHandler() {
    map.off('click');  // Remove old handler
    
    map.on('click', (e) => {
        // Check if in submission mode
        if (submissionMode) {
            handleSubmissionClick(e);
            return;
        }
        
        // Otherwise, handle normal search modes
        if (currentMode === 'nearest') {
            findNearest(e.latlng.lat, e.latlng.lng);
        } else if (currentMode === 'radius') {
            searchRadius(e.latlng.lat, e.latlng.lng);
        }
    });
}