# PWA Testing Guide

This guide provides detailed instructions on how to test all Progressive Web App (PWA) features and Service Worker functionality in your project.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Basic Setup Testing](#basic-setup-testing)
3. [Service Worker Testing](#service-worker-testing)
4. [Offline Functionality Testing](#offline-functionality-testing)
5. [PWA Installation Testing](#pwa-installation-testing)
6. [Caching Strategy Testing](#caching-strategy-testing)
7. [Interactive Features Testing](#interactive-features-testing)
8. [Performance Testing](#performance-testing)
9. [Mobile Testing](#mobile-testing)
10. [Advanced Testing](#advanced-testing)
11. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Browser Developer Tools
- Local development server (already included in project)

### Browser Recommendations
- **Chrome**: Best PWA support and debugging tools
- **Firefox**: Good PWA support with excellent debugging
- **Safari**: iOS PWA testing
- **Edge**: Windows PWA testing

## Basic Setup Testing

### 1. Start the Development Server
```bash
# Make sure you're in the project directory
npm run dev
# or if using a simple HTTP server
python -m http.server 3000
# or
npx serve -p 3000
```

### 2. Verify Basic Functionality
1. Open `http://localhost:3000` in your browser
2. Check that all three pages load correctly:
   - Main page (`/index.html`)
   - Other page (`/other.html`)
   - Another page (`/below/another.html`)
3. Verify navigation between pages works
4. Check that CSS styles are applied correctly

## Service Worker Testing

### 1. Service Worker Registration
1. Open **Developer Tools** (F12)
2. Go to **Console** tab
3. Look for these messages:
   ```
   Service Worker is supported
   Service Worker registered successfully
   Service Worker: Installing...
   Service Worker: All static files cached successfully
   Service Worker: Activated and ready
   ```

### 2. Service Worker Status Check
1. In **Developer Tools**, go to **Application** tab (Chrome) or **Storage** tab (Firefox)
2. Click on **Service Workers** in the left sidebar
3. Verify:
   - Service worker is **Active and Running**
   - Source shows `/sw.js`
   - Status shows **activated**

### 3. Service Worker Updates
1. Make a small change to `sw.js` (e.g., change cache version)
2. Refresh the page
3. Check console for update messages
4. In Application tab, click **Update** to force update

## Offline Functionality Testing

### 1. Test Offline Mode
1. Open **Developer Tools**
2. Go to **Network** tab
3. Check **Offline** checkbox (or throttle to "Offline")
4. Refresh the page
5. **Expected Result**: Page should still load from cache

### 2. Test Navigation Offline
1. While offline, navigate between all pages
2. **Expected Result**: All pages should load instantly from cache
3. Check console for "Serving from cache" messages

### 3. Test Interactive Features Offline
1. While offline, test:
   - Counter functionality on main page
   - Form submission on other page
   - Game functionality on another page
2. **Expected Result**: All features should work, data should persist in localStorage

### 4. Test Network Status Detection
1. Go to main page
2. Toggle online/offline status
3. **Expected Result**: Network status indicator should update in real-time

## PWA Installation Testing

### 1. Install Prompt Testing (Desktop)
1. Visit the site in Chrome
2. Look for install button in address bar or wait for automatic prompt
3. **Alternative**: Use the floating "📱 Install App" button on the main page
4. Click install and follow prompts
5. **Expected Result**: App should install and open in standalone window

### 2. Install Prompt Testing (Mobile)
1. Open site on mobile browser
2. Look for "Add to Home Screen" option in browser menu
3. Add to home screen
4. **Expected Result**: App icon appears on home screen

### 3. Standalone Mode Testing
1. After installation, open the PWA from desktop/home screen
2. **Expected Result**: 
   - App opens without browser UI
   - No address bar visible
   - App behaves like native application

### 4. App Shortcuts Testing
1. Right-click on installed PWA icon (desktop)
2. **Expected Result**: Context menu shows shortcuts to "Other Page" and "Another Page"
3. Click shortcuts to test direct navigation

## Caching Strategy Testing

### 1. Cache Inspection
1. In **Developer Tools** → **Application** → **Storage**
2. Click on **Cache Storage**
3. Expand cache entries
4. **Expected Result**: See cached files including HTML, CSS, JS, and manifest

### 2. Cache-First Strategy Testing
1. Load a page while online
2. Go offline
3. Reload the same page
4. Check **Network** tab - should show "(from ServiceWorker)"
5. **Expected Result**: Page loads instantly from cache

### 3. Cache Update Testing
1. Modify a CSS file
2. Update cache version in `sw.js`
3. Refresh page
4. **Expected Result**: New version should be cached and served

### 4. Dynamic Caching Testing
1. While online, navigate to a page not in initial cache
2. Go offline
3. Navigate to that page again
4. **Expected Result**: Page should load from cache (was cached on first visit)

## Interactive Features Testing

### 1. Main Page Features
1. **Counter Test**:
   - Click increment/decrement buttons
   - Refresh page - counter should persist
   - Go offline and test - should still work

2. **Network Status Test**:
   - Toggle online/offline
   - Status should update immediately

3. **Install Button Test**:
   - Should appear when PWA is installable
   - Should disappear after installation

### 2. Other Page Features
1. **Form Persistence Test**:
   - Enter data in form
   - Submit form
   - Refresh page - data should be saved and displayed
   - Test offline - should still work

2. **Cache Info Test**:
   - Click "Check Cache" button
   - Should display current cache contents

3. **Performance Info Test**:
   - Check for load time display in top-right corner

### 3. Another Page Features
1. **Game Test**:
   - Click "Start Game"
   - Click the button rapidly for 30 seconds
   - Game should end and show score
   - High score should persist

2. **Storage Demo Test**:
   - Add items to storage
   - Refresh page - items should persist
   - Delete items - should remove from storage
   - Test offline - should still work

3. **Keyboard Navigation Test**:
   - Press 'H' key - should navigate to home
   - Press 'O' key - should navigate to other page

## Performance Testing

### 1. Load Time Testing
1. Open **Developer Tools** → **Network** tab
2. Disable cache (check "Disable cache")
3. Refresh page and note load time
4. Enable cache and refresh again
5. **Expected Result**: Cached version should load much faster

### 2. Lighthouse Audit
1. Open **Developer Tools** → **Lighthouse** tab
2. Select "Progressive Web App" category
3. Click "Generate report"
4. **Expected Results**:
   - PWA score should be 90+ 
   - All PWA criteria should pass
   - Performance should be good

### 3. Cache Performance
1. Check cache hit ratio in Network tab
2. Most resources should show "(from ServiceWorker)"
3. Only new/uncached resources should show network requests

## Mobile Testing

### 1. Responsive Design Testing
1. Open **Developer Tools** → **Device Toolbar** (mobile view)
2. Test different screen sizes
3. **Expected Result**: Layout should adapt to all screen sizes

### 2. Touch Interaction Testing
1. Test on actual mobile device or use touch simulation
2. All buttons and interactions should work with touch
3. **Expected Result**: No hover-dependent functionality

### 3. Mobile PWA Features
1. Test "Add to Home Screen" functionality
2. Test app launch from home screen
3. Test orientation changes
4. **Expected Result**: App should behave like native mobile app

## Advanced Testing

### 1. Background Sync Testing
1. Go offline
2. Perform actions that would normally require network
3. Go back online
4. Check console for background sync messages

### 2. Push Notification Testing
1. Grant notification permissions when prompted
2. Test notification display (if implemented)
3. Test notification click handling

### 3. App Update Testing
1. Modify app files
2. Update service worker version
3. Test update mechanism
4. **Expected Result**: Users should get updated content

### 4. Error Handling Testing
1. Test with corrupted cache
2. Test with network errors
3. Test with invalid service worker
4. **Expected Result**: App should handle errors gracefully

## Troubleshooting

### Common Issues and Solutions

#### Service Worker Not Registering
- **Problem**: Console shows service worker registration failed
- **Solution**: 
  - Check that you're serving over HTTPS or localhost
  - Verify `sw.js` file exists and is accessible
  - Check for JavaScript errors in service worker

#### PWA Not Installable
- **Problem**: No install prompt appears
- **Solution**:
  - Ensure manifest.json is properly linked
  - Check that all manifest requirements are met
  - Verify service worker is registered and active
  - Use HTTPS (or localhost for testing)

#### Offline Mode Not Working
- **Problem**: Pages don't load when offline
- **Solution**:
  - Check that service worker is caching files correctly
  - Verify cache names match in service worker
  - Check Network tab for cache hits
  - Clear cache and re-register service worker

#### Cache Not Updating
- **Problem**: Changes don't appear after updates
- **Solution**:
  - Update cache version in service worker
  - Use "Update on reload" in Application tab
  - Clear browser cache manually
  - Check cache strategy implementation

#### Features Not Working Offline
- **Problem**: Interactive features fail when offline
- **Solution**:
  - Ensure features use localStorage, not network requests
  - Check that all required files are cached
  - Verify service worker is handling requests correctly

### Debug Tools

#### Chrome DevTools
- **Application Tab**: Service worker status, cache inspection, manifest validation
- **Network Tab**: Cache hits, service worker requests
- **Console**: Service worker logs and errors
- **Lighthouse**: PWA audit and recommendations

#### Firefox DevTools
- **Storage Tab**: Service worker and cache inspection
- **Network Tab**: Service worker request handling
- **Console**: Debug messages and errors

### Testing Checklist

Use this checklist to ensure comprehensive testing:

- [ ] Service worker registers successfully
- [ ] All pages load online
- [ ] All pages load offline
- [ ] Navigation works offline
- [ ] Interactive features work offline
- [ ] Data persists across sessions
- [ ] PWA can be installed
- [ ] Installed PWA opens in standalone mode
- [ ] Cache strategy works correctly
- [ ] Performance is acceptable
- [ ] Mobile experience is good
- [ ] Lighthouse PWA audit passes
- [ ] Error handling works
- [ ] Updates work correctly

## Testing Best Practices

1. **Test in Multiple Browsers**: Different browsers have different PWA support levels
2. **Test on Real Devices**: Mobile testing should include actual devices
3. **Test Network Conditions**: Use various network speeds and offline scenarios
4. **Test Edge Cases**: What happens with corrupted cache, network errors, etc.
5. **Regular Testing**: Test PWA features with each code change
6. **User Testing**: Have real users test the PWA experience

## Conclusion

This testing guide covers all aspects of PWA functionality. Regular testing ensures your PWA provides a reliable, app-like experience across all platforms and network conditions. Remember that PWA features may vary between browsers and platforms, so comprehensive testing is essential for a good user experience.