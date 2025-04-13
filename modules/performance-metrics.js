/**
 * Performance Metrics Calculator Module
 * 
 * Responsible for calculating key performance metrics using browser performance APIs.
 */

export class PerformanceMetricsCalculator {
  constructor() {
    this.metrics = {
      pageLoadTime: null,
      domContentLoaded: null,
      firstContentfulPaint: null,
      largestContentfulPaint: null,
      timeToInteractive: null,
      totalBlockingTime: null,
      requestCount: 0,
      transferSize: 0,
      pageSize: 0
    };
    
    this.observers = {};
  }
  
  /**
   * Initialize performance metrics collection
   * @param {Object} options - Configuration options
   */
  initialize(options = {}) {
    // Set up performance observers if we're in a browser environment
    if (typeof window !== 'undefined' && window.PerformanceObserver) {
      this.setupPerformanceObservers();
    }
    
    console.log('PerformanceMetricsCalculator initialized');
  }
  
  /**
   * Set up performance observers
   */
  setupPerformanceObservers() {
    // First Contentful Paint (FCP)
    this.observePaintTiming('first-contentful-paint', (entry) => {
      this.metrics.firstContentfulPaint = entry.startTime;
    });
    
    // Largest Contentful Paint (LCP)
    this.observeLargestContentfulPaint((entry) => {
      this.metrics.largestContentfulPaint = entry.startTime;
    });
    
    // Long Tasks (for TTI and TBT)
    this.observeLongTasks();
  }
  
  /**
   * Observe paint timing metrics
   * @param {string} type - The paint timing type to observe
   * @param {Function} callback - Callback function for entries
   */
  observePaintTiming(type, callback) {
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
      this.observers.paint = observer;
    } catch (error) {
      console.error('Error observing paint timing:', error);
    }
  }
  
  /**
   * Observe Largest Contentful Paint
   * @param {Function} callback - Callback function for entries
   */
  observeLargestContentfulPaint(callback) {
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
      this.observers.lcp = observer;
    } catch (error) {
      console.error('Error observing largest contentful paint:', error);
    }
  }
  
  /**
   * Observe Long Tasks (for TTI and TBT calculation)
   */
  observeLongTasks() {
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
            this.metrics.totalBlockingTime = totalBlockingTime;
          }
        }
      });
      
      observer.observe({ type: 'longtask', buffered: true });
      this.observers.longtask = observer;
    } catch (error) {
      console.error('Error observing long tasks:', error);
    }
  }
  
  /**
   * Collect performance metrics from the Performance API
   */
  collectNavigationTimingMetrics() {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }
    
    // Use newer Navigation Timing API if available
    if (window.performance.getEntriesByType) {
      const navigationEntries = window.performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const navigationTiming = navigationEntries[0];
        
        // Page Load Time
        this.metrics.pageLoadTime = navigationTiming.loadEventEnd;
        
        // DOMContentLoaded Time
        this.metrics.domContentLoaded = navigationTiming.domContentLoadedEventEnd;
        
        // Transfer Size
        this.metrics.transferSize = navigationTiming.transferSize || 0;
        
        // Page Size (decoded body size)
        this.metrics.pageSize = navigationTiming.decodedBodySize || 0;
      }
    } 
    // Fall back to older Performance Timing API
    else if (window.performance.timing) {
      const timing = window.performance.timing;
      
      // Page Load Time (from navigationStart to loadEventEnd)
      if (timing.loadEventEnd > 0) {
        this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      }
      
      // DOMContentLoaded Time (from navigationStart to domContentLoadedEventEnd)
      if (timing.domContentLoadedEventEnd > 0) {
        this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      }
    }
  }
  
  /**
   * Estimate Time to Interactive (TTI)
   * This is a simplified estimation and not as accurate as the web-vitals library implementation
   */
  estimateTimeToInteractive() {
    // This is a simplified estimation of TTI
    // For a more accurate measurement, consider using the web-vitals library
    
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }
    
    // We'll use DOMContentLoaded as a base and add a delay based on the number of resources
    // and the presence of long tasks
    if (this.metrics.domContentLoaded) {
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
      this.metrics.timeToInteractive = this.metrics.domContentLoaded + estimatedDelay;
    }
  }
  
  /**
   * Update resource-related metrics
   * @param {Array} resources - Array of resources
   */
  updateResourceMetrics(resources) {
    if (!resources) return;
    
    // Update request count
    this.metrics.requestCount = resources.length;
    
    // Update transfer size
    this.metrics.transferSize = resources.reduce((total, resource) => {
      return total + (resource.size || 0);
    }, 0);
  }
  
  /**
   * Get all collected metrics
   * @returns {Object} - Performance metrics
   */
  getMetrics() {
    // Collect navigation timing metrics
    this.collectNavigationTimingMetrics();
    
    // Estimate TTI if not already set
    if (!this.metrics.timeToInteractive) {
      this.estimateTimeToInteractive();
    }
    
    return { ...this.metrics };
  }
  
  /**
   * Disconnect all performance observers
   */
  disconnect() {
    Object.values(this.observers).forEach(observer => {
      if (observer && typeof observer.disconnect === 'function') {
        observer.disconnect();
      }
    });
  }
  
  /**
   * Reset all metrics
   */
  reset() {
    this.metrics = {
      pageLoadTime: null,
      domContentLoaded: null,
      firstContentfulPaint: null,
      largestContentfulPaint: null,
      timeToInteractive: null,
      totalBlockingTime: null,
      requestCount: 0,
      transferSize: 0,
      pageSize: 0
    };
    
    // Disconnect and reconnect observers
    this.disconnect();
    this.setupPerformanceObservers();
  }
}
