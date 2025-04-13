/**
 * CSS Detector
 * 
 * Detects bottlenecks related to unoptimized CSS.
 */

import { BaseDetector } from './base-detector.js';

export class CSSDetector extends BaseDetector {
  constructor() {
    super();
    this.category = 'Unoptimized CSS';
    
    // Size thresholds for CSS in bytes
    this.sizeThresholds = {
      high: 150 * 1024, // 150 KB
      medium: 75 * 1024 // 75 KB
    };
  }
  
  /**
   * Detect CSS bottlenecks
   * @param {Object} metrics - Performance metrics
   * @param {Array} resources - Array of resources
   * @returns {Array} - Array of detected bottlenecks
   */
  detect(metrics, resources) {
    if (!metrics || !resources || resources.length === 0) {
      return [];
    }
    
    const bottlenecks = [];
    
    // Get all CSS resources
    const cssResources = this.filterResourcesByType(resources, 'stylesheet');
    if (cssResources.length === 0) {
      return bottlenecks;
    }
    
    // Calculate total CSS size
    const totalCssSize = cssResources.reduce((total, resource) => {
      return total + (resource.size || 0);
    }, 0);
    
    // Check for large total CSS size
    if (totalCssSize > this.sizeThresholds.high) {
      bottlenecks.push(this.createLargeCssSizeBottleneck(totalCssSize, cssResources));
    } else if (totalCssSize > this.sizeThresholds.medium) {
      bottlenecks.push(this.createMediumCssSizeBottleneck(totalCssSize, cssResources));
    }
    
    // Check for too many CSS files
    if (cssResources.length > 4) {
      bottlenecks.push(this.createTooManyCssFilesBottleneck(cssResources));
    }
    
    // Check for large individual CSS files
    const largeCssFiles = cssResources.filter(resource => 
      (resource.size || 0) > 50 * 1024 // 50 KB
    );
    
    if (largeCssFiles.length > 0) {
      bottlenecks.push(this.createLargeCssFilesBottleneck(largeCssFiles));
    }
    
    return bottlenecks;
  }
  
  /**
   * Format size in bytes to a readable format
   * @param {number} bytes - Size in bytes
   * @returns {string} - Formatted size
   */
  formatSize(bytes) {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  }
  
  /**
   * Create a bottleneck for large total CSS size
   * @param {number} size - Total CSS size in bytes
   * @param {Array} resources - CSS resources
   * @returns {Object} - Bottleneck object
   */
  createLargeCssSizeBottleneck(size, resources) {
    return this.createBottleneck(
      'Large Total CSS Size',
      `The total CSS size is ${this.formatSize(size)}, which is significantly larger than the recommended size of 75 KB.`,
      'high',
      resources,
      [
        {
          text: 'Remove unused CSS using tools like PurgeCSS or UnCSS.',
          link: 'https://web.dev/articles/unused-css'
        },
        {
          text: 'Minify CSS files to reduce their size.',
          link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
        },
        {
          text: 'Split CSS into critical and non-critical styles.',
          link: 'https://web.dev/articles/extract-critical-css'
        },
        {
          text: 'Consider using CSS frameworks more selectively or with tree-shaking.',
          link: 'https://web.dev/articles/extract-critical-css'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for medium total CSS size
   * @param {number} size - Total CSS size in bytes
   * @param {Array} resources - CSS resources
   * @returns {Object} - Bottleneck object
   */
  createMediumCssSizeBottleneck(size, resources) {
    return this.createBottleneck(
      'Moderate Total CSS Size',
      `The total CSS size is ${this.formatSize(size)}, which is larger than the recommended size of 75 KB.`,
      'medium',
      resources,
      [
        {
          text: 'Remove unused CSS using tools like PurgeCSS or UnCSS.',
          link: 'https://web.dev/articles/unused-css'
        },
        {
          text: 'Minify CSS files to reduce their size.',
          link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
        },
        {
          text: 'Split CSS into critical and non-critical styles.',
          link: 'https://web.dev/articles/extract-critical-css'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for too many CSS files
   * @param {Array} resources - CSS resources
   * @returns {Object} - Bottleneck object
   */
  createTooManyCssFilesBottleneck(resources) {
    return this.createBottleneck(
      'Too Many CSS Files',
      `The page loads ${resources.length} CSS files, which increases HTTP requests and parsing time.`,
      'medium',
      resources,
      [
        {
          text: 'Consolidate CSS files to reduce HTTP requests.',
          link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
        },
        {
          text: 'Use CSS preprocessors or build tools to combine stylesheets.',
          link: 'https://web.dev/articles/extract-critical-css'
        },
        {
          text: 'Consider using CSS-in-JS or CSS Modules for component-based styling.',
          link: 'https://web.dev/articles/extract-critical-css'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for large individual CSS files
   * @param {Array} resources - Large CSS resources
   * @returns {Object} - Bottleneck object
   */
  createLargeCssFilesBottleneck(resources) {
    return this.createBottleneck(
      'Large CSS Files',
      `${resources.length} CSS files are larger than 50 KB, which can slow down parsing and rendering.`,
      'medium',
      resources,
      [
        {
          text: 'Remove unused CSS using tools like PurgeCSS or UnCSS.',
          link: 'https://web.dev/articles/unused-css'
        },
        {
          text: 'Minify CSS files to reduce their size.',
          link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
        },
        {
          text: 'Split large CSS files into smaller, more focused stylesheets.',
          link: 'https://web.dev/articles/extract-critical-css'
        },
        {
          text: 'Optimize CSS selectors for better performance.',
          link: 'https://web.dev/articles/extract-critical-css'
        }
      ]
    );
  }
}
