/**
 * Resource Size Detector
 * 
 * Detects bottlenecks related to large resource sizes.
 */

import { BaseDetector } from './base-detector.js';

export class ResourceSizeDetector extends BaseDetector {
  constructor() {
    super();
    this.category = 'Resource Size';
    
    // Size thresholds in bytes
    this.sizeThresholds = {
      total: {
        high: 3 * 1024 * 1024, // 3 MB
        medium: 1.5 * 1024 * 1024 // 1.5 MB
      },
      js: {
        high: 500 * 1024, // 500 KB
        medium: 250 * 1024 // 250 KB
      },
      css: {
        high: 150 * 1024, // 150 KB
        medium: 75 * 1024 // 75 KB
      },
      image: {
        high: 200 * 1024, // 200 KB
        medium: 100 * 1024 // 100 KB
      },
      font: {
        high: 100 * 1024, // 100 KB
        medium: 50 * 1024 // 50 KB
      }
    };
  }
  
  /**
   * Detect resource size bottlenecks
   * @param {Object} metrics - Performance metrics
   * @param {Array} resources - Array of resources
   * @returns {Array} - Array of detected bottlenecks
   */
  detect(metrics, resources) {
    if (!metrics || !resources || resources.length === 0) {
      return [];
    }
    
    const bottlenecks = [];
    
    // Check total page size
    const totalSize = metrics.transferSize || this.calculateTotalSize(resources);
    if (totalSize > this.sizeThresholds.total.high) {
      bottlenecks.push(this.createLargeTotalSizeBottleneck(totalSize, resources));
    } else if (totalSize > this.sizeThresholds.total.medium) {
      bottlenecks.push(this.createMediumTotalSizeBottleneck(totalSize, resources));
    }
    
    // Check JavaScript size
    const jsResources = this.filterResourcesByType(resources, 'script');
    const jsSize = this.calculateTotalSize(jsResources);
    if (jsSize > this.sizeThresholds.js.high) {
      bottlenecks.push(this.createLargeJavaScriptBottleneck(jsSize, jsResources));
    } else if (jsSize > this.sizeThresholds.js.medium && jsResources.length > 0) {
      bottlenecks.push(this.createMediumJavaScriptBottleneck(jsSize, jsResources));
    }
    
    // Check CSS size
    const cssResources = this.filterResourcesByType(resources, 'stylesheet');
    const cssSize = this.calculateTotalSize(cssResources);
    if (cssSize > this.sizeThresholds.css.high) {
      bottlenecks.push(this.createLargeCSSBottleneck(cssSize, cssResources));
    } else if (cssSize > this.sizeThresholds.css.medium && cssResources.length > 0) {
      bottlenecks.push(this.createMediumCSSBottleneck(cssSize, cssResources));
    }
    
    // Check for individual large resources
    const largeResources = resources.filter(resource => {
      const size = resource.size || 0;
      const type = resource.type || 'other';
      
      if (this.sizeThresholds[type]) {
        return size > this.sizeThresholds[type].high;
      }
      
      // Default threshold for other resource types
      return size > 200 * 1024; // 200 KB
    });
    
    if (largeResources.length > 0) {
      bottlenecks.push(this.createLargeResourcesBottleneck(largeResources));
    }
    
    return bottlenecks;
  }
  
