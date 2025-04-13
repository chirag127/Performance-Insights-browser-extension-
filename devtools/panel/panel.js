// DOM Elements
const refreshBtn = document.getElementById('refresh-btn');
const exportBtn = document.getElementById('export-btn');
const settingsBtn = document.getElementById('settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const resetSettingsBtn = document.getElementById('reset-settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const resourceFilter = document.getElementById('resource-filter');
const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const zoomResetBtn = document.getElementById('zoom-reset-btn');
const waterfallContainer = document.getElementById('waterfall-chart');
const bottlenecksContainer = document.getElementById('bottlenecks-container');

// Metric elements
const pageLoadTimeElement = document.getElementById('page-load-time');
const domContentLoadedElement = document.getElementById('dom-content-loaded');
const firstContentfulPaintElement = document.getElementById('first-contentful-paint');
const largestContentfulPaintElement = document.getElementById('largest-contentful-paint');
const timeToInteractiveElement = document.getElementById('time-to-interactive');
const totalBlockingTimeElement = document.getElementById('total-blocking-time');
const requestCountElement = document.getElementById('request-count');
const transferSizeElement = document.getElementById('transfer-size');

// Settings elements
const autoAnalysisToggle = document.getElementById('auto-analysis-toggle');
const networkThrottling = document.getElementById('network-throttling');
const suggestionLevel = document.getElementById('suggestion-level');
const metricToggles = {
  pageLoad: document.getElementById('show-page-load'),
  domContentLoaded: document.getElementById('show-dom-content-loaded'),
  fcp: document.getElementById('show-fcp'),
  lcp: document.getElementById('show-lcp'),
  tti: document.getElementById('show-tti'),
  tbt: document.getElementById('show-tbt')
};

// State
let performanceData = null;
let waterfallChart = null;
let zoomLevel = 1;
let currentFilter = 'all';

// Initialize panel
document.addEventListener('DOMContentLoaded', () => {
  initializePanel();
  setupEventListeners();
  loadSettings();
});

// Initialize panel state
function initializePanel() {
  // Create a connection to the background script
  const backgroundPageConnection = chrome.runtime.connect({
    name: "panel-page"
  });
  
  // Send the tab ID to the background script
  backgroundPageConnection.postMessage({
    type: 'panelInitialized',
    tabId: chrome.devtools.inspectedWindow.tabId
  });
  
  // Listen for messages from the background script
  backgroundPageConnection.onMessage.addListener((message) => {
    if (message.type === 'performanceData') {
      performanceData = message.data;
      updatePanelWithPerformanceData(performanceData);
    }
  });
  
  // Request current performance data
  chrome.runtime.sendMessage({
    type: 'getPerformanceData',
    tabId: chrome.devtools.inspectedWindow.tabId
  }, (response) => {
    if (response && response.data) {
      performanceData = response.data;
      updatePanelWithPerformanceData(performanceData);
    }
  });
}

// Set up event listeners
function setupEventListeners() {
  // Refresh button
  refreshBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'refreshAnalysis',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  });
  
  // Export button
  exportBtn.addEventListener('click', () => {
    if (!performanceData) return;
    
    const exportData = JSON.stringify(performanceData, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-insights-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
  
  // Settings button
  settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.add('open');
  });
  
  // Close settings button
  closeSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.remove('open');
  });
  
  // Save settings button
  saveSettingsBtn.addEventListener('click', () => {
    saveSettings();
    settingsPanel.classList.remove('open');
  });
  
  // Reset settings button
  resetSettingsBtn.addEventListener('click', () => {
    resetSettings();
  });
  
  // Resource filter
  resourceFilter.addEventListener('change', () => {
    currentFilter = resourceFilter.value;
    filterWaterfallChart(currentFilter);
  });
  
  // Zoom controls
  zoomInBtn.addEventListener('click', () => {
    zoomLevel = Math.min(zoomLevel + 0.25, 3);
    applyZoom();
  });
  
  zoomOutBtn.addEventListener('click', () => {
    zoomLevel = Math.max(zoomLevel - 0.25, 0.5);
    applyZoom();
  });
  
  zoomResetBtn.addEventListener('click', () => {
    zoomLevel = 1;
    applyZoom();
  });
}

