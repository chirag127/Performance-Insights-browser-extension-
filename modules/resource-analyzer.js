/**
 * Resource Analyzer Module
 * 
 * Responsible for analyzing individual resources and calculating metrics.
 */

export class ResourceAnalyzer {
  constructor() {
    this.resourceTypeMap = {
      'document': ['text/html', 'application/xhtml+xml'],
      'stylesheet': ['text/css'],
      'script': ['application/javascript', 'text/javascript', 'application/x-javascript'],
      'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      'font': ['font/woff', 'font/woff2', 'font/ttf', 'font/otf'],
      'xhr': ['application/json', 'application/xml', 'text/xml'],
      'media': ['audio/', 'video/'],
      'other': []
    };
  }
  
  /**
   * Analyze a resource
   * @param {Object} resource - The resource to analyze
   * @returns {Object} - Enhanced resource with additional analysis
   */
  analyzeResource(resource) {
    // Create a copy of the resource to avoid modifying the original
    const analyzedResource = { ...resource };
    
    // Determine resource type if not already set
    if (!analyzedResource.type) {
      analyzedResource.type = this.determineResourceType(analyzedResource);
    }
    
    // Calculate timing metrics if not already set
    if (!analyzedResource.timingBreakdown) {
      analyzedResource.timingBreakdown = this.calculateTimingBreakdown(analyzedResource);
    }
    
    // Determine if the resource is render-blocking
    analyzedResource.isRenderBlocking = this.isRenderBlocking(analyzedResource);
    
    // Calculate size metrics
    analyzedResource.sizeMetrics = this.calculateSizeMetrics(analyzedResource);
    
    return analyzedResource;
  }
  
  /**
   * Determine the type of a resource based on its MIME type or URL
   * @param {Object} resource - The resource
   * @returns {string} - The resource type
   */
  determineResourceType(resource) {
    // If the resource already has a type, use it
    if (resource.type && resource.type !== 'other') {
      return resource.type;
    }
    
    // Try to determine type from MIME type
    const mimeType = resource.mimeType || '';
    
    for (const [type, mimeTypes] of Object.entries(this.resourceTypeMap)) {
      if (type === 'other') continue;
      
      if (mimeTypes.some(mime => mimeType.startsWith(mime))) {
        return type;
      }
    }
    
    // Try to determine type from URL
    const url = resource.url || '';
    const extension = url.split('?')[0].split('#')[0].split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'css':
        return 'stylesheet';
      case 'js':
        return 'script';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg':
        return 'image';
      case 'woff':
      case 'woff2':
      case 'ttf':
      case 'otf':
        return 'font';
      case 'json':
      case 'xml':
        return 'xhr';
      case 'mp3':
      case 'mp4':
      case 'webm':
      case 'ogg':
        return 'media';
      case 'html':
      case 'htm':
        return 'document';
      default:
        return 'other';
    }
  }
  
  /**
   * Calculate timing breakdown for a resource
   * @param {Object} resource - The resource
   * @returns {Object} - Timing breakdown
   */
  calculateTimingBreakdown(resource) {
    // If we don't have timing information, return empty breakdown
    if (!resource.startTime || !resource.endTime) {
      return {
        total: resource.timing || 0,
        waiting: 0,
        downloading: 0
      };
    }
    
    const startTime = new Date(resource.startTime).getTime();
    const endTime = new Date(resource.endTime).getTime();
    const total = endTime - startTime;
    
    // Simplified breakdown - in a real implementation, we would use
    // more detailed timing information from the Resource Timing API
    return {
      total,
      waiting: total * 0.3, // Estimate - would use actual TTFB in real implementation
      downloading: total * 0.7 // Estimate - would use actual content download time
    };
  }
  
  /**
   * Determine if a resource is render-blocking
   * @param {Object} resource - The resource
   * @returns {boolean} - Whether the resource is render-blocking
   */
  isRenderBlocking(resource) {
    // CSS in the head is render-blocking
    if (resource.type === 'stylesheet') {
      return true;
    }
    
    // JavaScript can be render-blocking if not async or defer
    if (resource.type === 'script') {
      // In a real implementation, we would check for async/defer attributes
      // For now, we'll assume scripts are blocking unless they're loaded late
      return true;
    }
    
    // Fonts can block rendering if not using font-display
    if (resource.type === 'font') {
      // In a real implementation, we would check for font-display
      return false;
    }
    
    return false;
  }
  
  /**
   * Calculate size metrics for a resource
   * @param {Object} resource - The resource
   * @returns {Object} - Size metrics
   */
  calculateSizeMetrics(resource) {
    const size = resource.size || 0;
    
    // Determine if the resource is large based on its type
    let isLarge = false;
    let sizeThreshold = 0;
    
    switch (resource.type) {
      case 'document':
        sizeThreshold = 100 * 1024; // 100 KB
        break;
      case 'stylesheet':
        sizeThreshold = 50 * 1024; // 50 KB
        break;
      case 'script':
        sizeThreshold = 100 * 1024; // 100 KB
        break;
      case 'image':
        sizeThreshold = 200 * 1024; // 200 KB
        break;
      case 'font':
        sizeThreshold = 50 * 1024; // 50 KB
        break;
      default:
        sizeThreshold = 100 * 1024; // 100 KB
    }
    
    isLarge = size > sizeThreshold;
    
    return {
      size,
      isLarge,
      sizeThreshold
    };
  }
  
  /**
   * Analyze multiple resources
   * @param {Array} resources - Array of resources to analyze
   * @returns {Array} - Array of analyzed resources
   */
  analyzeResources(resources) {
    return resources.map(resource => this.analyzeResource(resource));
  }
  
  /**
   * Group resources by type
   * @param {Array} resources - Array of resources
   * @returns {Object} - Resources grouped by type
   */
  groupResourcesByType(resources) {
    const groupedResources = {};
    
    resources.forEach(resource => {
      const type = resource.type || this.determineResourceType(resource);
      
      if (!groupedResources[type]) {
        groupedResources[type] = [];
      }
      
      groupedResources[type].push(resource);
    });
    
    return groupedResources;
  }
  
  /**
   * Calculate total size of resources by type
   * @param {Array} resources - Array of resources
   * @returns {Object} - Total size by type
   */
  calculateTotalSizeByType(resources) {
    const groupedResources = this.groupResourcesByType(resources);
    const totalSizeByType = {};
    
    for (const [type, typeResources] of Object.entries(groupedResources)) {
      totalSizeByType[type] = typeResources.reduce((total, resource) => {
        return total + (resource.size || 0);
      }, 0);
    }
    
    return totalSizeByType;
  }
}