  /**
   * Calculate total size of resources
   * @param {Array} resources - Array of resources
   * @returns {number} - Total size in bytes
   */
  calculateTotalSize(resources) {
    return resources.reduce((total, resource) => {
      return total + (resource.size || 0);
    }, 0);
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
   * Create a bottleneck for large total page size
   * @param {number} size - Total size in bytes
   * @param {Array} resources - All resources
   * @returns {Object} - Bottleneck object
   */
  createLargeTotalSizeBottleneck(size, resources) {
    return this.createBottleneck(
      'Large Total Page Size',
      `The total page size is ${this.formatSize(size)}, which is significantly larger than the recommended size of 1.5 MB.`,
      'high',
      resources,
      [
        {
          text: 'Compress text resources (HTML, CSS, JavaScript) using Gzip or Brotli.',
          link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
        },
        {
          text: 'Optimize images by using modern formats, proper compression, and appropriate dimensions.',
          link: 'https://web.dev/articles/use-imagemin-to-compress-images'
        },
        {
          text: 'Implement code splitting for JavaScript to load only what is needed.',
          link: 'https://web.dev/articles/reduce-javascript-payloads-with-code-splitting'
        },
        {
          text: 'Remove unused CSS and JavaScript code.',
          link: 'https://web.dev/articles/unused-javascript'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for medium total page size
   * @param {number} size - Total size in bytes
   * @param {Array} resources - All resources
   * @returns {Object} - Bottleneck object
   */
  createMediumTotalSizeBottleneck(size, resources) {
    return this.createBottleneck(
      'Moderate Total Page Size',
      `The total page size is ${this.formatSize(size)}, which is larger than the recommended size of 1.5 MB.`,
      'medium',
      resources,
      [
        {
          text: 'Compress text resources (HTML, CSS, JavaScript) using Gzip or Brotli.',
          link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
        },
        {
          text: 'Optimize images by using modern formats, proper compression, and appropriate dimensions.',
          link: 'https://web.dev/articles/use-imagemin-to-compress-images'
        },
        {
          text: 'Implement code splitting for JavaScript to load only what is needed.',
          link: 'https://web.dev/articles/reduce-javascript-payloads-with-code-splitting'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for large JavaScript size
   * @param {number} size - JavaScript size in bytes
   * @param {Array} resources - JavaScript resources
   * @returns {Object} - Bottleneck object
   */
  createLargeJavaScriptBottleneck(size, resources) {
    return this.createBottleneck(
      'Large JavaScript Payload',
      `The total JavaScript size is ${this.formatSize(size)}, which is significantly larger than the recommended size of 250 KB.`,
      'high',
      resources,
      [
        {
          text: 'Implement code splitting to load JavaScript only when needed.',
          link: 'https://web.dev/articles/reduce-javascript-payloads-with-code-splitting'
        },
        {
          text: 'Remove unused JavaScript code using tree shaking.',
          link: 'https://web.dev/articles/remove-unused-code'
        },
        {
          text: 'Minify JavaScript files to reduce their size.',
          link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
        },
        {
          text: 'Consider using smaller JavaScript libraries or alternatives.',
          link: 'https://web.dev/articles/commonjs-larger-bundles'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for medium JavaScript size
   * @param {number} size - JavaScript size in bytes
   * @param {Array} resources - JavaScript resources
   * @returns {Object} - Bottleneck object
   */
  createMediumJavaScriptBottleneck(size, resources) {
    return this.createBottleneck(
      'Moderate JavaScript Payload',
      `The total JavaScript size is ${this.formatSize(size)}, which is larger than the recommended size of 250 KB.`,
      'medium',
      resources,
      [
        {
          text: 'Implement code splitting to load JavaScript only when needed.',
          link: 'https://web.dev/articles/reduce-javascript-payloads-with-code-splitting'
        },
        {
          text: 'Remove unused JavaScript code using tree shaking.',
          link: 'https://web.dev/articles/remove-unused-code'
        },
        {
          text: 'Minify JavaScript files to reduce their size.',
          link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for large CSS size
   * @param {number} size - CSS size in bytes
   * @param {Array} resources - CSS resources
   * @returns {Object} - Bottleneck object
   */
  createLargeCSSBottleneck(size, resources) {
    return this.createBottleneck(
      'Large CSS Payload',
      `The total CSS size is ${this.formatSize(size)}, which is significantly larger than the recommended size of 75 KB.`,
      'high',
      resources,
      [
        {
          text: 'Remove unused CSS using tools like PurgeCSS.',
          link: 'https://web.dev/articles/unused-css'
        },
        {
          text: 'Minify CSS files to reduce their size.',
          link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
        },
        {
          text: 'Consider using CSS frameworks more selectively or with tree-shaking.',
          link: 'https://web.dev/articles/extract-critical-css'
        },
        {
          text: 'Split CSS into critical and non-critical styles.',
          link: 'https://web.dev/articles/extract-critical-css'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for medium CSS size
   * @param {number} size - CSS size in bytes
   * @param {Array} resources - CSS resources
   * @returns {Object} - Bottleneck object
   */
  createMediumCSSBottleneck(size, resources) {
    return this.createBottleneck(
      'Moderate CSS Payload',
      `The total CSS size is ${this.formatSize(size)}, which is larger than the recommended size of 75 KB.`,
      'medium',
      resources,
      [
        {
          text: 'Remove unused CSS using tools like PurgeCSS.',
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
   * Create a bottleneck for large individual resources
   * @param {Array} resources - Large resources
   * @returns {Object} - Bottleneck object
   */
  createLargeResourcesBottleneck(resources) {
    return this.createBottleneck(
      'Large Individual Resources',
      `${resources.length} resources are larger than recommended size thresholds.`,
      'medium',
      resources,
      [
        {
          text: 'Compress large text resources using Gzip or Brotli.',
          link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
        },
        {
          text: 'Optimize images by using modern formats, proper compression, and appropriate dimensions.',
          link: 'https://web.dev/articles/use-imagemin-to-compress-images'
        },
        {
          text: 'Consider lazy loading large resources that are not immediately needed.',
          link: 'https://web.dev/articles/lazy-loading'
        }
      ]
    );
  }
}
