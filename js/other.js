/**
 * JavaScript for the "Other" page
 * This demonstrates how different pages in a PWA can have their own functionality
 * while still benefiting from service worker caching
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Other page loaded');
    
    // Add page-specific functionality
    initializeOtherPageFeatures();
    
    // Add some interactive elements specific to this page
    addPageSpecificContent();
});

/**
 * Initialize features specific to the "Other" page
 */
function initializeOtherPageFeatures() {
    console.log('Initializing Other page features');
    
    // Check if we're running as a PWA (standalone mode)
    checkPWAMode();
    
    // Add page load time information
    showPageLoadInfo();
}

/**
 * Check if the app is running in PWA mode
 * This helps demonstrate the difference between web and app experience
 */
function checkPWAMode() {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.navigator.standalone === true;
    
    if (isPWA) {
        console.log('Running as PWA');
        // Add PWA-specific styling or functionality
        document.body.style.paddingTop = '20px'; // Account for status bar
    } else {
        console.log('Running in browser');
    }
}

/**
 * Show page load information
 * Demonstrates performance monitoring in PWAs
 */
function showPageLoadInfo() {
    // Use Performance API to show load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Display load time on page
        const loadInfo = document.createElement('div');
        loadInfo.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
        `;
        loadInfo.textContent = `Loaded in ${loadTime.toFixed(0)}ms`;
        document.body.appendChild(loadInfo);
        
        // Hide after 3 seconds
        setTimeout(() => {
            loadInfo.style.display = 'none';
        }, 3000);
    });
}

/**
 * Add content specific to this page
 */
function addPageSpecificContent() {
    const body = document.body;
    
    // Create a container for page-specific content
    const contentContainer = document.createElement('div');
    
    // Add a simple form to demonstrate form handling in PWAs
    const formSection = document.createElement('div');
    formSection.className = 'card fade-in-up';
    formSection.innerHTML = `
        <h3>PWA Form Example</h3>
        <p>This form works offline and saves data to localStorage. Try entering data, going offline, and refreshing!</p>
        <div class="form-container">
            <form id="sample-form">
                <div class="form-group">
                    <label for="user-input">Enter some text:</label>
                    <input type="text" id="user-input" class="form-input" placeholder="Type something here..." required>
                </div>
                <button type="submit" class="btn btn-primary">
                Save Data
                </button>
            </form>
        </div>
        <div class="data-display" id="saved-data">
            <strong>Saved Data:</strong> <span id="data-display">None</span>
        </div>
    `;
    
    const mainContainer = document.querySelector('.main-container');
    mainContainer.appendChild(formSection);
    
    // Add cache information
    const cacheSection = document.createElement('div');
    cacheSection.className = 'card slide-in-right';
    cacheSection.innerHTML = `
        <h3>Cache Status</h3>
        <p>Inspect the service worker cache to see what files are stored for offline use.</p>
        <button id="check-cache" class="btn btn-secondary">
            Check Cache
        </button>
        <div id="cache-info" class="cache-info"></div>
    `;
    
    mainContainer.appendChild(cacheSection);
    
    // Setup form functionality
    setupFormHandling();
    
    // Setup cache checking
    setupCacheChecking();
}

/**
 * Setup form handling with localStorage
 * Demonstrates offline data persistence
 */
function setupFormHandling() {
    const form = document.getElementById('sample-form');
    const input = document.getElementById('user-input');
    const dataDisplay = document.getElementById('data-display');
    
    // Load saved data on page load
    const savedData = localStorage.getItem('pwa-other-data');
    if (savedData) {
        dataDisplay.textContent = savedData;
    }
    
    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent page reload
        
        const inputValue = input.value.trim();
        if (inputValue) {
            // Save to localStorage (works offline)
            localStorage.setItem('pwa-other-data', inputValue);
            dataDisplay.textContent = inputValue;
            
            // Clear input
            input.value = '';
            
            // Show success message
            showTemporaryMessage('Data saved successfully!', 'success');
        } else {
            showTemporaryMessage('Please enter some text', 'error');
        }
    });
}

/**
 * Setup cache checking functionality
 * Demonstrates service worker cache inspection
 */
function setupCacheChecking() {
    const checkCacheBtn = document.getElementById('check-cache');
    const cacheInfo = document.getElementById('cache-info');
    
    checkCacheBtn.addEventListener('click', async function() {
        try {
            // Check if caches API is available
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                const ourCache = await caches.open('our-app');
                const cachedRequests = await ourCache.keys();
                
                let info = `<div style="color: #2c3e50; font-weight: bold; margin-bottom: 0.5rem;">Cache Names:</div>`;
                info += `<div style="color: #5a6c7d; margin-bottom: 1rem;">${cacheNames.join(', ')}</div>`;
                info += `<div style="color: #2c3e50; font-weight: bold; margin-bottom: 0.5rem;">Cached Files:</div>`;
                
                cachedRequests.forEach(request => {
                    info += `<div style="color: #5a6c7d; margin-left: 1rem;">• ${request.url}</div>`;
                });
                
                cacheInfo.innerHTML = info;
            } else {
                cacheInfo.innerHTML = '<div style="color: #c62828;">Cache API not supported</div>';
            }
        } catch (error) {
            console.error('Error checking cache:', error);
            cacheInfo.innerHTML = '<div style="color: #c62828;">Error checking cache</div>';
        }
    });
}

/**
 * Show temporary message to user
 * Utility function for user feedback
 */
function showTemporaryMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Remove after 2 seconds
    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 2000);
}