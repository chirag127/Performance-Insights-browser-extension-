/**
 * Network Monitor Module
 * 
 * Responsible for monitoring network requests and responses during webpage loading.
 */

export class NetworkMonitor {
  constructor() {
    this.requests = [];
    this.onRequestFinishedCallbacks = [];
  }
  
  /**
   * Initialize the network monitor
   * @param {Object} options - Configuration options
   */
  initialize(options = {}) {
    // This is primarily handled by the chrome.devtools.network API
    // in the devtools.js file, but we provide this class for additional
    // processing and organization
    console.log('NetworkMonitor initialized');
  }
  
  /**
   * Process a network request
   * @param {Object} request - The network request data
   */
  processRequest(request) {
    // Add the request to our collection
    this.requests.push(request);
    
    // Notify callbacks
    this.notifyRequestFinished(request);
    
    return request;
  }
  
  /**
   * Register a callback for when a request is finished
   * @param {Function} callback - The callback function
   */
  onRequestFinished(callback) {
    if (typeof callback === 'function') {
      this.onRequestFinishedCallbacks.push(callback);
    }
  }
  
  /**
   * Notify all callbacks that a request has finished
   * @param {Object} request - The finished request
   */
  notifyRequestFinished(request) {
    this.onRequestFinishedCallbacks.forEach(callback => {
      try {
        callback(request);
      } catch (error) {
        console.error('Error in request finished callback:', error);
      }
    });
  }
  
  /**
   * Get all collected requests
   * @returns {Array} - Array of requests
   */
  getRequests() {
    return [...this.requests];
  }
  
  /**
   * Clear all collected requests
   */
  clearRequests() {
    this.requests = [];
  }
  
  /**
   * Filter requests by type
   * @param {string} type - The request type to filter by
   * @returns {Array} - Filtered array of requests
   */
  filterRequestsByType(type) {
    if (type === 'all') {
      return this.getRequests();
    }
    
    return this.requests.filter(request => request.type === type);
  }
  
  /**
   * Calculate total size of all requests
   * @returns {number} - Total size in bytes
   */
  calculateTotalSize() {
    return this.requests.reduce((total, request) => {
      return total + (request.size || 0);
    }, 0);
  }
  
  /**
   * Get the number of requests
   * @returns {number} - Number of requests
   */
  getRequestCount() {
    return this.requests.length;
  }
  
  /**
   * Get the time range of all requests
   * @returns {Object} - Object with startTime and endTime
   */
  getTimeRange() {
    if (this.requests.length === 0) {
      return { startTime: 0, endTime: 0 };
    }
    
    let startTime = new Date(this.requests[0].startTime).getTime();
    let endTime = new Date(this.requests[0].endTime).getTime();
    
    this.requests.forEach(request => {
      const requestStartTime = new Date(request.startTime).getTime();
      const requestEndTime = new Date(request.endTime).getTime();
      
      if (requestStartTime < startTime) {
        startTime = requestStartTime;
      }
      
      if (requestEndTime > endTime) {
        endTime = requestEndTime;
      }
    });
    
    return { startTime, endTime };
  }
}
