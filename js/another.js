/**
 * JavaScript for the "Another" page (in the below folder)
 * This demonstrates how PWAs work across different directory structures
 * and how service workers handle different paths
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Another page loaded');
    
    // Initialize page features
    initializeAnotherPageFeatures();
    
    // Add interactive content
    addAnotherPageContent();
    
    // Test service worker functionality from subdirectory
    testServiceWorkerFromSubdirectory();
});

/**
 * Initialize features for the "Another" page
 */
function initializeAnotherPageFeatures() {
    console.log('Initializing Another page features');
    
    // Show current path information
    showPathInfo();
    
    // Add navigation helper
    addNavigationHelper();
}

/**
 * Show current path information
 * Helps understand how PWAs handle different directory structures
 */
function showPathInfo() {
    const pathInfo = document.createElement('div');
    pathInfo.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 8px 12px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 1000;
        max-width: 300px;
    `;
    
    pathInfo.innerHTML = `
        <strong>Path Info:</strong><br>
        Current URL: ${window.location.href}<br>
        Pathname: ${window.location.pathname}<br>
        Origin: ${window.location.origin}
    `;
    
    document.body.appendChild(pathInfo);
}

/**
 * Add navigation helper
 * Shows how to handle navigation in PWAs
 */
function addNavigationHelper() {
    // Add keyboard navigation
    document.addEventListener('keydown', function(event) {
        // Press 'h' to go home
        if (event.key === 'h' || event.key === 'H') {
            window.location.href = '../index.html';
        }
        // Press 'o' to go to other page
        if (event.key === 'o' || event.key === 'O') {
            window.location.href = '../other.html';
        }
    });
    
    // Show keyboard shortcuts
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(255,255,255,0.9);
        color: #333;
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 1000;
    `;
    
    shortcutsInfo.innerHTML = `
        <strong>Keyboard Shortcuts:</strong><br>
        Press 'H' - Go to Home<br>
        Press 'O' - Go to Other page
    `;
    
    document.body.appendChild(shortcutsInfo);
}

/**
 * Add content specific to this page
 */
function addAnotherPageContent() {
    const body = document.body;
    
    // Create content container
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
    
    // Add a simple game to demonstrate PWA interactivity
    const gameSection = document.createElement('div');
    gameSection.innerHTML = `
        <h3>Simple PWA Game</h3>
        <p>Click the button as fast as you can!</p>
        <div style="margin: 20px 0;">
            <button id="game-button" style="
                width: 100px; 
                height: 100px; 
                border-radius: 50%; 
                border: none; 
                background: #20710f; 
                color: white; 
                font-size: 18px; 
                cursor: pointer;
                transition: all 0.1s;
            ">Click Me!</button>
        </div>
        <div>
            <p>Score: <span id="game-score">0</span></p>
            <p>Time: <span id="game-time">30</span>s</p>
            <button id="start-game" style="padding: 10px 20px; background: #8fd581; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Start Game
            </button>
        </div>
    `;
    
    contentContainer.appendChild(gameSection);
    
    // Add offline storage demo
    const storageSection = document.createElement('div');
    storageSection.innerHTML = `
        <h3>Offline Storage Demo</h3>
        <p>This data persists even when offline:</p>
        <div style="margin: 20px 0;">
            <input type="text" id="storage-input" placeholder="Enter data to store..." 
                   style="padding: 8px; margin: 5px; border: none; border-radius: 3px; width: 200px;">
            <button id="save-storage" style="padding: 8px 15px; background: #20710f; color: white; border: none; border-radius: 3px; cursor: pointer;">
                Save
            </button>
        </div>
        <div id="stored-items" style="text-align: left; max-height: 200px; overflow-y: auto; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px;">
            <!-- Stored items will appear here -->
        </div>
    `;
    
    contentContainer.appendChild(storageSection);
    
    // Insert after h1
    const h1 = document.querySelector('h1');
    h1.parentNode.insertBefore(contentContainer, h1.nextSibling);
    
    // Setup game functionality
    setupSimpleGame();
    
    // Setup storage demo
    setupStorageDemo();
}

/**
 * Setup simple clicking game
 * Demonstrates PWA interactivity and local state management
 */
