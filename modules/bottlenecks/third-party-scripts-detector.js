/**
 * Third-Party Scripts Detector
 * 
 * Detects bottlenecks related to third-party scripts.
 */

import { BaseDetector } from './base-detector.js';

export class ThirdPartyScriptsDetector extends BaseDetector {
  constructor() {
    super();
    this.category = 'Third-Party Scripts';
    
    // Thresholds for third-party scripts
    this.thresholds = {
      count: {
        high: 10,
        medium: 5
      },
      size: {
        high: 500 * 1024, // 500 KB
        medium: 250 * 1024 // 250 KB
      },
      time: {
        high: 500, // ms
        medium: 200 // ms
      }
    };
    
    // Common third-party script categories
    this.thirdPartyCategories = {
      analytics: ['google-analytics', 'analytics', 'gtm', 'segment', 'mixpanel', 'hotjar'],
      advertising: ['adsense', 'adwords', 'doubleclick', 'advertising', 'ads'],
      social: ['facebook', 'twitter', 'linkedin', 'instagram', 'pinterest', 'social'],
      chat: ['intercom', 'drift', 'zendesk', 'livechat', 'chat'],
      marketing: ['hubspot', 'marketo', 'mailchimp', 'marketing'],
      other: []
    };
  }
  
  /**
   * Detect third-party script bottlenecks
   * @param {Object} metrics - Performance metrics
   * @param {Array} resources - Array of resources
   * @returns {Array} - Array of detected bottlenecks
   */
  detect(metrics, resources) {
    if (!metrics || !resources || resources.length === 0) {
      return [];
    }
    
    const bottlenecks = [];
    
    // Get the main domain
    const mainDomain = this.getMainDomain(resources);
    if (!mainDomain) {
      return bottlenecks;
    }
    
    // Get all third-party script resources
    const jsResources = this.filterResourcesByType(resources, 'script');
    const thirdPartyScripts = jsResources.filter(resource => 
      this.isThirdPartyResource(resource, mainDomain)
    );
    
    if (thirdPartyScripts.length === 0) {
      return bottlenecks;
    }
    
    // Check for too many third-party scripts
    if (thirdPartyScripts.length > this.thresholds.count.high) {
      bottlenecks.push(this.createTooManyThirdPartyScriptsBottleneck(thirdPartyScripts, 'high'));
    } else if (thirdPartyScripts.length > this.thresholds.count.medium) {
      bottlenecks.push(this.createTooManyThirdPartyScriptsBottleneck(thirdPartyScripts, 'medium'));
    }
    
    // Calculate total size of third-party scripts
    const totalSize = thirdPartyScripts.reduce((total, resource) => {
      return total + (resource.size || 0);
    }, 0);
    
    // Check for large total size of third-party scripts
    if (totalSize > this.thresholds.size.high) {
      bottlenecks.push(this.createLargeThirdPartyScriptsBottleneck(totalSize, thirdPartyScripts));
    } else if (totalSize > this.thresholds.size.medium) {
      bottlenecks.push(this.createMediumThirdPartyScriptsBottleneck(totalSize, thirdPartyScripts));
    }
    
    // Check for slow-loading third-party scripts
    const slowThirdPartyScripts = thirdPartyScripts.filter(resource => {
      const loadTime = resource.timingBreakdown?.total || 0;
      return loadTime > this.thresholds.time.high;
    });
    
    if (slowThirdPartyScripts.length > 0) {
      bottlenecks.push(this.createSlowThirdPartyScriptsBottleneck(slowThirdPartyScripts));
    }
    
    // Categorize third-party scripts
    const categorizedScripts = this.categorizeThirdPartyScripts(thirdPartyScripts);
    
    // Check for too many scripts in specific categories
    for (const [category, scripts] of Object.entries(categorizedScripts)) {
      if (scripts.length > 3 && category !== 'other') {
        bottlenecks.push(this.createTooManyCategoryScriptsBottleneck(category, scripts));
      }
    }
    
    return bottlenecks;
  }
  
