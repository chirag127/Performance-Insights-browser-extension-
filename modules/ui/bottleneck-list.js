/**
 * Bottleneck List Module
 * 
 * Responsible for displaying bottlenecks and optimization suggestions.
 */

export class BottleneckList {
  constructor(container) {
    this.container = container;
    this.bottlenecks = [];
    this.selectedBottleneck = null;
  }
  
  /**
   * Initialize the bottleneck list
   */
  initialize() {
    // Clear the container
    this.container.innerHTML = '';
    
    // Add empty state
    this.showEmptyState();
  }
  
  /**
   * Update bottlenecks in the list
   * @param {Array} bottlenecks - Array of bottlenecks
   */
  updateBottlenecks(bottlenecks) {
    this.bottlenecks = bottlenecks || [];
    
    // Clear the container
    this.container.innerHTML = '';
    
    // If no bottlenecks, show empty state
    if (!this.bottlenecks || this.bottlenecks.length === 0) {
      this.showEmptyState();
      return;
    }
    
    // Sort bottlenecks by severity (high to low)
    const sortedBottlenecks = this.sortBottlenecksBySeverity(this.bottlenecks);
    
    // Create bottleneck cards
    sortedBottlenecks.forEach(bottleneck => {
      const bottleneckCard = this.createBottleneckCard(bottleneck);
      this.container.appendChild(bottleneckCard);
    });
  }
  
  /**
   * Show empty state
   */
  showEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = '<p>No bottlenecks detected.</p>';
    this.container.appendChild(emptyState);
  }
  
  /**
   * Create a bottleneck card
   * @param {Object} bottleneck - Bottleneck object
   * @returns {HTMLElement} - Bottleneck card element
   */
  createBottleneckCard(bottleneck) {
    const bottleneckCard = document.createElement('div');
    bottleneckCard.className = `bottleneck-card ${bottleneck.severity}`;
    
    // Severity badge
    const severityBadge = document.createElement('div');
    severityBadge.className = `bottleneck-severity ${bottleneck.severity}`;
    severityBadge.textContent = this.formatSeverity(bottleneck.severity);
    
    // Title
    const title = document.createElement('div');
    title.className = 'bottleneck-title';
    title.textContent = bottleneck.category;
    
    // Description
    const description = document.createElement('div');
    description.className = 'bottleneck-description';
    description.textContent = bottleneck.description;
    
    // Affected resources
    const resourcesSection = document.createElement('div');
    resourcesSection.className = 'bottleneck-resources';
    
    const resourcesTitle = document.createElement('div');
    resourcesTitle.className = 'bottleneck-resources-title';
    resourcesTitle.textContent = 'Affected Resources:';
    resourcesSection.appendChild(resourcesTitle);
    
    if (bottleneck.resources && bottleneck.resources.length > 0) {
      bottleneck.resources.forEach(resource => {
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-item';
        resourceItem.textContent = resource.url || 'Unknown resource';
        resourcesSection.appendChild(resourceItem);
      });
    } else {
      const noResources = document.createElement('div');
      noResources.className = 'resource-item';
      noResources.textContent = 'No specific resources identified';
      resourcesSection.appendChild(noResources);
    }
    
    // Suggestions
    const suggestionsSection = document.createElement('div');
    suggestionsSection.className = 'bottleneck-suggestions';
    
    const suggestionsTitle = document.createElement('div');
    suggestionsTitle.className = 'suggestions-title';
    suggestionsTitle.textContent = 'Optimization Suggestions:';
    suggestionsSection.appendChild(suggestionsTitle);
    
    if (bottleneck.suggestions && bottleneck.suggestions.length > 0) {
      bottleneck.suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        
        const bullet = document.createElement('span');
        bullet.className = 'suggestion-bullet';
        bullet.textContent = '•';
        
        const text = document.createElement('span');
        text.textContent = suggestion.text;
        
        suggestionItem.appendChild(bullet);
        suggestionItem.appendChild(text);
        
        if (suggestion.link) {
          const link = document.createElement('a');
          link.className = 'suggestion-link';
          link.href = suggestion.link;
          link.target = '_blank';
          link.textContent = 'Learn more';
          
          text.appendChild(document.createTextNode(' '));
          text.appendChild(link);
        }
        
        suggestionsSection.appendChild(suggestionItem);
      });
    } else {
      const noSuggestions = document.createElement('div');
      noSuggestions.className = 'suggestion-item';
      noSuggestions.textContent = 'No specific suggestions available';
      suggestionsSection.appendChild(noSuggestions);
    }
    
    // Assemble card
    bottleneckCard.appendChild(severityBadge);
    bottleneckCard.appendChild(title);
    bottleneckCard.appendChild(description);
    bottleneckCard.appendChild(resourcesSection);
    bottleneckCard.appendChild(suggestionsSection);
    
    // Add click event to select bottleneck
    bottleneckCard.addEventListener('click', () => {
      this.selectBottleneck(bottleneck, bottleneckCard);
    });
    
    return bottleneckCard;
  }
  
  /**
   * Select a bottleneck
   * @param {Object} bottleneck - Bottleneck object
   * @param {HTMLElement} card - Bottleneck card element
   */
  selectBottleneck(bottleneck, card) {
    // Deselect previously selected bottleneck
    const selectedCards = this.container.querySelectorAll('.bottleneck-card.selected');
    selectedCards.forEach(selectedCard => {
      selectedCard.classList.remove('selected');
    });
    
    // Select the new bottleneck
    this.selectedBottleneck = bottleneck;
    card.classList.add('selected');
    
    // Create a custom event to notify the panel
    const event = new CustomEvent('bottleneckSelected', { detail: bottleneck });
    this.container.dispatchEvent(event);
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
  
  /**
   * Format severity string
   * @param {string} severity - Severity string
   * @returns {string} - Formatted severity
   */
  formatSeverity(severity) {
    if (!severity) return 'Unknown';
    
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  }
  
  /**
   * Filter bottlenecks by category
   * @param {string} category - Category to filter by
   */
  filterByCategory(category) {
    if (!category || category === 'all') {
      // Show all bottlenecks
      this.updateBottlenecks(this.bottlenecks);
      return;
    }
    
    // Filter bottlenecks by category
    const filteredBottlenecks = this.bottlenecks.filter(bottleneck => 
      bottleneck.category === category
    );
    
    // Update the list with filtered bottlenecks
    this.updateBottlenecks(filteredBottlenecks);
  }
  
  /**
   * Filter bottlenecks by severity
   * @param {string} severity - Severity to filter by
   */
  filterBySeverity(severity) {
    if (!severity || severity === 'all') {
      // Show all bottlenecks
      this.updateBottlenecks(this.bottlenecks);
      return;
    }
    
    // Filter bottlenecks by severity
    const filteredBottlenecks = this.bottlenecks.filter(bottleneck => 
      bottleneck.severity === severity
    );
    
    // Update the list with filtered bottlenecks
    this.updateBottlenecks(filteredBottlenecks);
  }
  
  /**
   * Get all unique bottleneck categories
   * @returns {Array} - Array of unique categories
   */
  getCategories() {
    if (!this.bottlenecks || this.bottlenecks.length === 0) {
      return [];
    }
    
    // Get all unique categories
    const categories = new Set();
    this.bottlenecks.forEach(bottleneck => {
      if (bottleneck.category) {
        categories.add(bottleneck.category);
      }
    });
    
    return Array.from(categories);
  }
}
