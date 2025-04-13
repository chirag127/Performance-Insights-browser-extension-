/**
 * JavaScript Detector
 * 
 * Detects bottlenecks related to inefficient JavaScript.
 */

import { BaseDetector } from './base-detector.js';

export class JavaScriptDetector extends BaseDetector {
  constructor() {
    super();
    this.category = 'Inefficient JavaScript';
    
    // Thresholds for JavaScript execution time
    this.executionTimeThresholds = {
      high: 300, // ms
      medium: 100 // ms
    };
    
    // Thresholds for Total Blocking Time
    this.tbtThresholds = {
      high: 300, // ms
      medium: 100 // ms
    };
  }
  
  /**
   * Detect JavaScript bottlenecks
   * @param {Object} metrics - Performance metrics
   * @param {Array} resources - Array of resources
   * @returns {Array} - Array of detected bottlenecks
   */
  detect(metrics, resources) {
    if (!metrics || !resources || resources.length === 0) {
      return [];
    }
    
    const bottlenecks = [];
    
    // Check Total Blocking Time (TBT)
    if (metrics.totalBlockingTime) {
      if (metrics.totalBlockingTime > this.tbtThresholds.high) {
        bottlenecks.push(this.createHighTBTBottleneck(metrics.totalBlockingTime));
      } else if (metrics.totalBlockingTime > this.tbtThresholds.medium) {
        bottlenecks.push(this.createMediumTBTBottleneck(metrics.totalBlockingTime));
      }
    }
    
    // Get all JavaScript resources
    const jsResources = this.filterResourcesByType(resources, 'script');
    if (jsResources.length === 0) {
      return bottlenecks;
    }
    
    // Check for too many JavaScript resources
    if (jsResources.length > 15) {
      bottlenecks.push(this.createTooManyScriptsBottleneck(jsResources));
    }
    
    // Check for large JavaScript resources
    const largeJsResources = jsResources.filter(resource => 
      (resource.size || 0) > 100 * 1024 // 100 KB
    );
    
    if (largeJsResources.length > 0) {
      // We already handle this in the ResourceSizeDetector, so we won't add a duplicate bottleneck
    }
    
    // Check for third-party scripts
    const mainDomain = this.getMainDomain(resources);
    const thirdPartyScripts = jsResources.filter(resource => 
      this.isThirdPartyResource(resource, mainDomain)
    );
    
    if (thirdPartyScripts.length > 5) {
      bottlenecks.push(this.createTooManyThirdPartyScriptsBottleneck(thirdPartyScripts));
    }
    
    return bottlenecks;
  }
  
  /**
   * Create a bottleneck for high Total Blocking Time
   * @param {number} tbt - Total Blocking Time in ms
   * @returns {Object} - Bottleneck object
   */
  createHighTBTBottleneck(tbt) {
    return this.createBottleneck(
      'High JavaScript Execution Time',
      `The page has a Total Blocking Time of ${Math.round(tbt)}ms, which significantly impacts interactivity.`,
      'high',
      [],
      [
        {
          text: 'Break up long tasks into smaller, asynchronous tasks.',
          link: 'https://web.dev/articles/optimize-long-tasks'
        },
        {
          text: 'Reduce JavaScript execution time by removing unused code.',
          link: 'https://web.dev/articles/remove-unused-code'
        },
        {
          text: 'Defer or lazy load non-critical JavaScript.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        },
        {
          text: 'Use web workers for CPU-intensive tasks to avoid blocking the main thread.',
          link: 'https://web.dev/articles/off-main-thread'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for medium Total Blocking Time
   * @param {number} tbt - Total Blocking Time in ms
   * @returns {Object} - Bottleneck object
   */
  createMediumTBTBottleneck(tbt) {
    return this.createBottleneck(
      'Moderate JavaScript Execution Time',
      `The page has a Total Blocking Time of ${Math.round(tbt)}ms, which impacts interactivity.`,
      'medium',
      [],
      [
        {
          text: 'Break up long tasks into smaller, asynchronous tasks.',
          link: 'https://web.dev/articles/optimize-long-tasks'
        },
        {
          text: 'Reduce JavaScript execution time by removing unused code.',
          link: 'https://web.dev/articles/remove-unused-code'
        },
        {
          text: 'Defer or lazy load non-critical JavaScript.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for too many scripts
   * @param {Array} resources - JavaScript resources
   * @returns {Object} - Bottleneck object
   */
  createTooManyScriptsBottleneck(resources) {
    return this.createBottleneck(
      'Too Many JavaScript Files',
      `The page loads ${resources.length} JavaScript files, which can increase HTTP requests and parsing time.`,
      'medium',
      resources,
      [
        {
          text: 'Consolidate JavaScript files to reduce HTTP requests.',
          link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
        },
        {
          text: 'Use module bundlers like Webpack or Rollup to combine scripts.',
          link: 'https://web.dev/articles/commonjs-larger-bundles'
        },
        {
          text: 'Implement code splitting to load only necessary JavaScript.',
          link: 'https://web.dev/articles/reduce-javascript-payloads-with-code-splitting'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for too many third-party scripts
   * @param {Array} resources - Third-party JavaScript resources
   * @returns {Object} - Bottleneck object
   */
  createTooManyThirdPartyScriptsBottleneck(resources) {
    return this.createBottleneck(
      'Too Many Third-Party Scripts',
      `The page loads ${resources.length} third-party scripts, which can impact performance and security.`,
      'medium',
      resources,
      [
        {
          text: 'Evaluate the necessity of each third-party script and remove unnecessary ones.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        },
        {
          text: 'Load third-party scripts asynchronously or defer their loading.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        },
        {
          text: 'Use resource hints like dns-prefetch and preconnect for third-party domains.',
          link: 'https://web.dev/articles/preconnect-and-dns-prefetch'
        },
        {
          text: 'Consider self-hosting critical third-party scripts for better control.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        }
      ]
    );
  }
}
