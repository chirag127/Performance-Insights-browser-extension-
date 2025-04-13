// DOM Elements
const statusIndicator = document.getElementById('status-indicator');
const statusMessage = document.getElementById('status-message');
const pageLoadTime = document.getElementById('page-load-time');
const fcpTime = document.getElementById('fcp-time');
const lcpTime = document.getElementById('lcp-time');
const requestCount = document.getElementById('request-count');
const bottlenecksList = document.getElementById('bottlenecks-list');
const openDevToolsBtn = document.getElementById('open-devtools-btn');
const settingsBtn = document.getElementById('settings-btn');

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  initializePopup();
  setupEventListeners();
});

// Initialize popup state
function initializePopup() {
  // Get current tab performance data from storage
  chrome.storage.local.get(['currentTabPerformance'], (result) => {
    if (result.currentTabPerformance) {
      updatePopupWithPerformanceData(result.currentTabPerformance);
    } else {
      setWaitingState();
    }
  });
}

// Set up event listeners
function setupEventListeners() {
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'performanceData') {
      updatePopupWithPerformanceData(message.data);
    }
  });

  // Open DevTools panel button
  openDevToolsBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        // Send message to open DevTools with our panel
        chrome.runtime.sendMessage({
          type: 'openDevToolsPanel',
          tabId: tabs[0].id
        });
      }
    });
  });

  // Settings button
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

// Update popup with performance data
function updatePopupWithPerformanceData(data) {
  if (!data) return;

  // Update status
  statusIndicator.classList.add('active');
  statusMessage.textContent = 'Analysis complete';

  // Update metrics
  if (data.metrics) {
    pageLoadTime.textContent = formatTime(data.metrics.pageLoadTime);
    fcpTime.textContent = formatTime(data.metrics.firstContentfulPaint);
    lcpTime.textContent = formatTime(data.metrics.largestContentfulPaint);
    requestCount.textContent = data.metrics.requestCount || '-';
  }

  // Update bottlenecks
  if (data.bottlenecks && data.bottlenecks.length > 0) {
    bottlenecksList.innerHTML = '';
    
    // Sort bottlenecks by severity (high to low)
    const sortedBottlenecks = [...data.bottlenecks].sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
    
    // Display top 3 bottlenecks
    const topBottlenecks = sortedBottlenecks.slice(0, 3);
    
    topBottlenecks.forEach(bottleneck => {
      const bottleneckItem = document.createElement('div');
      bottleneckItem.className = `bottleneck-item ${bottleneck.severity}`;
      
      bottleneckItem.innerHTML = `
        <div class="bottleneck-title">${bottleneck.category}</div>
        <div class="bottleneck-description">${bottleneck.description}</div>
      `;
      
      bottlenecksList.appendChild(bottleneckItem);
    });
    
    // Add a "View more" link if there are more bottlenecks
    if (data.bottlenecks.length > 3) {
      const viewMoreItem = document.createElement('div');
      viewMoreItem.className = 'bottleneck-item view-more';
      viewMoreItem.innerHTML = `
        <div class="bottleneck-title">View ${data.bottlenecks.length - 3} more bottlenecks</div>
      `;
      
      viewMoreItem.addEventListener('click', () => {
        openDevToolsBtn.click();
      });
      
      bottlenecksList.appendChild(viewMoreItem);
    }
  } else {
    bottlenecksList.innerHTML = '<p class="empty-state">No bottlenecks detected.</p>';
  }
}

// Set waiting state
function setWaitingState() {
  statusIndicator.classList.remove('active', 'error');
  statusMessage.textContent = 'Waiting for page load...';
  
  pageLoadTime.textContent = '-';
  fcpTime.textContent = '-';
  lcpTime.textContent = '-';
  requestCount.textContent = '-';
  
  bottlenecksList.innerHTML = '<p class="empty-state">No bottlenecks detected yet.</p>';
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
