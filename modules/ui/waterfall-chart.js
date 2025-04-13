/**
 * Waterfall Chart Module
 * 
 * Responsible for rendering the waterfall chart visualization of resource loading.
 */

export class WaterfallChart {
  constructor(container, resources) {
    this.container = container;
    this.resources = resources || [];
    this.filteredResources = [...this.resources];
    this.zoom = 1;
    this.colorMap = {
      document: '#4285F4', // Blue
      stylesheet: '#34A853', // Green
      script: '#FBBC05', // Yellow
      image: '#EA4335', // Red
      font: '#9C27B0', // Purple
      xhr: '#FF9800', // Orange
      media: '#00BCD4', // Cyan
      other: '#9E9E9E' // Gray
    };
  }
  
  /**
   * Render the waterfall chart
   */
  render() {
    // Clear the container
    this.container.innerHTML = '';
    
    // If no resources, show empty state
    if (!this.filteredResources || this.filteredResources.length === 0) {
      this.renderEmptyState();
      return;
    }
    
    // Calculate time range
    const timeRange = this.calculateTimeRange();
    if (!timeRange.startTime || !timeRange.endTime || timeRange.startTime === timeRange.endTime) {
      this.renderEmptyState('Invalid time range for resources');
      return;
    }
    
    // Create chart header
    const header = this.createChartHeader();
    this.container.appendChild(header);
    
    // Create chart body
    const body = this.createChartBody(timeRange);
    this.container.appendChild(body);
  }
  
  /**
   * Render empty state
   * @param {string} message - Optional message to display
   */
  renderEmptyState(message = 'No resources to display') {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = message;
    this.container.appendChild(emptyState);
  }
  
  /**
   * Create chart header
   * @returns {HTMLElement} - Chart header element
   */
  createChartHeader() {
    const header = document.createElement('div');
    header.className = 'waterfall-header';
    
    const nameHeader = document.createElement('div');
    nameHeader.className = 'waterfall-header-cell name-cell';
    nameHeader.textContent = 'Resource';
    
    const typeHeader = document.createElement('div');
    typeHeader.className = 'waterfall-header-cell type-cell';
    typeHeader.textContent = 'Type';
    
    const sizeHeader = document.createElement('div');
    sizeHeader.className = 'waterfall-header-cell size-cell';
    sizeHeader.textContent = 'Size';
    
    const timeHeader = document.createElement('div');
    timeHeader.className = 'waterfall-header-cell time-cell';
    timeHeader.textContent = 'Time';
    
    const timelineHeader = document.createElement('div');
    timelineHeader.className = 'waterfall-header-cell timeline-cell';
    timelineHeader.textContent = 'Timeline';
    
    header.appendChild(nameHeader);
    header.appendChild(typeHeader);
    header.appendChild(sizeHeader);
    header.appendChild(timeHeader);
    header.appendChild(timelineHeader);
    
    return header;
  }
  
  /**
   * Create chart body
   * @param {Object} timeRange - Time range object with startTime and endTime
   * @returns {HTMLElement} - Chart body element
   */
  createChartBody(timeRange) {
    const body = document.createElement('div');
    body.className = 'waterfall-body';
    
    // Sort resources by start time
    const sortedResources = [...this.filteredResources].sort((a, b) => {
      const aStartTime = new Date(a.startTime).getTime();
      const bStartTime = new Date(b.startTime).getTime();
      return aStartTime - bStartTime;
    });
    
    // Create rows for each resource
    sortedResources.forEach(resource => {
      const row = this.createResourceRow(resource, timeRange);
      body.appendChild(row);
    });
    
    return body;
  }
  
  /**
   * Create a row for a resource
   * @param {Object} resource - Resource object
   * @param {Object} timeRange - Time range object with startTime and endTime
   * @returns {HTMLElement} - Resource row element
   */
  createResourceRow(resource, timeRange) {
    const row = document.createElement('div');
    row.className = 'waterfall-row';
    
    // Resource name cell
    const nameCell = document.createElement('div');
    nameCell.className = 'waterfall-cell name-cell';
    nameCell.title = resource.url || '';
    
    const nameText = document.createElement('div');
    nameText.className = 'name-text';
    nameText.textContent = this.getResourceName(resource);
    nameCell.appendChild(nameText);
    
    // Resource type cell
    const typeCell = document.createElement('div');
    typeCell.className = 'waterfall-cell type-cell';
    typeCell.textContent = resource.type || 'other';
    
    // Resource size cell
    const sizeCell = document.createElement('div');
    sizeCell.className = 'waterfall-cell size-cell';
    sizeCell.textContent = this.formatSize(resource.size || 0);
    
    // Resource time cell
    const timeCell = document.createElement('div');
    timeCell.className = 'waterfall-cell time-cell';
    timeCell.textContent = this.formatTime(resource.timingBreakdown?.total || 0);
    
    // Resource timeline cell
    const timelineCell = document.createElement('div');
    timelineCell.className = 'waterfall-cell timeline-cell';
    
    // Create timeline bar
    const timelineBar = this.createTimelineBar(resource, timeRange);
    timelineCell.appendChild(timelineBar);
    
    // Add cells to row
    row.appendChild(nameCell);
    row.appendChild(typeCell);
    row.appendChild(sizeCell);
    row.appendChild(timeCell);
    row.appendChild(timelineCell);
    
    // Add click event to show details
    row.addEventListener('click', () => {
      this.showResourceDetails(resource);
    });
    
    return row;
  }
  
