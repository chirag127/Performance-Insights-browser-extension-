/**
 * Helper functions for Performance Insights extension
 */

/**
 * Format time in ms to a readable format
 * @param {number} timeInMs - Time in milliseconds
 * @returns {string} - Formatted time
 */
export function formatTime(timeInMs) {
  if (timeInMs === undefined || timeInMs === null) {
    return '-';
  }
  
  if (timeInMs < 1000) {
    return `${timeInMs.toFixed(0)}ms`;
  } else {
    return `${(timeInMs / 1000).toFixed(2)}s`;
  }
}

/**
 * Format size in bytes to a readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size
 */
export function formatSize(bytes) {
  if (bytes === undefined || bytes === null) {
    return '-';
  }
  
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

/**
 * Get resource type from MIME type or URL
 * @param {string} mimeType - MIME type
 * @param {string} url - URL
 * @param {Object} resourceTypeMap - Resource type mapping
 * @returns {string} - Resource type
 */
export function getResourceType(mimeType, url, resourceTypeMap) {
  // Try to determine type from MIME type
  if (mimeType) {
    for (const [type, mimeTypes] of Object.entries(resourceTypeMap)) {
      if (type === 'other') continue;
      
      if (mimeTypes.some(mime => mimeType.startsWith(mime))) {
        return type;
      }
    }
  }
  
  // Try to determine type from URL
  if (url) {
    const extension = url.split('?')[0].split('#')[0].split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'css':
        return 'stylesheet';
      case 'js':
        return 'script';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg':
        return 'image';
      case 'woff':
      case 'woff2':
      case 'ttf':
      case 'otf':
        return 'font';
      case 'json':
      case 'xml':
        return 'xhr';
      case 'mp3':
      case 'mp4':
      case 'webm':
      case 'ogg':
        return 'media';
      case 'html':
      case 'htm':
        return 'document';
      default:
        return 'other';
    }
  }
  
  return 'other';
}

/**
 * Get domain from URL
 * @param {string} url - URL
 * @returns {string} - Domain
 */
export function getDomain(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return '';
  }
}

/**
 * Check if a resource is from a third-party domain
 * @param {string} resourceUrl - Resource URL
 * @param {string} mainDomain - Main domain
 * @returns {boolean} - Whether the resource is from a third-party domain
 */
export function isThirdPartyResource(resourceUrl, mainDomain) {
  if (!resourceUrl || !mainDomain) {
    return false;
  }
  
  try {
    const resourceDomain = getDomain(resourceUrl);
    
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
 * Get resource name from URL
 * @param {string} url - URL
 * @returns {string} - Resource name
 */
export function getResourceName(url) {
  if (!url) {
    return 'Unknown';
  }
  
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    
    if (fileName) {
      return fileName;
    }
    
    return parsedUrl.hostname;
  } catch (error) {
    return url.split('/').pop() || url;
  }
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Generate a unique ID
 * @returns {string} - Unique ID
 */
export function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
