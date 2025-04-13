/**
 * Unoptimized Images Detector
 * 
 * Detects bottlenecks related to unoptimized images.
 */

import { BaseDetector } from './base-detector.js';

export class UnoptimizedImagesDetector extends BaseDetector {
  constructor() {
    super();
    this.category = 'Unoptimized Images';
    
    // Size thresholds for images in bytes
    this.sizeThresholds = {
      high: 200 * 1024, // 200 KB
      medium: 100 * 1024 // 100 KB
    };
    
    // Modern image formats
    this.modernFormats = ['webp', 'avif'];
  }
  
  /**
   * Detect unoptimized images bottlenecks
   * @param {Object} metrics - Performance metrics
   * @param {Array} resources - Array of resources
   * @returns {Array} - Array of detected bottlenecks
   */
  detect(metrics, resources) {
    if (!metrics || !resources || resources.length === 0) {
      return [];
    }
    
    const bottlenecks = [];
    
    // Get all image resources
    const imageResources = this.filterResourcesByType(resources, 'image');
    if (imageResources.length === 0) {
      return bottlenecks;
    }
    
    // Check for large images
    const largeImages = imageResources.filter(resource => 
      (resource.size || 0) > this.sizeThresholds.high
    );
    
    if (largeImages.length > 0) {
      bottlenecks.push(this.createLargeImagesBottleneck(largeImages));
    }
    
    // Check for non-modern image formats
    const nonModernImages = imageResources.filter(resource => {
      if (!resource.url) return false;
      
      const extension = resource.url.split('?')[0].split('#')[0].split('.').pop().toLowerCase();
      return !this.modernFormats.includes(extension);
    });
    
    if (nonModernImages.length > 0) {
      bottlenecks.push(this.createNonModernFormatsBottleneck(nonModernImages));
    }
    
    // Check for potentially unoptimized images
    // In a real implementation, we would analyze the image content
    // to determine if it could be further optimized
    const potentiallyUnoptimizedImages = imageResources.filter(resource => {
      // For now, we'll use size as a heuristic
      return (resource.size || 0) > this.sizeThresholds.medium;
    });
    
    if (potentiallyUnoptimizedImages.length > 0 && potentiallyUnoptimizedImages.length !== largeImages.length) {
      bottlenecks.push(this.createPotentiallyUnoptimizedImagesBottleneck(potentiallyUnoptimizedImages));
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
   * Create a bottleneck for large images
   * @param {Array} resources - Large image resources
   * @returns {Object} - Bottleneck object
   */
  createLargeImagesBottleneck(resources) {
    const totalSize = resources.reduce((total, resource) => total + (resource.size || 0), 0);
    
    return this.createBottleneck(
      'Large Images',
      `${resources.length} images are larger than ${this.formatSize(this.sizeThresholds.high)}, with a total size of ${this.formatSize(totalSize)}.`,
      resources.length > 2 ? 'high' : 'medium',
      resources,
      [
        {
          text: 'Compress images using tools like ImageOptim, TinyPNG, or Squoosh.',
          link: 'https://web.dev/articles/use-imagemin-to-compress-images'
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
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for non-modern image formats
   * @param {Array} resources - Non-modern image resources
   * @returns {Object} - Bottleneck object
   */
  createNonModernFormatsBottleneck(resources) {
    return this.createBottleneck(
      'Non-Modern Image Formats',
      `${resources.length} images are using older formats instead of modern formats like WebP or AVIF, which offer better compression.`,
      'medium',
      resources,
      [
        {
          text: 'Convert images to WebP format for better compression and quality.',
          link: 'https://web.dev/articles/serve-images-webp'
        },
        {
          text: 'Consider using AVIF format for even better compression.',
          link: 'https://web.dev/articles/compress-images-avif'
        },
        {
          text: 'Use the picture element with multiple sources to provide fallbacks for older browsers.',
          link: 'https://web.dev/articles/serve-responsive-images'
        }
      ]
    );
  }
  
  /**
   * Create a bottleneck for potentially unoptimized images
   * @param {Array} resources - Potentially unoptimized image resources
   * @returns {Object} - Bottleneck object
   */
  createPotentiallyUnoptimizedImagesBottleneck(resources) {
    return this.createBottleneck(
      'Potentially Unoptimized Images',
      `${resources.length} images may not be fully optimized and could be further compressed without significant quality loss.`,
      'low',
      resources,
      [
        {
          text: 'Use tools like ImageOptim, TinyPNG, or Squoosh to optimize images.',
          link: 'https://web.dev/articles/use-imagemin-to-compress-images'
        },
        {
          text: 'Adjust compression quality settings to find the right balance between size and quality.',
          link: 'https://web.dev/articles/compress-images'
        },
        {
          text: 'Remove unnecessary metadata from images.',
          link: 'https://web.dev/articles/optimize-cls'
        }
      ]
    );
  }
}