  /**
   * Create a timeline bar for a resource
   * @param {Object} resource - Resource object
   * @param {Object} timeRange - Time range object with startTime and endTime
   * @returns {HTMLElement} - Timeline bar element
   */
  createTimelineBar(resource, timeRange) {
    const timelineBar = document.createElement('div');
    timelineBar.className = 'timeline-bar';
    
    // Calculate start and end times
    const startTime = new Date(resource.startTime).getTime();
    const endTime = new Date(resource.endTime).getTime();
    
    // Calculate position and width
    const totalDuration = timeRange.endTime - timeRange.startTime;
    const startPosition = ((startTime - timeRange.startTime) / totalDuration) * 100;
    const width = ((endTime - startTime) / totalDuration) * 100;
    
    // Apply position and width with zoom
    timelineBar.style.left = `${startPosition * this.zoom}%`;
    timelineBar.style.width = `${Math.max(width * this.zoom, 2)}%`; // Minimum width of 2px
    
    // Set color based on resource type
    timelineBar.style.backgroundColor = this.getResourceColor(resource);
    
    // Add waiting and downloading segments if available
    if (resource.timingBreakdown) {
      const { waiting, downloading } = resource.timingBreakdown;
      const total = waiting + downloading;
      
      if (total > 0 && waiting > 0) {
        const waitingSegment = document.createElement('div');
        waitingSegment.className = 'timeline-segment waiting';
        waitingSegment.style.width = `${(waiting / total) * 100}%`;
        timelineBar.appendChild(waitingSegment);
      }
      
      if (total > 0 && downloading > 0) {
        const downloadingSegment = document.createElement('div');
        downloadingSegment.className = 'timeline-segment downloading';
        downloadingSegment.style.width = `${(downloading / total) * 100}%`;
        timelineBar.appendChild(downloadingSegment);
      }
    }
    
    return timelineBar;
  }
  
  /**
   * Show resource details
   * @param {Object} resource - Resource object
   */
  showResourceDetails(resource) {
    // In a real implementation, this would show a detailed view of the resource
    console.log('Resource details:', resource);
    
    // Create a custom event to notify the panel
    const event = new CustomEvent('resourceSelected', { detail: resource });
    this.container.dispatchEvent(event);
  }
  
  /**
   * Calculate time range for all resources
   * @returns {Object} - Time range object with startTime and endTime
   */
  calculateTimeRange() {
    if (!this.filteredResources || this.filteredResources.length === 0) {
      return { startTime: 0, endTime: 0 };
    }
    
    let startTime = Infinity;
    let endTime = -Infinity;
    
    this.filteredResources.forEach(resource => {
      const resourceStartTime = new Date(resource.startTime).getTime();
      const resourceEndTime = new Date(resource.endTime).getTime();
      
      if (resourceStartTime < startTime) {
        startTime = resourceStartTime;
      }
      
      if (resourceEndTime > endTime) {
        endTime = resourceEndTime;
      }
    });
    
    // Add a small buffer to the start and end times
    const buffer = (endTime - startTime) * 0.05;
    return {
      startTime: Math.max(0, startTime - buffer),
      endTime: endTime + buffer
    };
  }
  
  /**
   * Get resource name from URL
   * @param {Object} resource - Resource object
   * @returns {string} - Resource name
   */
  getResourceName(resource) {
    if (!resource.url) {
      return 'Unknown';
    }
    
    try {
      const url = new URL(resource.url);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      if (fileName) {
        return fileName;
      }
      
      return url.hostname;
    } catch (error) {
      return resource.url.split('/').pop() || resource.url;
    }
  }
  
  /**
   * Get color for resource type
   * @param {Object} resource - Resource object
   * @returns {string} - Color for resource type
   */
  getResourceColor(resource) {
    const type = resource.type || 'other';
    return this.colorMap[type] || this.colorMap.other;
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
   * Format time in ms to a readable format
   * @param {number} timeInMs - Time in milliseconds
   * @returns {string} - Formatted time
   */
  formatTime(timeInMs) {
    if (!timeInMs && timeInMs !== 0) {
      return '-';
    }
    
    if (timeInMs < 1000) {
      return `${timeInMs.toFixed(0)}ms`;
    } else {
      return `${(timeInMs / 1000).toFixed(2)}s`;
    }
  }
  
  /**
   * Filter resources by type
   * @param {string} type - Resource type to filter by
   */
  filter(type) {
    if (type === 'all') {
      this.filteredResources = [...this.resources];
    } else {
      this.filteredResources = this.resources.filter(resource => 
        resource.type === type
      );
    }
    
    this.render();
  }
  
  /**
   * Set zoom level
   * @param {number} zoom - Zoom level
   */
  setZoom(zoom) {
    this.zoom = zoom;
    this.render();
  }
  
  /**
   * Update resources
   * @param {Array} resources - New resources array
   */
  updateResources(resources) {
    this.resources = resources || [];
    this.filteredResources = [...this.resources];
    this.render();
  }
}
