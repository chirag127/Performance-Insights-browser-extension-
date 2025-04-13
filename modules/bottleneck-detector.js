/**
 * Bottleneck Detector Module
 * 
 * Responsible for analyzing performance metrics and resource data to identify
 * potential bottlenecks based on predefined rules and heuristics.
 */

// Import bottleneck detectors
import { NetworkLatencyDetector } from './bottlenecks/network-latency-detector.js';
import { ResourceSizeDetector } from './bottlenecks/resource-size-detector.js';
import { BlockingResourcesDetector } from './bottlenecks/blocking-resources-detector.js';
import { UnoptimizedImagesDetector } from './bottlenecks/unoptimized-images-detector.js';
import { JavaScriptDetector } from './bottlenecks/javascript-detector.js';
import { CSSDetector } from './bottlenecks/css-detector.js';
import { FontLoadingDetector } from './bottlenecks/font-loading-detector.js';
import { ThirdPartyScriptsDetector } from './bottlenecks/third-party-scripts-detector.js';

export class BottleneckDetector {
  constructor() {
    // Initialize individual bottleneck detectors
    this.detectors = [
      new NetworkLatencyDetector(),
      new ResourceSizeDetector(),
      new BlockingResourcesDetector(),
      new UnoptimizedImagesDetector(),
      new JavaScriptDetector(),
      new CSSDetector(),
      new FontLoadingDetector(),
      new ThirdPartyScriptsDetector()
    ];
  }
  
  /**
   * Detect bottlenecks based on performance metrics and resources
   * @param {Object} metrics - Performance metrics
   * @param {Array} resources - Array of resources
   * @returns {Array} - Array of detected bottlenecks
   */
  detectBottlenecks(metrics, resources) {
    if (!metrics || !resources) {
      return [];
    }
    
    // Run all detectors and collect bottlenecks
    const bottlenecks = [];
    
    this.detectors.forEach(detector => {
      try {
        const detectedBottlenecks = detector.detect(metrics, resources);
        if (detectedBottlenecks && detectedBottlenecks.length > 0) {
          bottlenecks.push(...detectedBottlenecks);
        }
      } catch (error) {
        console.error(`Error in ${detector.constructor.name}:`, error);
      }
    });
    
    // Sort bottlenecks by severity (high to low)
    const sortedBottlenecks = this.sortBottlenecksBySeverity(bottlenecks);
    
    return sortedBottlenecks;
  }
  
  /**
   * Sort bottlenecks by severity (high to low)
   * @param {Array} bottlenecks - Array of bottlenecks
   * @returns {Array} - Sorted array of bottlenecks
   */
  sortBottlenecksBySeverity(bottlenecks) {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    
    return [...bottlenecks].sort((a, b) => {
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }
}
