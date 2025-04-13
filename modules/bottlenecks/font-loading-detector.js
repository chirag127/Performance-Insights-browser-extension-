/**
 * Font Loading Detector
 * 
 * Detects bottlenecks related to font loading issues.
 */

import { BaseDetector } from './base-detector.js';

export class FontLoadingDetector extends BaseDetector {
  constructor() {
    super();
    this.category = 'Font Loading Issues';
    
    // Size thresholds for fonts in bytes
    this.sizeThresholds = {
      high: 100 * 1024, // 100 KB
      medium: 50 * 1024 // 50 KB
    };
  }
  
  /**
   * Detect font loading bottlenecks
   * @param {Object} metrics - Performance metrics
   * @param {Array} resources - Array of resources
   * @returns {Array} - Array of detected bottlenecks
   */
  detect(metrics, resources) {
    if (!metrics || !resources || resources.length === 0) {
      return [];
    }
    
    const bottlenecks = [];
    
    // Get all font resources
    const fontResources = this.filterResourcesByType(resources, 'font');
    if (fontResources.length === 0) {
      return bottlenecks;
    }
    
    // Calculate total font size
    const totalFontSize = fontResources.reduce((total, resource) => {
      return total + (resource.size || 0);
    }, 0);
    
    // Check for large total font size
    if (totalFontSize > this.sizeThresholds.high) {
      bottlenecks.push(this.createLargeFontSizeBottleneck(totalFontSize, fontResources));
    } else if (totalFontSize > this.sizeThresholds.medium) {
      bottlenecks.push(this.createMediumFontSizeBottleneck(totalFontSize, fontResources));
    }
    
    // Check for too many font files
    if (fontResources.length > 4) {
      bottlenecks.push(this.createTooManyFontsBottleneck(fontResources));
    }
    
    // Check for third-party font services
    const mainDomain = this.getMainDomain(resources);
    const thirdPartyFonts = fontResources.filter(resource => 
      this.isThirdPartyResource(resource, mainDomain)
    );
    
    if (thirdPartyFonts.length > 0) {
      bottlenecks.push(this.createThirdPartyFontsBottleneck(thirdPartyFonts));
    }
    
    // Check for late-loading fonts
    // In a real implementation, we would check if fonts are loaded after FCP
    // which could cause layout shifts
    const lateLoadingFonts = fontResources.filter(resource => {
      // Check if the font is loaded after FCP
      if (metrics.firstContentfulPaint && resource.startTime) {
        const startTime = new Date(resource.startTime).getTime();
        return startTime > metrics.firstContentfulPaint;
      }
      return false;
    });
    
    if (lateLoadingFonts.length > 0) {
      bottlenecks.push(this.createLateLoadingFontsBottleneck(lateLoadingFonts));
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
   * Create a bottleneck for large total font size
   * @param {number} size - Total font size in bytes
   * @param {Array} resources - Font resources
   * @returns {Object} - Bottleneck object
   */
  createLargeFontSizeBottleneck(size, resources) {
    return this.createBottleneck(
      'Large Font Files',
      `The total size of font files is ${this.formatSize(size)}, which is significantly larger than the recommended size of 50 KB.`,
      'high',
      resources,
      [
        {
          text: 'Use font subsetting to include only the characters you need.',
          link: 'https://web.dev/articles/reduce-webfont-size'
        },
        {
          text: 'Consider using variable fonts to reduce the number of font files.',
          link: 'https://web.dev/articles/variable-fonts'
        },
        {
          text: 'Optimize font files using tools like fonttools or glyphhanger.',
          link: 'https://web.dev/articles/reduce-webfont-size'
        },
        {
          text: 'Use modern font formats like WOFF2 for better compression.',
          link: 'https://web.dev/articles/reduce-webfont-size'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for medium total font size
   * @param {number} size - Total font size in bytes
   * @param {Array} resources - Font resources
   * @returns {Object} - Bottleneck object
   */
  createMediumFontSizeBottleneck(size, resources) {
    return this.createBottleneck(
      'Moderate Font Size',
      `The total size of font files is ${this.formatSize(size)}, which is larger than the recommended size of 50 KB.`,
      'medium',
      resources,
      [
        {
          text: 'Use font subsetting to include only the characters you need.',
          link: 'https://web.dev/articles/reduce-webfont-size'
        },
        {
          text: 'Consider using variable fonts to reduce the number of font files.',
          link: 'https://web.dev/articles/variable-fonts'
        },
        {
          text: 'Use modern font formats like WOFF2 for better compression.',
          link: 'https://web.dev/articles/reduce-webfont-size'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for too many font files
   * @param {Array} resources - Font resources
   * @returns {Object} - Bottleneck object
   */
  createTooManyFontsBottleneck(resources) {
    return this.createBottleneck(
      'Too Many Font Files',
      `The page loads ${resources.length} font files, which increases HTTP requests and can impact performance.`,
      'medium',
      resources,
      [
        {
          text: 'Reduce the number of font families and weights used on the page.',
          link: 'https://web.dev/articles/font-best-practices'
        },
        {
          text: 'Consider using variable fonts to reduce the number of font files.',
          link: 'https://web.dev/articles/variable-fonts'
        },
        {
          text: 'Use system fonts for less important text to reduce the number of custom fonts.',
          link: 'https://web.dev/articles/font-best-practices'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for third-party font services
   * @param {Array} resources - Third-party font resources
   * @returns {Object} - Bottleneck object
   */
  createThirdPartyFontsBottleneck(resources) {
    return this.createBottleneck(
      'Third-Party Font Services',
      `The page loads ${resources.length} fonts from third-party services, which can introduce additional latency.`,
      'medium',
      resources,
      [
        {
          text: 'Consider self-hosting fonts instead of using third-party font services.',
          link: 'https://web.dev/articles/font-best-practices'
        },
        {
          text: 'Use resource hints like preconnect for third-party font domains.',
          link: 'https://web.dev/articles/preconnect-and-dns-prefetch'
        },
        {
          text: 'Implement font-display: swap to prevent font blocking.',
          link: 'https://web.dev/articles/font-display'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for late-loading fonts
   * @param {Array} resources - Late-loading font resources
   * @returns {Object} - Bottleneck object
   */
  createLateLoadingFontsBottleneck(resources) {
    return this.createBottleneck(
      'Late-Loading Fonts',
      `${resources.length} fonts are loaded after the First Contentful Paint, which can cause layout shifts.`,
      'medium',
      resources,
      [
        {
          text: 'Preload critical fonts to ensure they load early.',
          link: 'https://web.dev/articles/preload-critical-assets'
        },
        {
          text: 'Implement font-display: swap to prevent font blocking.',
          link: 'https://web.dev/articles/font-display'
        },
        {
          text: 'Use the Font Loading API to control font loading behavior.',
          link: 'https://web.dev/articles/optimize-webfont-loading'
        },
        {
          text: 'Consider using system fonts or font fallbacks that closely match your custom fonts.',
          link: 'https://web.dev/articles/font-best-practices'
        }
      ]
    );
  }
}
