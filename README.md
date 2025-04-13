# Performance Insights Browser Extension

A browser extension for detecting website performance bottlenecks and providing actionable optimization suggestions. This extension helps web developers and performance engineers quickly identify and understand website performance issues directly within their browser.

## Features

-   **Real-time Performance Analysis**: Automatically analyze website performance as pages load
-   **Resource Waterfall Chart**: Visualize the loading timeline of all webpage resources
-   **Performance Metrics Dashboard**: View key performance metrics at a glance
-   **Bottleneck Identification**: Identify and categorize performance bottlenecks
-   **Optimization Suggestions**: Get actionable suggestions for resolving bottlenecks
-   **Data Export**: Export performance data for further analysis
-   **Customization Options**: Customize the extension to suit your needs

## Key Performance Metrics

The extension tracks and displays the following key performance metrics:

-   **Page Load Time**: Total time from navigation start to load event
-   **DOMContentLoaded**: Time to DOMContentLoaded event
-   **First Contentful Paint (FCP)**: Time when the browser renders the first bit of content
-   **Largest Contentful Paint (LCP)**: Time when the largest content element is rendered
-   **Time to Interactive (TTI)**: Time when the page becomes fully interactive
-   **Total Blocking Time (TBT)**: Total time spent blocking the main thread during page load
-   **Request Count**: Total number of HTTP requests made
-   **Transfer Size**: Total size of all resources transferred

## Bottleneck Categories

The extension identifies bottlenecks in the following categories:

-   **Network Latency**: Issues related to network connection speed and server response times
-   **Resource Size**: Large file sizes (images, scripts, CSS)
-   **Blocking Resources**: Render-blocking CSS and JavaScript
-   **Unoptimized Images**: Images that are not properly compressed or sized
-   **Inefficient JavaScript**: Slow-running or blocking JavaScript code
-   **Unoptimized CSS**: Large or inefficient CSS stylesheets
-   **Font Loading Issues**: Slow font loading or blocking rendering
-   **Third-Party Scripts**: Slow or poorly performing third-party scripts

## Installation

### Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store.

### Manual Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the Performance Insights icon in your browser toolbar to open the popup
2. Navigate to a website you want to analyze
3. Open Chrome DevTools (F12 or Ctrl+Shift+I) and select the "Performance Insights" panel
4. View the performance analysis, bottlenecks, and suggestions

### Popup Features

The popup provides a quick overview of the current page's performance:

-   Status indicator showing if analysis is complete
-   Quick metrics summary (Page Load, FCP, LCP, Request Count)
-   Top bottlenecks detected on the page
-   Button to open the full DevTools panel for detailed analysis

### DevTools Panel Features

The DevTools panel provides comprehensive performance analysis:

-   Complete performance metrics dashboard
-   Interactive waterfall chart of all resources
-   Detailed bottleneck list with severity indicators
-   Actionable optimization suggestions for each bottleneck
-   Settings panel for customization
-   Export functionality for sharing or further analysis

## Project Structure

```
performance-insights/
├── manifest.json                 # Extension manifest file
├── popup/                        # Popup UI files
├── devtools/                     # DevTools panel
├── background/                   # Background scripts
├── content/                      # Content scripts
├── modules/                      # Modular JavaScript code
│   ├── network-monitor.js        # Network request monitoring
│   ├── resource-analyzer.js      # Resource analysis
│   ├── performance-metrics.js    # Performance metrics calculation
│   ├── bottleneck-detector.js    # Bottleneck detection
│   ├── suggestion-engine.js      # Optimization suggestions
│   ├── data-storage.js           # Data storage and management
│   ├── bottlenecks/              # Individual bottleneck detectors
│   ├── ui/                       # UI components
├── utils/                        # Utility functions
├── lib/                          # Third-party libraries
├── assets/                       # Images, icons, etc.
```

## Development

### Prerequisites

-   Node.js and npm

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Load the extension in Chrome as described in the Installation section

### Building Icons

The extension uses SVG icons that are converted to PNG for different sizes:

```
node convert-icons.js
```

## Browser Compatibility

The extension is designed for Chrome and other Chromium-based browsers (Edge, Brave, etc.) using Manifest V3. Firefox support is planned for future releases.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Chirag Singhal