  /**
   * Categorize third-party scripts
   * @param {Array} scripts - Third-party script resources
   * @returns {Object} - Scripts categorized by type
   */
  categorizeThirdPartyScripts(scripts) {
    const categorized = {
      analytics: [],
      advertising: [],
      social: [],
      chat: [],
      marketing: [],
      other: []
    };
    
    scripts.forEach(script => {
      if (!script.url) {
        categorized.other.push(script);
        return;
      }
      
      const url = script.url.toLowerCase();
      let matched = false;
      
      for (const [category, keywords] of Object.entries(this.thirdPartyCategories)) {
        if (category === 'other') continue;
        
        if (keywords.some(keyword => url.includes(keyword))) {
          categorized[category].push(script);
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        categorized.other.push(script);
      }
    });
    
    return categorized;
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
   * Create a bottleneck for too many third-party scripts
   * @param {Array} resources - Third-party script resources
   * @param {string} severity - Bottleneck severity
   * @returns {Object} - Bottleneck object
   */
  createTooManyThirdPartyScriptsBottleneck(resources, severity) {
    return this.createBottleneck(
      'Too Many Third-Party Scripts',
      `The page loads ${resources.length} third-party scripts, which can significantly impact performance, privacy, and security.`,
      severity,
      resources,
      [
        {
          text: 'Evaluate the necessity of each third-party script and remove unnecessary ones.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        },
        {
          text: 'Consolidate third-party scripts from the same provider.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        },
        {
          text: 'Load third-party scripts asynchronously or defer their loading.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        },
        {
          text: 'Consider using tag management systems to better control third-party scripts.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for large third-party scripts
   * @param {number} size - Total size in bytes
   * @param {Array} resources - Third-party script resources
   * @returns {Object} - Bottleneck object
   */
  createLargeThirdPartyScriptsBottleneck(size, resources) {
    return this.createBottleneck(
      'Large Third-Party Scripts',
      `The total size of third-party scripts is ${this.formatSize(size)}, which significantly impacts page load performance.`,
      'high',
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
  
  /**
   * Create a bottleneck for medium-sized third-party scripts
   * @param {number} size - Total size in bytes
   * @param {Array} resources - Third-party script resources
   * @returns {Object} - Bottleneck object
   */
  createMediumThirdPartyScriptsBottleneck(size, resources) {
    return this.createBottleneck(
      'Moderate Third-Party Scripts Size',
      `The total size of third-party scripts is ${this.formatSize(size)}, which impacts page load performance.`,
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
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for slow-loading third-party scripts
   * @param {Array} resources - Slow-loading third-party script resources
   * @returns {Object} - Bottleneck object
   */
  createSlowThirdPartyScriptsBottleneck(resources) {
    return this.createBottleneck(
      'Slow-Loading Third-Party Scripts',
      `${resources.length} third-party scripts take more than ${this.thresholds.time.high}ms to load, which significantly impacts page performance.`,
      'high',
      resources,
      [
        {
          text: 'Evaluate the necessity of these slow-loading scripts and consider alternatives.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        },
        {
          text: 'Load these scripts asynchronously or defer their loading.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        },
        {
          text: 'Use resource hints like preconnect for these third-party domains.',
          link: 'https://web.dev/articles/preconnect-and-dns-prefetch'
        },
        {
          text: 'Consider lazy loading these scripts only when needed.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for too many scripts in a specific category
   * @param {string} category - Script category
   * @param {Array} resources - Script resources in the category
   * @returns {Object} - Bottleneck object
   */
  createTooManyCategoryScriptsBottleneck(category, resources) {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    
    return this.createBottleneck(
      `Multiple ${categoryName} Scripts`,
      `The page loads ${resources.length} different ${category} scripts, which may be redundant and impact performance.`,
      'medium',
      resources,
      [
        {
          text: `Evaluate the necessity of multiple ${category} scripts and consolidate where possible.`,
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        },
        {
          text: 'Consider using a tag management system to better control these scripts.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        },
        {
          text: `Load non-critical ${category} scripts asynchronously or defer their loading.`,
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        }
      ]
    );
  }
}
