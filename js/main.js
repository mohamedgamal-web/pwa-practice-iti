/**
 * Main JavaScript file for the PWA application
 * This file handles the main page functionality and demonstrates
 * basic PWA features like offline detection and service worker status
 */

// Wait for the DOM to be fully loaded before executing our code
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main page loaded');
    
    // Initialize PWA features
    initializePWAFeatures();
    
    // Add some interactive content to demonstrate the app is working
    addInteractiveContent();
    
    // Monitor online/offline status
    monitorNetworkStatus();
});

/**
 * Initialize PWA-specific features
 * This function sets up service worker registration and handles installation prompts
 */
function initializePWAFeatures() {
    // Check if service workers are supported by the browser
    if ('serviceWorker' in navigator) {
        console.log('Service Worker is supported');
        
        // Register the service worker
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker registered successfully:', registration);
                
                // Listen for service worker updates
                registration.addEventListener('updatefound', function() {
                    console.log('New service worker version found');
                });
            })
            .catch(function(error) {
                console.log('Service Worker registration failed:', error);
            });
    } else {
        console.log('Service Worker is not supported');
    }
    
    // Handle PWA installation prompt
    handleInstallPrompt();
}

/**
 * Handle PWA installation prompt
 * This allows users to install the app to their home screen
 */
function handleInstallPrompt() {
    let deferredPrompt;
    
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', function(event) {
        console.log('PWA install prompt triggered');
        
        // Prevent the default install prompt
        event.preventDefault();
        
        // Store the event for later use
        deferredPrompt = event;
        
        // Show custom install button (we'll create this)
        showInstallButton();
    });
    
    // Handle successful installation
    window.addEventListener('appinstalled', function(event) {
        console.log('PWA was installed successfully');
        hideInstallButton();
    });
}

/**
 * Show install button for PWA
 * Creates a button that allows users to install the app
 */
function showInstallButton() {
    // Create install button if it doesn't exist
    let installButton = document.getElementById('install-button');
    if (!installButton) {
        installButton = document.createElement('button');
        installButton.id = 'install-button';
        installButton.textContent = '📱 Install App';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #49aafa;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
        `;
        
        // Add click handler for installation
        installButton.addEventListener('click', function() {
            // Trigger the install prompt
            if (window.deferredPrompt) {
                window.deferredPrompt.prompt();
                
                // Wait for user response
                window.deferredPrompt.userChoice.then(function(choiceResult) {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    window.deferredPrompt = null;
                });
            }
        });
        
        document.body.appendChild(installButton);
    }
    
    installButton.style.display = 'block';
}

/**
 * Hide the install button
 */
function hideInstallButton() {
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.style.display = 'none';
    }
}

/**
 * Add interactive content to demonstrate app functionality
 * This creates dynamic content that shows the app is working
 */
function addInteractiveContent() {
    const body = document.body;
    
    // Create a container for our interactive content
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
        margin: 40px auto;
        max-width: 600px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        backdrop-filter: blur(10px);
    `;
    
    // Add a counter to demonstrate interactivity
    const counterSection = document.createElement('div');
    counterSection.innerHTML = `
        <h3>Interactive Counter</h3>
        <p>Current count: <span id="counter-value">0</span></p>
        <button id="increment-btn" style="margin: 5px; padding: 10px 20px; background: #49aafa; color: white; border: none; border-radius: 5px; cursor: pointer;">+1</button>
        <button id="decrement-btn" style="margin: 5px; padding: 10px 20px; background: #e409f8; color: white; border: none; border-radius: 5px; cursor: pointer;">-1</button>
        <button id="reset-btn" style="margin: 5px; padding: 10px 20px; background: #20710f; color: white; border: none; border-radius: 5px; cursor: pointer;">Reset</button>
    `;
    
    contentContainer.appendChild(counterSection);
    
    // Add network status indicator
    const networkSection = document.createElement('div');
    networkSection.innerHTML = `
        <h3>Network Status</h3>
        <p>Status: <span id="network-status">Checking...</span></p>
        <p><small>This demonstrates offline functionality</small></p>
    `;
    
    contentContainer.appendChild(networkSection);
    
    // Insert the content after the h1 element
    const h1 = document.querySelector('h1');
    h1.parentNode.insertBefore(contentContainer, h1.nextSibling);
    
    // Add event listeners for the counter
    setupCounterFunctionality();
}

/**
 * Setup counter functionality
 * Demonstrates local state management and interactivity
 */
function setupCounterFunctionality() {
    let count = 0;
    const counterValue = document.getElementById('counter-value');
    const incrementBtn = document.getElementById('increment-btn');
    const decrementBtn = document.getElementById('decrement-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    // Load saved count from localStorage (demonstrates offline data persistence)
    const savedCount = localStorage.getItem('pwa-counter');
    if (savedCount !== null) {
        count = parseInt(savedCount);
        counterValue.textContent = count;
    }
    
    // Update counter display and save to localStorage
    function updateCounter() {
        counterValue.textContent = count;
        localStorage.setItem('pwa-counter', count.toString());
    }
    
    // Event listeners
    incrementBtn.addEventListener('click', function() {
        count++;
        updateCounter();
    });
    
    decrementBtn.addEventListener('click', function() {
        count--;
        updateCounter();
    });
    
    resetBtn.addEventListener('click', function() {
        count = 0;
        updateCounter();
    });
}

/**
 * Monitor network status
 * This demonstrates how PWAs can respond to online/offline changes
 */
function monitorNetworkStatus() {
    const networkStatus = document.getElementById('network-status');
    
    function updateNetworkStatus() {
        if (navigator.onLine) {
            networkStatus.textContent = '🟢 Online';
            networkStatus.style.color = '#20710f';
        } else {
            networkStatus.textContent = '🔴 Offline';
            networkStatus.style.color = '#ff4444';
        }
    }
    
    // Initial status check
    updateNetworkStatus();
    
    // Listen for network status changes
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
}

/**
 * Utility function to show notifications (if supported)
 * Demonstrates PWA notification capabilities
 */
function showNotification(title, message) {
    // Check if notifications are supported
    if ('Notification' in window) {
        // Request permission if not already granted
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/manifest/gold-star-192.png'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(function(permission) {
                if (permission === 'granted') {
                    new Notification(title, {
                        body: message,
                        icon: '/manifest/gold-star-192.png'
                    });
                }
            });
        }
    }
}