// Content script for Performance Insights extension

// Store performance metrics
let performanceMetrics = {
  pageLoadTime: null,
  domContentLoaded: null,
  firstContentfulPaint: null,
  largestContentfulPaint: null,
  timeToInteractive: null,
  totalBlockingTime: null
};

// Initialize performance monitoring
initializePerformanceMonitoring();

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'refreshMetrics') {
    // Refresh performance metrics
    collectPerformanceMetrics();
    sendResponse({ success: true });
  }
  
  // Return true to indicate that we will send a response asynchronously
  return true;
});

// Initialize performance monitoring
function initializePerformanceMonitoring() {
  // Wait for window load event to collect initial metrics
  if (document.readyState === 'complete') {
    collectPerformanceMetrics();
  } else {
    window.addEventListener('load', () => {
      collectPerformanceMetrics();
    });
  }
  
  // Set up observers for performance metrics
  setupPerformanceObservers();
}

// Set up performance observers
function setupPerformanceObservers() {
  // First Contentful Paint (FCP)
  observePaintTiming('first-contentful-paint', (entry) => {
    performanceMetrics.firstContentfulPaint = entry.startTime;
    sendMetricsToBackground();
  });
  
  // Largest Contentful Paint (LCP)
  observeLargestContentfulPaint((entry) => {
    performanceMetrics.largestContentfulPaint = entry.startTime;
    sendMetricsToBackground();
  });
  
  // Layout Shifts (CLS)
  observeLayoutShifts();
  
  // Long Tasks (for TTI and TBT)
  observeLongTasks();
}

// Observe paint timing metrics
function observePaintTiming(type, callback) {
  if (!PerformanceObserver.supportedEntryTypes.includes('paint')) {
    console.warn('Paint Timing API not supported');
    return;
  }
  
  try {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === type) {
          callback(entry);
        }
      }
    });
    
    observer.observe({ type: 'paint', buffered: true });
  } catch (error) {
    console.error('Error observing paint timing:', error);
  }
}

// Observe Largest Contentful Paint
function observeLargestContentfulPaint(callback) {
  if (!PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
    console.warn('Largest Contentful Paint API not supported');
    return;
  }
  
  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        callback(lastEntry);
      }
    });
    
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    console.error('Error observing largest contentful paint:', error);
  }
}

// Observe Layout Shifts (for Cumulative Layout Shift)
function observeLayoutShifts() {
  if (!PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
    console.warn('Layout Instability API not supported');
    return;
  }
  
  try {
    let cumulativeLayoutShift = 0;
    
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // Only count layout shifts without recent user input
        if (!entry.hadRecentInput) {
          cumulativeLayoutShift += entry.value;
        }
      }
      
      // We don't include CLS in our metrics yet, but we could add it in the future
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.error('Error observing layout shifts:', error);
  }
}

// Observe Long Tasks (for TTI and TBT calculation)
function observeLongTasks() {
  if (!PerformanceObserver.supportedEntryTypes.includes('longtask')) {
    console.warn('Long Task API not supported');
    return;
  }
  
  try {
    let totalBlockingTime = 0;
    
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // Long tasks are tasks that take more than 50ms
        // TBT is the sum of the time over 50ms for each long task
        const blockingTime = entry.duration - 50;
        if (blockingTime > 0) {
          totalBlockingTime += blockingTime;
          
          performanceMetrics.totalBlockingTime = totalBlockingTime;
          sendMetricsToBackground();
        }
      }
    });
    
    observer.observe({ type: 'longtask', buffered: true });
  } catch (error) {
    console.error('Error observing long tasks:', error);
  }
}

// Collect performance metrics
function collectPerformanceMetrics() {
  // Use Performance API to get navigation timing metrics
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    
    // Page Load Time (from navigationStart to loadEventEnd)
    if (timing.loadEventEnd > 0) {
      performanceMetrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    }
    
    // DOMContentLoaded Time (from navigationStart to domContentLoadedEventEnd)
    if (timing.domContentLoadedEventEnd > 0) {
      performanceMetrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
    }
    
    // Send metrics to background script
    sendMetricsToBackground();
  }
  
  // Use newer Navigation Timing API if available
  if (window.performance && window.performance.getEntriesByType) {
    const navigationEntries = window.performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navigationTiming = navigationEntries[0];
      
      // Page Load Time
      performanceMetrics.pageLoadTime = navigationTiming.loadEventEnd;
      
      // DOMContentLoaded Time
      performanceMetrics.domContentLoaded = navigationTiming.domContentLoadedEventEnd;
      
      // Send metrics to background script
      sendMetricsToBackground();
    }
  }
  
  // Estimate Time to Interactive (TTI)
  // This is a simplified estimation and not as accurate as the web-vitals library implementation
  estimateTimeToInteractive();
}

// Estimate Time to Interactive (TTI)
function estimateTimeToInteractive() {
  // This is a simplified estimation of TTI
  // For a more accurate measurement, consider using the web-vitals library
  
  // We'll use DOMContentLoaded as a base and add a delay based on the number of resources
  // and the presence of long tasks
  if (performanceMetrics.domContentLoaded) {
    // Get all resource timing entries
    const resourceEntries = window.performance.getEntriesByType('resource');
    
    // Count the number of script resources
    const scriptCount = resourceEntries.filter(entry => 
      entry.initiatorType === 'script' || 
      (entry.name && entry.name.endsWith('.js'))
    ).length;
    
    // Estimate TTI based on DOMContentLoaded and script count
    // This is a very rough estimation
    const estimatedDelay = scriptCount * 50; // 50ms per script as a rough estimate
    performanceMetrics.timeToInteractive = performanceMetrics.domContentLoaded + estimatedDelay;
    
    // Send metrics to background script
    sendMetricsToBackground();
  }
}

// Send metrics to background script
function sendMetricsToBackground() {
  chrome.runtime.sendMessage({
    type: 'performanceMetrics',
    metrics: performanceMetrics
  });
}
