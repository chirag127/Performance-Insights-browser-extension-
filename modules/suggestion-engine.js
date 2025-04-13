/**
 * Suggestion Engine Module
 * 
 * Responsible for generating actionable optimization suggestions based on identified bottlenecks.
 */

export class SuggestionEngine {
  constructor() {
    // Suggestion database organized by bottleneck category
    this.suggestionDatabase = {
      'Network Latency': this.getNetworkLatencySuggestions(),
      'Resource Size': this.getResourceSizeSuggestions(),
      'Blocking Resources': this.getBlockingResourcesSuggestions(),
      'Unoptimized Images': this.getUnoptimizedImagesSuggestions(),
      'Inefficient JavaScript': this.getJavaScriptSuggestions(),
      'Unoptimized CSS': this.getCssSuggestions(),
      'Font Loading Issues': this.getFontLoadingSuggestions(),
      'Third-Party Scripts': this.getThirdPartyScriptsSuggestions()
    };
    
    // Default suggestion level
    this.suggestionLevel = 'intermediate';
  }
  
  /**
   * Set the suggestion level
   * @param {string} level - Suggestion level (basic, intermediate, advanced)
   */
  setSuggestionLevel(level) {
    if (['basic', 'intermediate', 'advanced'].includes(level)) {
      this.suggestionLevel = level;
    }
  }
  
  /**
   * Generate suggestions for bottlenecks
   * @param {Array} bottlenecks - Array of bottlenecks
   * @returns {Array} - Array of bottlenecks with enhanced suggestions
   */
  generateSuggestions(bottlenecks) {
    if (!bottlenecks || bottlenecks.length === 0) {
      return [];
    }
    
    // Create a copy of the bottlenecks to avoid modifying the original
    const enhancedBottlenecks = bottlenecks.map(bottleneck => {
      // Create a copy of the bottleneck
      const enhancedBottleneck = { ...bottleneck };
      
      // If the bottleneck already has suggestions, use them
      if (enhancedBottleneck.suggestions && enhancedBottleneck.suggestions.length > 0) {
        // Filter suggestions based on the suggestion level
        enhancedBottleneck.suggestions = this.filterSuggestionsByLevel(
          enhancedBottleneck.suggestions,
          this.suggestionLevel
        );
        
        return enhancedBottleneck;
      }
      
      // Get suggestions from the database based on the bottleneck category
      const categorySuggestions = this.suggestionDatabase[enhancedBottleneck.category] || [];
      
      // Filter suggestions based on the suggestion level
      enhancedBottleneck.suggestions = this.filterSuggestionsByLevel(
        categorySuggestions,
        this.suggestionLevel
      );
      
      return enhancedBottleneck;
    });
    
    return enhancedBottlenecks;
  }
  
  /**
   * Filter suggestions based on the suggestion level
   * @param {Array} suggestions - Array of suggestions
   * @param {string} level - Suggestion level (basic, intermediate, advanced)
   * @returns {Array} - Filtered suggestions
   */
  filterSuggestionsByLevel(suggestions, level) {
    if (!suggestions || suggestions.length === 0) {
      return [];
    }
    
    // If no level is specified, return all suggestions
    if (!level) {
      return suggestions;
    }
    
    // Filter suggestions based on the level
    switch (level) {
      case 'basic':
        // Return only basic suggestions (first 2)
        return suggestions.slice(0, 2);
      case 'intermediate':
        // Return intermediate suggestions (first 3-4)
        return suggestions.slice(0, 4);
      case 'advanced':
        // Return all suggestions
        return suggestions;
      default:
        return suggestions;
    }
  }
  
  /**
   * Get suggestions for network latency bottlenecks
   * @returns {Array} - Array of suggestions
   */
  getNetworkLatencySuggestions() {
    return [
      {
        text: 'Use a Content Delivery Network (CDN) to serve static assets from locations closer to your users.',
        link: 'https://web.dev/articles/content-delivery-networks'
      },
      {
        text: 'Optimize server response time by improving server-side code, database queries, and server configuration.',
        link: 'https://web.dev/articles/optimize-ttfb'
      },
      {
        text: 'Implement HTTP/2 or HTTP/3 to improve connection efficiency.',
        link: 'https://web.dev/articles/performance-http2'
      },
      {
        text: 'Use DNS prefetching for domains you will connect to.',
        link: 'https://web.dev/articles/preconnect-and-dns-prefetch'
      },
      {
        text: 'Implement server-side caching to improve response times for repeat visitors.',
        link: 'https://web.dev/articles/http-cache'
      },
      {
        text: 'Consider using a service worker to cache resources and provide offline functionality.',
        link: 'https://web.dev/articles/service-workers-cache-storage'
      }
    ];
  }
  
  /**
   * Get suggestions for resource size bottlenecks
   * @returns {Array} - Array of suggestions
   */
  getResourceSizeSuggestions() {
    return [
      {
        text: 'Compress text resources (HTML, CSS, JavaScript) using Gzip or Brotli.',
        link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
      },
      {
        text: 'Minify HTML, CSS, and JavaScript to remove unnecessary characters.',
        link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
      },
      {
        text: 'Implement code splitting for JavaScript to load only what is needed.',
        link: 'https://web.dev/articles/reduce-javascript-payloads-with-code-splitting'
      },
      {
        text: 'Remove unused CSS and JavaScript code using tools like PurgeCSS and tree shaking.',
        link: 'https://web.dev/articles/unused-javascript'
      },
      {
        text: 'Optimize images by using modern formats, proper compression, and appropriate dimensions.',
        link: 'https://web.dev/articles/use-imagemin-to-compress-images'
      },
      {
        text: 'Use responsive images with srcset to serve different sizes based on the device.',
        link: 'https://web.dev/articles/serve-responsive-images'
      }
    ];
  }
  
