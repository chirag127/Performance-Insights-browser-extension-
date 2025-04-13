/**
 * Blocking Resources Detector
 * 
 * Detects bottlenecks related to render-blocking resources.
 */

import { BaseDetector } from './base-detector.js';

export class BlockingResourcesDetector extends BaseDetector {
  constructor() {
    super();
    this.category = 'Blocking Resources';
  }
  
  /**
   * Detect blocking resources bottlenecks
   * @param {Object} metrics - Performance metrics
   * @param {Array} resources - Array of resources
   * @returns {Array} - Array of detected bottlenecks
   */
  detect(metrics, resources) {
    if (!metrics || !resources || resources.length === 0) {
      return [];
    }
    
    const bottlenecks = [];
    
    // Check for render-blocking CSS
    const cssResources = this.filterResourcesByType(resources, 'stylesheet');
    const blockingCssResources = cssResources.filter(resource => 
      resource.isRenderBlocking || 
      this.isLikelyRenderBlocking(resource)
    );
    
    if (blockingCssResources.length > 0) {
      bottlenecks.push(this.createBlockingCSSBottleneck(blockingCssResources));
    }
    
    // Check for render-blocking JavaScript
    const jsResources = this.filterResourcesByType(resources, 'script');
    const blockingJsResources = jsResources.filter(resource => 
      resource.isRenderBlocking || 
      this.isLikelyRenderBlocking(resource)
    );
    
    if (blockingJsResources.length > 0) {
      bottlenecks.push(this.createBlockingJavaScriptBottleneck(blockingJsResources));
    }
    
    // Check for font loading issues
    const fontResources = this.filterResourcesByType(resources, 'font');
    if (fontResources.length > 0) {
      // We can't directly determine if fonts are blocking rendering,
      // but we can check if they're loaded early in the page load
      const earlyLoadedFonts = fontResources.filter(resource => {
        // Check if the font is loaded before FCP
        if (metrics.firstContentfulPaint && resource.startTime) {
          const startTime = new Date(resource.startTime).getTime();
          return startTime < metrics.firstContentfulPaint;
        }
        return false;
      });
      
      if (earlyLoadedFonts.length > 0) {
        bottlenecks.push(this.createBlockingFontsBottleneck(earlyLoadedFonts));
      }
    }
    
    return bottlenecks;
  }
  
  /**
   * Check if a resource is likely render-blocking
   * @param {Object} resource - Resource object
   * @returns {boolean} - Whether the resource is likely render-blocking
   */
  isLikelyRenderBlocking(resource) {
    // For CSS, all stylesheets in the head are render-blocking
    if (resource.type === 'stylesheet') {
      // We don't have direct access to whether it's in the head,
      // so we'll assume it is unless it has media="print" or similar
      // In a real implementation, we would check for media attributes
      return true;
    }
    
    // For JavaScript, scripts without async or defer are render-blocking
    if (resource.type === 'script') {
      // In a real implementation, we would check for async/defer attributes
      // For now, we'll use a heuristic based on timing
      if (resource.timingBreakdown && resource.timingBreakdown.total) {
        // If the script takes a significant amount of time to load,
        // it's more likely to be render-blocking
        return resource.timingBreakdown.total > 100; // ms
      }
      return true;
    }
    
    return false;
  }
  
  /**
   * Create a bottleneck for blocking CSS
   * @param {Array} resources - Blocking CSS resources
   * @returns {Object} - Bottleneck object
   */
  createBlockingCSSBottleneck(resources) {
    return this.createBottleneck(
      'Render-Blocking CSS',
      `${resources.length} CSS resources are blocking rendering, which delays the First Contentful Paint.`,
      resources.length > 2 ? 'high' : 'medium',
      resources,
      [
        {
          text: 'Inline critical CSS directly in the HTML to reduce render-blocking.',
          link: 'https://web.dev/articles/extract-critical-css'
        },
        {
          text: 'Use media queries to make CSS non-render-blocking.',
          link: 'https://web.dev/articles/defer-non-critical-css'
        },
        {
          text: 'Load non-critical CSS asynchronously.',
          link: 'https://web.dev/articles/defer-non-critical-css'
        },
        {
          text: 'Consider using the preload link type to prioritize critical resources.',
          link: 'https://web.dev/articles/preload-critical-assets'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for blocking JavaScript
   * @param {Array} resources - Blocking JavaScript resources
   * @returns {Object} - Bottleneck object
   */
  createBlockingJavaScriptBottleneck(resources) {
    return this.createBottleneck(
      'Render-Blocking JavaScript',
      `${resources.length} JavaScript resources are blocking rendering, which delays the First Contentful Paint.`,
      resources.length > 2 ? 'high' : 'medium',
      resources,
      [
        {
          text: 'Add async or defer attributes to non-critical script tags.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        },
        {
          text: 'Move script tags to the end of the body.',
          link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
        },
        {
          text: 'Consider using the preload link type to prioritize critical resources.',
          link: 'https://web.dev/articles/preload-critical-assets'
        },
        {
          text: 'Use dynamic imports for JavaScript modules that are not immediately needed.',
          link: 'https://web.dev/articles/reduce-javascript-payloads-with-code-splitting'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for blocking fonts
   * @param {Array} resources - Font resources
   * @returns {Object} - Bottleneck object
   */
  createBlockingFontsBottleneck(resources) {
    return this.createBottleneck(
      'Font Loading Issues',
      `${resources.length} font resources may be blocking rendering or causing layout shifts.`,
      'medium',
      resources,
      [
        {
          text: 'Use the font-display CSS property to control how fonts are displayed while loading.',
          link: 'https://web.dev/articles/font-display'
        },
        {
          text: 'Preload important font files to improve loading performance.',
          link: 'https://web.dev/articles/preload-critical-assets'
        },
        {
          text: 'Consider using system fonts or variable fonts to reduce the number of font files.',
          link: 'https://web.dev/articles/variable-fonts'
        },
        {
          text: 'Self-host fonts instead of using third-party font services for better control.',
          link: 'https://web.dev/articles/font-best-practices'
        }
      ]
    );
  }
}
