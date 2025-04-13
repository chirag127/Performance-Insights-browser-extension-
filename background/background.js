// Background script for Performance Insights extension

// Store connections to DevTools panels
const devToolsConnections = {};

// Store performance data for each tab
const tabPerformanceData = {};

// Default settings
const defaultSettings = {
  autoAnalysis: true,
  networkThrottling: 'none',
  showMetrics: {
    pageLoad: true,
    domContentLoaded: true,
    fcp: true,
    lcp: true,
    tti: true,
    tbt: true
  },
  suggestionLevel: 'intermediate'
};

// Current settings
let settings = { ...defaultSettings };

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Performance Insights extension installed');
  
  // Initialize settings
  chrome.storage.sync.get(defaultSettings, (storedSettings) => {
    settings = storedSettings;
  });
});

// Listen for connections from DevTools pages
chrome.runtime.onConnect.addListener((port) => {
  // Check if the connection is from a DevTools page
  if (port.name === "devtools-page" || port.name === "panel-page") {
    // Add listener for messages from DevTools page
    const listener = (message) => {
      // Handle messages from DevTools page
      if (message.type === 'init' && message.tabId) {
        // Store the connection for this tab
        devToolsConnections[message.tabId] = port;
        
        // Remove the connection when the DevTools page is closed
        port.onDisconnect.addListener(() => {
          delete devToolsConnections[message.tabId];
        });
      } else if (message.type === 'networkRequest' && message.tabId) {
        // Process network request data
        processNetworkRequest(message.tabId, message.request);
      } else if (message.type === 'panelInitialized' && message.tabId) {
        // Panel has been initialized, send any existing performance data
        if (tabPerformanceData[message.tabId]) {
          port.postMessage({
            type: 'performanceData',
            data: tabPerformanceData[message.tabId]
          });
        }
      }
    };
    
    // Add the message listener
    port.onMessage.addListener(listener);
  }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle messages from content scripts and popup
  if (message.type === 'performanceMetrics' && sender.tab) {
    // Process performance metrics from content script
    processPerformanceMetrics(sender.tab.id, message.metrics);
    
    // Send response
    sendResponse({ success: true });
  } else if (message.type === 'getPerformanceData') {
    // Return performance data for the specified tab
    const tabId = message.tabId;
    sendResponse({
      success: true,
      data: tabPerformanceData[tabId] || null
    });
  } else if (message.type === 'refreshAnalysis') {
    // Trigger a refresh of the analysis for the specified tab
    const tabId = message.tabId;
    refreshAnalysis(tabId);
    
    // Send response
    sendResponse({ success: true });
  } else if (message.type === 'openDevToolsPanel') {
    // Open DevTools with our panel
    // Note: This is not directly possible through the extension API
    // We can only suggest the user to open DevTools manually
    
    // Send response
    sendResponse({ success: true });
  } else if (message.type === 'settingsUpdated') {
    // Update settings
    settings = message.settings;
    
    // Send response
    sendResponse({ success: true });
  } else if (message.type === 'setNetworkThrottling') {
    // Set network throttling for the specified tab
    // Note: This requires the chrome.debugger API which needs additional permissions
    
    // Send response
    sendResponse({ success: true });
  } else if (message.type === 'devtoolsPanelShown' || message.type === 'devtoolsPanelHidden') {
    // Handle DevTools panel visibility changes
    
    // Send response
    sendResponse({ success: true });
  }
  
  // Return true to indicate that we will send a response asynchronously
  return true;
});

// Process network request data
function processNetworkRequest(tabId, request) {
  // Initialize performance data for this tab if it doesn't exist
  if (!tabPerformanceData[tabId]) {
    initializeTabPerformanceData(tabId);
  }
  
  // Add the request to the resources array
  tabPerformanceData[tabId].resources.push(request);
  
  // Update request count
  tabPerformanceData[tabId].metrics.requestCount = tabPerformanceData[tabId].resources.length;
  
  // Update transfer size
  tabPerformanceData[tabId].metrics.transferSize += request.size || 0;
  
  // Analyze for bottlenecks
  analyzeBottlenecks(tabId);
  
  // Notify DevTools panel if connected
  notifyDevToolsPanel(tabId);
}

// Process performance metrics from content script
function processPerformanceMetrics(tabId, metrics) {
  // Initialize performance data for this tab if it doesn't exist
  if (!tabPerformanceData[tabId]) {
    initializeTabPerformanceData(tabId);
  }
  
  // Update metrics
  tabPerformanceData[tabId].metrics = {
    ...tabPerformanceData[tabId].metrics,
    ...metrics
  };
  
  // Analyze for bottlenecks
  analyzeBottlenecks(tabId);
  
  // Notify DevTools panel if connected
  notifyDevToolsPanel(tabId);
  
  // Store current tab performance data for popup
  chrome.storage.local.set({
    currentTabPerformance: tabPerformanceData[tabId]
  });
}

// Initialize performance data for a tab
function initializeTabPerformanceData(tabId) {
  tabPerformanceData[tabId] = {
    metrics: {
      pageLoadTime: null,
      domContentLoaded: null,
      firstContentfulPaint: null,
      largestContentfulPaint: null,
      timeToInteractive: null,
      totalBlockingTime: null,
      requestCount: 0,
      transferSize: 0
    },
    resources: [],
    bottlenecks: []
  };
}

// Analyze bottlenecks for a tab
function analyzeBottlenecks(tabId) {
  const data = tabPerformanceData[tabId];
  if (!data) return;
  
  // Clear existing bottlenecks
  data.bottlenecks = [];
  
  // Import bottleneck detector module
  import('../modules/bottleneck-detector.js')
    .then(module => {
      // Detect bottlenecks
      const bottleneckDetector = new module.BottleneckDetector();
      data.bottlenecks = bottleneckDetector.detectBottlenecks(data.metrics, data.resources);
      
      // Notify DevTools panel if connected
      notifyDevToolsPanel(tabId);
      
      // Update storage for popup
      chrome.storage.local.set({
        currentTabPerformance: data
      });
    })
    .catch(error => {
      console.error('Error importing bottleneck detector:', error);
    });
}

// Notify DevTools panel of updated performance data
function notifyDevToolsPanel(tabId) {
  if (devToolsConnections[tabId]) {
    devToolsConnections[tabId].postMessage({
      type: 'performanceData',
      data: tabPerformanceData[tabId]
    });
  }
}

// Refresh analysis for a tab
function refreshAnalysis(tabId) {
  // Clear existing performance data
  delete tabPerformanceData[tabId];
  
  // Initialize new performance data
  initializeTabPerformanceData(tabId);
  
  // Notify DevTools panel if connected
  notifyDevToolsPanel(tabId);
  
  // Notify content script to refresh metrics
  chrome.tabs.sendMessage(tabId, {
    type: 'refreshMetrics'
  });
  
  // Update storage for popup
  chrome.storage.local.set({
    currentTabPerformance: tabPerformanceData[tabId]
  });
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    // Clear existing performance data when the tab starts loading
    delete tabPerformanceData[tabId];
    
    // Initialize new performance data
    initializeTabPerformanceData(tabId);
    
    // Notify DevTools panel if connected
    notifyDevToolsPanel(tabId);
    
    // Update storage for popup
    chrome.storage.local.set({
      currentTabPerformance: tabPerformanceData[tabId]
    });
  }
});
