/**
 * Metrics Dashboard Module
 * 
 * Responsible for displaying performance metrics in a dashboard.
 */

export class MetricsDashboard {
  constructor(container) {
    this.container = container;
    this.metrics = {};
    this.metricElements = {};
    this.thresholds = {
      pageLoadTime: { good: 2000, medium: 4000 }, // ms
      domContentLoaded: { good: 1500, medium: 3000 }, // ms
      firstContentfulPaint: { good: 1800, medium: 3000 }, // ms
      largestContentfulPaint: { good: 2500, medium: 4000 }, // ms
      timeToInteractive: { good: 3500, medium: 7500 }, // ms
      totalBlockingTime: { good: 200, medium: 600 } // ms
    };
  }
  
  /**
   * Initialize the dashboard
   */
  initialize() {
    // Find all metric elements
    this.metricElements = {
      pageLoadTime: document.getElementById('page-load-time'),
      domContentLoaded: document.getElementById('dom-content-loaded'),
      firstContentfulPaint: document.getElementById('first-contentful-paint'),
      largestContentfulPaint: document.getElementById('largest-contentful-paint'),
      timeToInteractive: document.getElementById('time-to-interactive'),
      totalBlockingTime: document.getElementById('total-blocking-time'),
      requestCount: document.getElementById('request-count'),
      transferSize: document.getElementById('transfer-size')
    };
    
    // Initialize with empty values
    this.updateMetrics({});
  }
  
  /**
   * Update metrics in the dashboard
   * @param {Object} metrics - Performance metrics
   */
  updateMetrics(metrics) {
    this.metrics = metrics || {};
    
    // Update each metric element
    for (const [key, element] of Object.entries(this.metricElements)) {
      if (!element) continue;
      
      const value = this.metrics[key];
      
      // Update the element text
      element.textContent = this.formatMetricValue(key, value);
      
      // Update the element color based on thresholds
      this.updateMetricColor(element, key, value);
    }
  }
  
  /**
   * Format metric value based on its type
   * @param {string} key - Metric key
   * @param {*} value - Metric value
   * @returns {string} - Formatted value
   */
  formatMetricValue(key, value) {
    if (value === undefined || value === null) {
      return '-';
    }
    
    // Format time values
    if (key.includes('Time') || key.includes('Paint') || key.includes('Interactive') || key.includes('Loaded')) {
      return this.formatTime(value);
    }
    
    // Format size values
    if (key.includes('Size')) {
      return this.formatSize(value);
    }
    
    // Format count values
    if (key.includes('Count')) {
      return value.toString();
    }
    
    // Default formatting
    return value.toString();
  }
  
  /**
   * Update metric element color based on thresholds
   * @param {HTMLElement} element - Metric element
   * @param {string} key - Metric key
   * @param {*} value - Metric value
   */
  updateMetricColor(element, key, value) {
    // Remove existing color classes
    element.classList.remove('good', 'medium', 'poor');
    
    // If no value or no thresholds for this metric, return
    if (value === undefined || value === null || !this.thresholds[key]) {
      return;
    }
    
    // Get thresholds for this metric
    const { good, medium } = this.thresholds[key];
    
    // Determine color based on thresholds
    if (value <= good) {
      element.classList.add('good');
    } else if (value <= medium) {
      element.classList.add('medium');
    } else {
      element.classList.add('poor');
    }
  }
  
  /**
   * Format time in ms to a readable format
   * @param {number} timeInMs - Time in milliseconds
   * @returns {string} - Formatted time
   */
  formatTime(timeInMs) {
    if (!timeInMs && timeInMs !== 0) {
      return '-';
    }
    
    if (timeInMs < 1000) {
      return `${timeInMs.toFixed(0)}ms`;
    } else {
      return `${(timeInMs / 1000).toFixed(2)}s`;
    }
  }
  
  /**
   * Format size in bytes to a readable format
   * @param {number} bytes - Size in bytes
   * @returns {string} - Formatted size
   */
  formatSize(bytes) {
    if (!bytes && bytes !== 0) {
      return '-';
    }
    
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  }
  
  /**
   * Show or hide specific metrics
   * @param {Object} visibilitySettings - Object with metric keys and boolean values
   */
  setMetricsVisibility(visibilitySettings) {
    for (const [key, visible] of Object.entries(visibilitySettings)) {
      const element = this.metricElements[key];
      if (!element) continue;
      
      // Find the parent metric card
      const metricCard = element.closest('.metric-card');
      if (metricCard) {
        metricCard.style.display = visible ? 'block' : 'none';
      }
    }
  }
}
