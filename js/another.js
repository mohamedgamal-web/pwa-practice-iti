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
    pathInfo.className = 'info-panel path-info';
    
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
    shortcutsInfo.className = 'info-panel shortcuts-info';
    
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
    
    // Add a simple game to demonstrate PWA interactivity
    const gameSection = document.createElement('div');
    gameSection.className = 'card fade-in-up';
    gameSection.innerHTML = `
        <h3>Simple PWA Game</h3>
        <p>Test PWA interactivity with this simple clicking game. Your high score is saved offline!</p>
        <div class="game-container">
            <button id="game-button" class="game-button">Click Me!</button>
            <div class="game-stats">
                <div class="game-stat">
                    <span class="game-stat-value" id="game-score">0</span>
                    <span class="game-stat-label">Score</span>
                </div>
                <div class="game-stat">
                    <span class="game-stat-value" id="game-time">30</span>
                    <span class="game-stat-label">Time</span>
                </div>
            </div>
            <button id="start-game" class="btn btn-primary">Start Game</button>
        </div>
    `;
    
    const mainContainer = document.querySelector('.main-container');
    mainContainer.appendChild(gameSection);
    
    // Add offline storage demo
    const storageSection = document.createElement('div');
    storageSection.className = 'card bounce-in';
    storageSection.innerHTML = `
        <h3>Offline Storage Demo</h3>
        <p>Add items to demonstrate offline data persistence. This works even when you're offline!</p>
        <div class="storage-container">
            <div class="storage-input-group">
                <input type="text" id="storage-input" class="storage-input" placeholder="Enter data to store...">
                <button id="save-storage" class="btn btn-success">
                Save
                </button>
            </div>
            <div id="stored-items" class="storage-items">
                <!-- Stored items will appear here -->
            </div>
        </div>
    `;
    
    mainContainer.appendChild(storageSection);
    
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
            const colors = [
                'linear-gradient(45deg, #4facfe, #00f2fe)',
                'linear-gradient(45deg, #667eea, #764ba2)',
                'linear-gradient(45deg, #f093fb, #f5576c)',
                'linear-gradient(45deg, #56ab2f, #a8e6cf)'
            ];
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
        gameButton.style.background = 'linear-gradient(45deg, #4facfe, #00f2fe)';
        
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
            storedItemsContainer.innerHTML = '<div class="empty-state">No items stored yet</div>';
            return;
        }
        
        let html = '';
        items.forEach((item, index) => {
            html += `
                <div class="storage-item">
                    <div class="storage-item-content">
                        <div class="storage-item-text">${item.text}</div>
                        <div class="storage-item-time">${item.timestamp}</div>
                    </div>
                    <button onclick="deleteItem(${index})" class="storage-item-delete">
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