// Update panel with performance data
function updatePanelWithPerformanceData(data) {
  if (!data) return;
  
  // Update metrics
  if (data.metrics) {
    updateMetrics(data.metrics);
  }
  
  // Update waterfall chart
  if (data.resources) {
    updateWaterfallChart(data.resources);
  }
  
  // Update bottlenecks
  if (data.bottlenecks) {
    updateBottlenecks(data.bottlenecks);
  }
}

// Update metrics display
function updateMetrics(metrics) {
  pageLoadTimeElement.textContent = formatTime(metrics.pageLoadTime);
  domContentLoadedElement.textContent = formatTime(metrics.domContentLoaded);
  firstContentfulPaintElement.textContent = formatTime(metrics.firstContentfulPaint);
  largestContentfulPaintElement.textContent = formatTime(metrics.largestContentfulPaint);
  timeToInteractiveElement.textContent = formatTime(metrics.timeToInteractive);
  totalBlockingTimeElement.textContent = formatTime(metrics.totalBlockingTime);
  requestCountElement.textContent = metrics.requestCount || '-';
  transferSizeElement.textContent = formatSize(metrics.transferSize);
}

// Update waterfall chart
function updateWaterfallChart(resources) {
  // Clear existing chart
  waterfallContainer.innerHTML = '';
  
  // Create waterfall chart
  waterfallChart = new WaterfallChart(waterfallContainer, resources);
  waterfallChart.render();
  
  // Apply current filter
  filterWaterfallChart(currentFilter);
}

// Filter waterfall chart
function filterWaterfallChart(filter) {
  if (!waterfallChart) return;
  
  waterfallChart.filter(filter);
}

// Apply zoom to waterfall chart
function applyZoom() {
  if (!waterfallChart) return;
  
  waterfallChart.setZoom(zoomLevel);
}

// Update bottlenecks display
function updateBottlenecks(bottlenecks) {
  bottlenecksContainer.innerHTML = '';
  
  if (!bottlenecks || bottlenecks.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = '<p>No bottlenecks detected.</p>';
    bottlenecksContainer.appendChild(emptyState);
    return;
  }
  
  // Sort bottlenecks by severity (high to low)
  const sortedBottlenecks = [...bottlenecks].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
  
  // Create bottleneck cards
  sortedBottlenecks.forEach(bottleneck => {
    const bottleneckCard = document.createElement('div');
    bottleneckCard.className = `bottleneck-card ${bottleneck.severity}`;
    
    // Severity badge
    const severityBadge = document.createElement('div');
    severityBadge.className = `bottleneck-severity ${bottleneck.severity}`;
    severityBadge.textContent = bottleneck.severity.charAt(0).toUpperCase() + bottleneck.severity.slice(1);
    
    // Title
    const title = document.createElement('div');
    title.className = 'bottleneck-title';
    title.textContent = bottleneck.category;
    
    // Description
    const description = document.createElement('div');
    description.className = 'bottleneck-description';
    description.textContent = bottleneck.description;
    
    // Affected resources
    const resourcesSection = document.createElement('div');
    resourcesSection.className = 'bottleneck-resources';
    
    const resourcesTitle = document.createElement('div');
    resourcesTitle.className = 'bottleneck-resources-title';
    resourcesTitle.textContent = 'Affected Resources:';
    resourcesSection.appendChild(resourcesTitle);
    
    if (bottleneck.resources && bottleneck.resources.length > 0) {
      bottleneck.resources.forEach(resource => {
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-item';
        resourceItem.textContent = resource.url;
        resourcesSection.appendChild(resourceItem);
      });
    } else {
      const noResources = document.createElement('div');
      noResources.className = 'resource-item';
      noResources.textContent = 'No specific resources identified';
      resourcesSection.appendChild(noResources);
    }
    
    // Suggestions
    const suggestionsSection = document.createElement('div');
    suggestionsSection.className = 'bottleneck-suggestions';
    
    const suggestionsTitle = document.createElement('div');
    suggestionsTitle.className = 'suggestions-title';
    suggestionsTitle.textContent = 'Optimization Suggestions:';
    suggestionsSection.appendChild(suggestionsTitle);
    
    if (bottleneck.suggestions && bottleneck.suggestions.length > 0) {
      bottleneck.suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        
        const bullet = document.createElement('span');
        bullet.className = 'suggestion-bullet';
        bullet.textContent = '•';
        
        const text = document.createElement('span');
        text.innerHTML = suggestion.text;
        
        if (suggestion.link) {
          text.innerHTML += ` <a href="${suggestion.link}" class="suggestion-link" target="_blank">Learn more</a>`;
        }
        
        suggestionItem.appendChild(bullet);
        suggestionItem.appendChild(text);
        suggestionsSection.appendChild(suggestionItem);
      });
    } else {
      const noSuggestions = document.createElement('div');
      noSuggestions.className = 'suggestion-item';
      noSuggestions.textContent = 'No specific suggestions available';
      suggestionsSection.appendChild(noSuggestions);
    }
    
    // Assemble card
    bottleneckCard.appendChild(severityBadge);
    bottleneckCard.appendChild(title);
    bottleneckCard.appendChild(description);
    bottleneckCard.appendChild(resourcesSection);
    bottleneckCard.appendChild(suggestionsSection);
    
    bottlenecksContainer.appendChild(bottleneckCard);
  });
}

