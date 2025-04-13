/**
 * Settings Panel Module
 * 
 * Responsible for managing the settings panel UI and interactions.
 */

export class SettingsPanel {
  constructor(container) {
    this.container = container;
    this.isOpen = false;
    this.settings = {
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
    this.elements = {};
    this.onSettingsChanged = null;
  }
  
  /**
   * Initialize the settings panel
   */
  initialize() {
    // Find all settings elements
    this.elements = {
      autoAnalysisToggle: document.getElementById('auto-analysis-toggle'),
      networkThrottling: document.getElementById('network-throttling'),
      showPageLoad: document.getElementById('show-page-load'),
      showDomContentLoaded: document.getElementById('show-dom-content-loaded'),
      showFcp: document.getElementById('show-fcp'),
      showLcp: document.getElementById('show-lcp'),
      showTti: document.getElementById('show-tti'),
      showTbt: document.getElementById('show-tbt'),
      suggestionLevel: document.getElementById('suggestion-level'),
      saveSettingsBtn: document.getElementById('save-settings-btn'),
      resetSettingsBtn: document.getElementById('reset-settings-btn'),
      openSettingsBtn: document.getElementById('settings-btn'),
      closeSettingsBtn: document.getElementById('close-settings-btn')
    };
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Open settings button
    if (this.elements.openSettingsBtn) {
      this.elements.openSettingsBtn.addEventListener('click', () => {
        this.open();
      });
    }
    
    // Close settings button
    if (this.elements.closeSettingsBtn) {
      this.elements.closeSettingsBtn.addEventListener('click', () => {
        this.close();
      });
    }
    
    // Save settings button
    if (this.elements.saveSettingsBtn) {
      this.elements.saveSettingsBtn.addEventListener('click', () => {
        this.saveSettings();
        this.close();
      });
    }
    
    // Reset settings button
    if (this.elements.resetSettingsBtn) {
      this.elements.resetSettingsBtn.addEventListener('click', () => {
        this.resetSettings();
      });
    }
  }
  
  /**
   * Open the settings panel
   */
  open() {
    this.container.classList.add('open');
    this.isOpen = true;
  }
  
  /**
   * Close the settings panel
   */
  close() {
    this.container.classList.remove('open');
    this.isOpen = false;
  }
  
  /**
   * Toggle the settings panel
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  /**
   * Update settings in the UI
   * @param {Object} settings - Settings object
   */
  updateSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    
    // Update UI elements with settings values
    if (this.elements.autoAnalysisToggle) {
      this.elements.autoAnalysisToggle.checked = this.settings.autoAnalysis;
    }
    
    if (this.elements.networkThrottling) {
      this.elements.networkThrottling.value = this.settings.networkThrottling;
    }
    
    if (this.elements.showPageLoad) {
      this.elements.showPageLoad.checked = this.settings.showMetrics.pageLoad;
    }
    
    if (this.elements.showDomContentLoaded) {
      this.elements.showDomContentLoaded.checked = this.settings.showMetrics.domContentLoaded;
    }
    
    if (this.elements.showFcp) {
      this.elements.showFcp.checked = this.settings.showMetrics.fcp;
    }
    
    if (this.elements.showLcp) {
      this.elements.showLcp.checked = this.settings.showMetrics.lcp;
    }
    
    if (this.elements.showTti) {
      this.elements.showTti.checked = this.settings.showMetrics.tti;
    }
    
    if (this.elements.showTbt) {
      this.elements.showTbt.checked = this.settings.showMetrics.tbt;
    }
    
    if (this.elements.suggestionLevel) {
      this.elements.suggestionLevel.value = this.settings.suggestionLevel;
    }
  }
  
  /**
   * Save settings from UI
   */
  saveSettings() {
    // Get settings from UI elements
    const settings = {
      autoAnalysis: this.elements.autoAnalysisToggle ? this.elements.autoAnalysisToggle.checked : true,
      networkThrottling: this.elements.networkThrottling ? this.elements.networkThrottling.value : 'none',
      showMetrics: {
        pageLoad: this.elements.showPageLoad ? this.elements.showPageLoad.checked : true,
        domContentLoaded: this.elements.showDomContentLoaded ? this.elements.showDomContentLoaded.checked : true,
        fcp: this.elements.showFcp ? this.elements.showFcp.checked : true,
        lcp: this.elements.showLcp ? this.elements.showLcp.checked : true,
        tti: this.elements.showTti ? this.elements.showTti.checked : true,
        tbt: this.elements.showTbt ? this.elements.showTbt.checked : true
      },
      suggestionLevel: this.elements.suggestionLevel ? this.elements.suggestionLevel.value : 'intermediate'
    };
    
    // Update settings
    this.settings = settings;
    
    // Notify listeners
    if (this.onSettingsChanged) {
      this.onSettingsChanged(settings);
    }
    
    // Create a custom event to notify the panel
    const event = new CustomEvent('settingsChanged', { detail: settings });
    this.container.dispatchEvent(event);
    
    return settings;
  }
  
  /**
   * Reset settings to default
   */
  resetSettings() {
    const defaultSettings = {
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
    
    // Update UI with default settings
    this.updateSettings(defaultSettings);
    
    // Save settings
    this.saveSettings();
  }
  
  /**
   * Get current settings
   * @returns {Object} - Current settings
   */
  getSettings() {
    return { ...this.settings };
  }
  
  /**
   * Set callback for settings changed event
   * @param {Function} callback - Callback function
   */
  setOnSettingsChanged(callback) {
    if (typeof callback === 'function') {
      this.onSettingsChanged = callback;
    }
  }
}
