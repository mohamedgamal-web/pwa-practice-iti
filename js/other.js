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
    contentContainer.style.cssText = `
        margin: 40px auto;
        max-width: 600px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        backdrop-filter: blur(10px);
        text-align: center;
    `;
    
    // Add a simple form to demonstrate form handling in PWAs
    const formSection = document.createElement('div');
    formSection.innerHTML = `
        <h3>PWA Form Example</h3>
        <form id="sample-form" style="margin: 20px 0;">
            <input type="text" id="user-input" placeholder="Enter some text..." 
                   style="padding: 10px; margin: 10px; border: none; border-radius: 5px; width: 200px;">
            <br>
            <button type="submit" style="padding: 10px 20px; background: #e409f8; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">
                Save Data
            </button>
        </form>
        <div id="saved-data" style="margin-top: 20px; padding: 10px; background: rgba(255,255,255,0.2); border-radius: 5px;">
            <strong>Saved Data:</strong> <span id="data-display">None</span>
        </div>
    `;
    
    contentContainer.appendChild(formSection);
    
    // Add cache information
    const cacheSection = document.createElement('div');
    cacheSection.innerHTML = `
        <h3>Cache Status</h3>
        <button id="check-cache" style="padding: 10px 20px; background: #20710f; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">
            Check Cache
        </button>
        <div id="cache-info" style="margin-top: 10px; font-size: 14px;"></div>
    `;
    
    contentContainer.appendChild(cacheSection);
    
    // Insert after the h1 element
    const h1 = document.querySelector('h1');
    h1.parentNode.insertBefore(contentContainer, h1.nextSibling);
    
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
            showTemporaryMessage('Data saved successfully!', '#20710f');
        } else {
            showTemporaryMessage('Please enter some text', '#ff4444');
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
                
                let info = `<strong>Cache Names:</strong> ${cacheNames.join(', ')}<br>`;
                info += `<strong>Cached Files:</strong><br>`;
                
                cachedRequests.forEach(request => {
                    info += `• ${request.url}<br>`;
                });
                
                cacheInfo.innerHTML = info;
            } else {
                cacheInfo.innerHTML = 'Cache API not supported';
            }
        } catch (error) {
            console.error('Error checking cache:', error);
            cacheInfo.innerHTML = 'Error checking cache';
        }
    });
}

/**
 * Show temporary message to user
 * Utility function for user feedback
 */
function showTemporaryMessage(message, color = '#333') {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${color};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 2000;
        font-weight: bold;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Remove after 2 seconds
    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 2000);
}