// Load settings from storage
function loadSettings() {
  chrome.storage.sync.get({
    // Default settings
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
  }, (settings) => {
    // Apply settings to UI
    autoAnalysisToggle.checked = settings.autoAnalysis;
    networkThrottling.value = settings.networkThrottling;
    
    for (const [key, value] of Object.entries(settings.showMetrics)) {
      if (metricToggles[key]) {
        metricToggles[key].checked = value;
      }
    }
    
    suggestionLevel.value = settings.suggestionLevel;
    
    // Apply settings to functionality
    applySettings(settings);
  });
}

// Save settings to storage
function saveSettings() {
  const settings = {
    autoAnalysis: autoAnalysisToggle.checked,
    networkThrottling: networkThrottling.value,
    showMetrics: {
      pageLoad: metricToggles.pageLoad.checked,
      domContentLoaded: metricToggles.domContentLoaded.checked,
      fcp: metricToggles.fcp.checked,
      lcp: metricToggles.lcp.checked,
      tti: metricToggles.tti.checked,
      tbt: metricToggles.tbt.checked
    },
    suggestionLevel: suggestionLevel.value
  };
  
  chrome.storage.sync.set(settings, () => {
    console.log('Settings saved');
    
    // Apply settings
    applySettings(settings);
    
    // Notify background script
    chrome.runtime.sendMessage({
      type: 'settingsUpdated',
      settings: settings
    });
  });
}

// Reset settings to default
function resetSettings() {
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
  
  // Apply default settings to UI
  autoAnalysisToggle.checked = defaultSettings.autoAnalysis;
  networkThrottling.value = defaultSettings.networkThrottling;
  
  for (const [key, value] of Object.entries(defaultSettings.showMetrics)) {
    if (metricToggles[key]) {
      metricToggles[key].checked = value;
    }
  }
  
  suggestionLevel.value = defaultSettings.suggestionLevel;
  
  // Save default settings
  chrome.storage.sync.set(defaultSettings, () => {
    console.log('Settings reset to default');
    
    // Apply settings
    applySettings(defaultSettings);
    
    // Notify background script
    chrome.runtime.sendMessage({
      type: 'settingsUpdated',
      settings: defaultSettings
    });
  });
}

// Apply settings
function applySettings(settings) {
  // Apply network throttling
  if (settings.networkThrottling !== 'none') {
    chrome.runtime.sendMessage({
      type: 'setNetworkThrottling',
      throttling: settings.networkThrottling,
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  }
  
  // Apply metric visibility
  for (const [key, value] of Object.entries(settings.showMetrics)) {
    const metricCard = document.querySelector(`.metric-card:has(#${key.replace(/([A-Z])/g, '-$1').toLowerCase()})`);
    if (metricCard) {
      metricCard.style.display = value ? 'block' : 'none';
    }
  }
  
  // Apply suggestion level
  if (performanceData && performanceData.bottlenecks) {
    updateBottlenecks(performanceData.bottlenecks);
  }
}

// Format time in ms to a readable format
function formatTime(timeInMs) {
  if (!timeInMs && timeInMs !== 0) return '-';
  
  if (timeInMs < 1000) {
    return `${timeInMs.toFixed(0)}ms`;
  } else {
    return `${(timeInMs / 1000).toFixed(2)}s`;
  }
}

// Format size in bytes to a readable format
function formatSize(sizeInBytes) {
  if (!sizeInBytes && sizeInBytes !== 0) return '-';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = sizeInBytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}
