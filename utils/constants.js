/**
 * Constants and configuration for Performance Insights extension
 */

// Extension version
export const VERSION = '1.0.0';

// Performance metric thresholds
export const METRIC_THRESHOLDS = {
  pageLoadTime: { good: 2000, medium: 4000 }, // ms
  domContentLoaded: { good: 1500, medium: 3000 }, // ms
  firstContentfulPaint: { good: 1800, medium: 3000 }, // ms
  largestContentfulPaint: { good: 2500, medium: 4000 }, // ms
  timeToInteractive: { good: 3500, medium: 7500 }, // ms
  totalBlockingTime: { good: 200, medium: 600 } // ms
};

// Resource size thresholds
export const RESOURCE_SIZE_THRESHOLDS = {
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

// Network throttling presets
export const NETWORK_THROTTLING_PRESETS = {
  'none': {
    offline: false,
    latency: 0,
    downloadThroughput: 0,
    uploadThroughput: 0
  },
  'slow-3g': {
    offline: false,
    latency: 400,
    downloadThroughput: 500 * 1024 / 8, // 500 Kbps
    uploadThroughput: 500 * 1024 / 8 // 500 Kbps
  },
  'fast-3g': {
    offline: false,
    latency: 150,
    downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
    uploadThroughput: 750 * 1024 / 8 // 750 Kbps
  },
  'regular-4g': {
    offline: false,
    latency: 100,
    downloadThroughput: 4 * 1024 * 1024 / 8, // 4 Mbps
    uploadThroughput: 2 * 1024 * 1024 / 8 // 2 Mbps
  }
};

// Default settings
export const DEFAULT_SETTINGS = {
  autoAnalysis: true,
  networkThrottling: 'none',
  showMetrics: {
    pageLoad: true,
    domContentLoaded: true,
    fcp: true,
    lcp: true,
    tti: true,
    tbt: true
  },
  suggestionLevel: 'intermediate'
};

// Resource type mapping
export const RESOURCE_TYPE_MAP = {
  'document': ['text/html', 'application/xhtml+xml'],
  'stylesheet': ['text/css'],
  'script': ['application/javascript', 'text/javascript', 'application/x-javascript'],
  'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  'font': ['font/woff', 'font/woff2', 'font/ttf', 'font/otf'],
  'xhr': ['application/json', 'application/xml', 'text/xml'],
  'media': ['audio/', 'video/'],
  'other': []
};

// Resource color mapping
export const RESOURCE_COLOR_MAP = {
  document: '#4285F4', // Blue
  stylesheet: '#34A853', // Green
  script: '#FBBC05', // Yellow
  image: '#EA4335', // Red
  font: '#9C27B0', // Purple
  xhr: '#FF9800', // Orange
  media: '#00BCD4', // Cyan
  other: '#9E9E9E' // Gray
};

// Message types
export const MESSAGE_TYPES = {
  PERFORMANCE_METRICS: 'performanceMetrics',
  PERFORMANCE_DATA: 'performanceData',
  REFRESH_ANALYSIS: 'refreshAnalysis',
  OPEN_DEVTOOLS_PANEL: 'openDevToolsPanel',
  SETTINGS_UPDATED: 'settingsUpdated',
  SET_NETWORK_THROTTLING: 'setNetworkThrottling',
  DEVTOOLS_PANEL_SHOWN: 'devtoolsPanelShown',
  DEVTOOLS_PANEL_HIDDEN: 'devtoolsPanelHidden',
  GET_PERFORMANCE_DATA: 'getPerformanceData',
  REFRESH_METRICS: 'refreshMetrics',
  INIT: 'init',
  NETWORK_REQUEST: 'networkRequest',
  PANEL_INITIALIZED: 'panelInitialized'
};