  /**
   * Get suggestions for blocking resources bottlenecks
   * @returns {Array} - Array of suggestions
   */
  getBlockingResourcesSuggestions() {
    return [
      {
        text: 'Inline critical CSS directly in the HTML to reduce render-blocking.',
        link: 'https://web.dev/articles/extract-critical-css'
      },
      {
        text: 'Add async or defer attributes to non-critical script tags.',
        link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
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
      },
      {
        text: 'Move script tags to the end of the body.',
        link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
      }
    ];
  }
  
  /**
   * Get suggestions for unoptimized images bottlenecks
   * @returns {Array} - Array of suggestions
   */
  getUnoptimizedImagesSuggestions() {
    return [
      {
        text: 'Compress images using tools like ImageOptim, TinyPNG, or Squoosh.',
        link: 'https://web.dev/articles/use-imagemin-to-compress-images'
      },
      {
        text: 'Convert images to WebP format for better compression and quality.',
        link: 'https://web.dev/articles/serve-images-webp'
      },
      {
        text: 'Resize images to appropriate dimensions for their display size.',
        link: 'https://web.dev/articles/serve-responsive-images'
      },
      {
        text: 'Use responsive images with srcset to serve different sizes based on the device.',
        link: 'https://web.dev/articles/serve-responsive-images'
      },
      {
        text: 'Implement lazy loading for images below the fold.',
        link: 'https://web.dev/articles/lazy-loading-images'
      },
      {
        text: 'Consider using AVIF format for even better compression.',
        link: 'https://web.dev/articles/compress-images-avif'
      }
    ];
  }
  
  /**
   * Get suggestions for JavaScript bottlenecks
   * @returns {Array} - Array of suggestions
   */
  getJavaScriptSuggestions() {
    return [
      {
        text: 'Break up long tasks into smaller, asynchronous tasks.',
        link: 'https://web.dev/articles/optimize-long-tasks'
      },
      {
        text: 'Implement code splitting to load JavaScript only when needed.',
        link: 'https://web.dev/articles/reduce-javascript-payloads-with-code-splitting'
      },
      {
        text: 'Remove unused JavaScript code using tree shaking.',
        link: 'https://web.dev/articles/remove-unused-code'
      },
      {
        text: 'Defer or lazy load non-critical JavaScript.',
        link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
      },
      {
        text: 'Use web workers for CPU-intensive tasks to avoid blocking the main thread.',
        link: 'https://web.dev/articles/off-main-thread'
      },
      {
        text: 'Optimize JavaScript execution by avoiding layout thrashing and other performance issues.',
        link: 'https://web.dev/articles/optimize-long-tasks'
      }
    ];
  }
  
  /**
   * Get suggestions for CSS bottlenecks
   * @returns {Array} - Array of suggestions
   */
  getCssSuggestions() {
    return [
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
        text: 'Optimize CSS selectors for better performance.',
        link: 'https://web.dev/articles/extract-critical-css'
      },
      {
        text: 'Consolidate CSS files to reduce HTTP requests.',
        link: 'https://web.dev/articles/reduce-network-payloads-using-text-compression'
      },
      {
        text: 'Consider using CSS frameworks more selectively or with tree-shaking.',
        link: 'https://web.dev/articles/extract-critical-css'
      }
    ];
  }
  
  /**
   * Get suggestions for font loading bottlenecks
   * @returns {Array} - Array of suggestions
   */
  getFontLoadingSuggestions() {
    return [
      {
        text: 'Use the font-display CSS property to control how fonts are displayed while loading.',
        link: 'https://web.dev/articles/font-display'
      },
      {
        text: 'Preload important font files to improve loading performance.',
        link: 'https://web.dev/articles/preload-critical-assets'
      },
      {
        text: 'Use font subsetting to include only the characters you need.',
        link: 'https://web.dev/articles/reduce-webfont-size'
      },
      {
        text: 'Consider using variable fonts to reduce the number of font files.',
        link: 'https://web.dev/articles/variable-fonts'
      },
      {
        text: 'Self-host fonts instead of using third-party font services for better control.',
        link: 'https://web.dev/articles/font-best-practices'
      },
      {
        text: 'Use modern font formats like WOFF2 for better compression.',
        link: 'https://web.dev/articles/reduce-webfont-size'
      }
    ];
  }
  
  /**
   * Get suggestions for third-party scripts bottlenecks
   * @returns {Array} - Array of suggestions
   */
  getThirdPartyScriptsSuggestions() {
    return [
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
        text: 'Consider using a tag management system to better control third-party scripts.',
        link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
      },
      {
        text: 'Consider self-hosting critical third-party scripts for better control.',
        link: 'https://web.dev/articles/efficiently-load-third-party-javascript'
      },
      {
        text: 'Implement a performance budget to limit the impact of third-party scripts.',
        link: 'https://web.dev/articles/performance-budgets-101'
      }
    ];
  }
}