function setupSimpleGame() {
    const gameButton = document.getElementById('game-button');
    const scoreDisplay = document.getElementById('game-score');
    const timeDisplay = document.getElementById('game-time');
    const startButton = document.getElementById('start-game');
    
    let score = 0;
    let timeLeft = 30;
    let gameActive = false;
    let gameTimer;
    
    // Game button click handler
    gameButton.addEventListener('click', function() {
        if (gameActive) {
            score++;
            scoreDisplay.textContent = score;
            
            // Visual feedback
            gameButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                gameButton.style.transform = 'scale(1)';
            }, 100);
            
            // Change button color randomly
            const colors = ['#20710f', '#e409f8', '#49aafa', '#ff6b6b'];
            gameButton.style.background = colors[Math.floor(Math.random() * colors.length)];
        }
    });
    
    // Start game handler
    startButton.addEventListener('click', function() {
        if (!gameActive) {
            startGame();
        }
    });
    
    function startGame() {
        gameActive = true;
        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = score;
        timeDisplay.textContent = timeLeft;
        startButton.textContent = 'Game Running...';
        startButton.disabled = true;
        
        // Start countdown timer
        gameTimer = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }
    
    function endGame() {
        gameActive = false;
        clearInterval(gameTimer);
        startButton.textContent = 'Start Game';
        startButton.disabled = false;
        gameButton.style.background = '#20710f';
        
        // Save high score
        const highScore = localStorage.getItem('pwa-game-highscore') || 0;
        if (score > highScore) {
            localStorage.setItem('pwa-game-highscore', score);
            alert(`New High Score: ${score}!`);
        } else {
            alert(`Game Over! Score: ${score} (High Score: ${highScore})`);
        }
    }
}

/**
 * Setup offline storage demonstration
 * Shows how PWAs can store data locally
 */
function setupStorageDemo() {
    const storageInput = document.getElementById('storage-input');
    const saveButton = document.getElementById('save-storage');
    const storedItemsContainer = document.getElementById('stored-items');
    
    // Load existing items
    loadStoredItems();
    
    // Save button handler
    saveButton.addEventListener('click', function() {
        const inputValue = storageInput.value.trim();
        if (inputValue) {
            saveItem(inputValue);
            storageInput.value = '';
            loadStoredItems();
        }
    });
    
    // Enter key handler
    storageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            saveButton.click();
        }
    });
    
    function saveItem(item) {
        // Get existing items
        const existingItems = JSON.parse(localStorage.getItem('pwa-stored-items') || '[]');
        
        // Add new item with timestamp
        existingItems.push({
            text: item,
            timestamp: new Date().toLocaleString()
        });
        
        // Save back to localStorage
        localStorage.setItem('pwa-stored-items', JSON.stringify(existingItems));
    }
    
    function loadStoredItems() {
        const items = JSON.parse(localStorage.getItem('pwa-stored-items') || '[]');
        
        if (items.length === 0) {
            storedItemsContainer.innerHTML = '<p style="color: #ccc; font-style: italic;">No items stored yet</p>';
            return;
        }
        
        let html = '';
        items.forEach((item, index) => {
            html += `
                <div style="margin: 5px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 3px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${item.text}</strong><br>
                        <small style="color: #ccc;">${item.timestamp}</small>
                    </div>
                    <button onclick="deleteItem(${index})" style="background: #ff4444; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 12px;">
                        Delete
                    </button>
                </div>
            `;
        });
        
        storedItemsContainer.innerHTML = html;
    }
    
    // Make deleteItem function globally available
    window.deleteItem = function(index) {
        const items = JSON.parse(localStorage.getItem('pwa-stored-items') || '[]');
        items.splice(index, 1);
        localStorage.setItem('pwa-stored-items', JSON.stringify(items));
        loadStoredItems();
    };
}

/**
 * Test service worker functionality from subdirectory
 * Demonstrates how service workers work across different paths
 */
function testServiceWorkerFromSubdirectory() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function(registration) {
            console.log('Service Worker is ready from subdirectory');
            
            // Test if this page is cached
            caches.match(window.location.href).then(function(response) {
                if (response) {
                    console.log('This page is cached by service worker');
                } else {
                    console.log('This page is not cached by service worker');
                }
            });
        });
    }
}