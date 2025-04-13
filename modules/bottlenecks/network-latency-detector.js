/**
 * Network Latency Detector
 * 
 * Detects bottlenecks related to network latency and server response times.
 */

import { BaseDetector } from './base-detector.js';

export class NetworkLatencyDetector extends BaseDetector {
  constructor() {
    super();
    this.category = 'Network Latency';
    
    // Thresholds for TTFB (Time To First Byte)
    this.ttfbThresholds = {
      high: 600, // ms
      medium: 300 // ms
    };
  }
  
  /**
   * Detect network latency bottlenecks
   * @param {Object} metrics - Performance metrics
   * @param {Array} resources - Array of resources
   * @returns {Array} - Array of detected bottlenecks
   */
  detect(metrics, resources) {
    if (!metrics || !resources || resources.length === 0) {
      return [];
    }
    
    const bottlenecks = [];
    
    // Check for high TTFB in the main document
    const documentResources = this.filterResourcesByType(resources, 'document');
    if (documentResources.length > 0) {
      const mainDocument = documentResources[0];
      
      // Estimate TTFB from timing breakdown or use a default value
      const ttfb = mainDocument.timingBreakdown?.waiting || 0;
      
      if (ttfb > this.ttfbThresholds.high) {
        bottlenecks.push(this.createHighTTFBBottleneck(ttfb, [mainDocument]));
      } else if (ttfb > this.ttfbThresholds.medium) {
        bottlenecks.push(this.createMediumTTFBBottleneck(ttfb, [mainDocument]));
      }
    }
    
    // Check for slow DNS lookup
    // This would require more detailed timing information than we have in this implementation
    
    // Check for slow resources with high waiting times
    const slowResources = resources.filter(resource => {
      const waiting = resource.timingBreakdown?.waiting || 0;
      return waiting > this.ttfbThresholds.high;
    });
    
    if (slowResources.length > 0) {
      bottlenecks.push(this.createSlowResourcesBottleneck(slowResources));
    }
    
    return bottlenecks;
  }
  
  /**
   * Create a bottleneck for high TTFB
   * @param {number} ttfb - Time To First Byte
   * @param {Array} resources - Affected resources
   * @returns {Object} - Bottleneck object
   */
  createHighTTFBBottleneck(ttfb, resources) {
    return this.createBottleneck(
      'Slow Server Response Time',
      `The server took ${Math.round(ttfb)}ms to respond with the first byte of data, which is significantly higher than the recommended threshold of 200ms.`,
      'high',
      resources,
      [
        {
          text: 'Consider using a Content Delivery Network (CDN) to reduce latency.',
          link: 'https://web.dev/articles/content-delivery-networks'
        },
        {
          text: 'Optimize server-side processing to reduce response time.',
          link: 'https://web.dev/articles/optimize-ttfb'
        },
        {
          text: 'Implement server-side caching to improve response times.',
          link: 'https://web.dev/articles/http-cache'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for medium TTFB
   * @param {number} ttfb - Time To First Byte
   * @param {Array} resources - Affected resources
   * @returns {Object} - Bottleneck object
   */
  createMediumTTFBBottleneck(ttfb, resources) {
    return this.createBottleneck(
      'Moderate Server Response Time',
      `The server took ${Math.round(ttfb)}ms to respond with the first byte of data, which is higher than the recommended threshold of 200ms.`,
      'medium',
      resources,
      [
        {
          text: 'Consider using a Content Delivery Network (CDN) to reduce latency.',
          link: 'https://web.dev/articles/content-delivery-networks'
        },
        {
          text: 'Optimize server-side processing to reduce response time.',
          link: 'https://web.dev/articles/optimize-ttfb'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for slow resources
   * @param {Array} resources - Affected resources
   * @returns {Object} - Bottleneck object
   */
  createSlowResourcesBottleneck(resources) {
    return this.createBottleneck(
      'Slow Resource Response Times',
      `${resources.length} resources have high waiting times, indicating potential server or network latency issues.`,
      'medium',
      resources,
      [
        {
          text: 'Consider using a Content Delivery Network (CDN) for static resources.',
          link: 'https://web.dev/articles/content-delivery-networks'
        },
        {
          text: 'Implement HTTP/2 or HTTP/3 to improve connection efficiency.',
          link: 'https://web.dev/articles/performance-http2'
        },
        {
          text: 'Reduce the number of different domains serving resources to minimize DNS lookups.',
          link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
        }
      ]
    );
  }
}
