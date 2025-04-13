/**
 * Base Bottleneck Detector
 * 
 * Base class for all bottleneck detectors with common functionality.
 */

export class BaseDetector {
  constructor() {
    // Define the category of bottlenecks this detector identifies
    this.category = 'Generic';
  }
  
  /**
   * Detect bottlenecks
   * @param {Object} metrics - Performance metrics
   * @param {Array} resources - Array of resources
   * @returns {Array} - Array of detected bottlenecks
   */
  detect(metrics, resources) {
    // This method should be overridden by subclasses
    console.warn(`${this.constructor.name}.detect() not implemented`);
    return [];
  }
  
  /**
   * Create a bottleneck object
   * @param {string} category - Bottleneck category
   * @param {string} description - Bottleneck description
   * @param {string} severity - Bottleneck severity (high, medium, low)
   * @param {Array} resources - Affected resources
   * @param {Array} suggestions - Optimization suggestions
   * @returns {Object} - Bottleneck object
   */
  createBottleneck(category, description, severity, resources = [], suggestions = []) {
    return {
      category,
      description,
      severity,
      resources,
      suggestions
    };
  }
  
  /**
   * Filter resources by type
   * @param {Array} resources - Array of resources
   * @param {string} type - Resource type
   * @returns {Array} - Filtered resources
   */
  filterResourcesByType(resources, type) {
    return resources.filter(resource => resource.type === type);
  }
  
  /**
   * Check if a resource is from a third-party domain
   * @param {Object} resource - Resource object
   * @param {string} mainDomain - Main domain of the page
   * @returns {boolean} - Whether the resource is from a third-party domain
   */
  isThirdPartyResource(resource, mainDomain) {
    if (!resource.url || !mainDomain) {
      return false;
    }
    
    try {
      const resourceUrl = new URL(resource.url);
      const resourceDomain = resourceUrl.hostname;
      
      // Check if the resource domain is a subdomain of the main domain
      if (resourceDomain === mainDomain) {
        return false;
      }
      
      if (resourceDomain.endsWith(`.${mainDomain}`)) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking if resource is third-party:', error);
      return false;
    }
  }
  
  /**
   * Get the main domain from a URL
   * @param {Array} resources - Array of resources
   * @returns {string} - Main domain
   */
  getMainDomain(resources) {
    if (!resources || resources.length === 0) {
      return '';
    }
    
    // Find the document resource (HTML)
    const documentResource = resources.find(resource => resource.type === 'document');
    
    if (documentResource && documentResource.url) {
      try {
        const url = new URL(documentResource.url);
        return url.hostname;
      } catch (error) {
        console.error('Error getting main domain:', error);
      }
    }
    
    // Fallback: use the domain of the first resource
    try {
      const url = new URL(resources[0].url);
      return url.hostname;
    } catch (error) {
      console.error('Error getting main domain from first resource:', error);
      return '';
    }
  }
}
