/**
 * Data Storage Module
 * 
 * Responsible for managing temporary storage of performance data during analysis
 * and persistent storage of user settings.
 */

export class DataStorage {
  constructor() {
    // Default settings
    this.defaultSettings = {
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
  }
  
  /**
   * Initialize data storage
   * @returns {Promise} - Promise that resolves when initialization is complete
   */
  async initialize() {
    // Load settings from storage
    await this.loadSettings();
    
    return true;
  }
  
  /**
   * Load settings from storage
   * @returns {Promise} - Promise that resolves with the settings
   */
  async loadSettings() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get(this.defaultSettings, (settings) => {
          this.settings = settings;
          resolve(settings);
        });
      } else {
        // Fallback to localStorage for development or non-Chrome environments
        try {
          const storedSettings = localStorage.getItem('performanceInsightsSettings');
          if (storedSettings) {
            this.settings = JSON.parse(storedSettings);
          } else {
            this.settings = this.defaultSettings;
          }
        } catch (error) {
          console.error('Error loading settings from localStorage:', error);
          this.settings = this.defaultSettings;
        }
        
        resolve(this.settings);
      }
    });
  }
  
  /**
   * Save settings to storage
   * @param {Object} settings - Settings to save
   * @returns {Promise} - Promise that resolves when settings are saved
   */
  async saveSettings(settings) {
    return new Promise((resolve) => {
      // Merge with existing settings
      const updatedSettings = { ...this.settings, ...settings };
      this.settings = updatedSettings;
      
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set(updatedSettings, () => {
          resolve(updatedSettings);
        });
      } else {
        // Fallback to localStorage for development or non-Chrome environments
        try {
          localStorage.setItem('performanceInsightsSettings', JSON.stringify(updatedSettings));
        } catch (error) {
          console.error('Error saving settings to localStorage:', error);
        }
        
        resolve(updatedSettings);
      }
    });
  }
  
  /**
   * Reset settings to default
   * @returns {Promise} - Promise that resolves when settings are reset
   */
  async resetSettings() {
    return this.saveSettings(this.defaultSettings);
  }
  
  /**
   * Get settings
   * @returns {Object} - Current settings
   */
  getSettings() {
    return this.settings || this.defaultSettings;
  }
  
  /**
   * Save performance data for a tab
   * @param {number} tabId - Tab ID
   * @param {Object} data - Performance data
   * @returns {Promise} - Promise that resolves when data is saved
   */
  async saveTabPerformanceData(tabId, data) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const key = `tabPerformance_${tabId}`;
        chrome.storage.local.set({ [key]: data }, () => {
          resolve(data);
        });
      } else {
        // Fallback to localStorage for development or non-Chrome environments
        try {
          localStorage.setItem(`tabPerformance_${tabId}`, JSON.stringify(data));
        } catch (error) {
          console.error('Error saving tab performance data to localStorage:', error);
        }
        
        resolve(data);
      }
    });
  }
  
  /**
   * Get performance data for a tab
   * @param {number} tabId - Tab ID
   * @returns {Promise} - Promise that resolves with the performance data
   */
  async getTabPerformanceData(tabId) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const key = `tabPerformance_${tabId}`;
        chrome.storage.local.get([key], (result) => {
          resolve(result[key] || null);
        });
      } else {
        // Fallback to localStorage for development or non-Chrome environments
        try {
          const data = localStorage.getItem(`tabPerformance_${tabId}`);
          resolve(data ? JSON.parse(data) : null);
        } catch (error) {
          console.error('Error getting tab performance data from localStorage:', error);
          resolve(null);
        }
      }
    });
  }
  
  /**
   * Clear performance data for a tab
   * @param {number} tabId - Tab ID
   * @returns {Promise} - Promise that resolves when data is cleared
   */
  async clearTabPerformanceData(tabId) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const key = `tabPerformance_${tabId}`;
        chrome.storage.local.remove(key, () => {
          resolve();
        });
      } else {
        // Fallback to localStorage for development or non-Chrome environments
        try {
          localStorage.removeItem(`tabPerformance_${tabId}`);
        } catch (error) {
          console.error('Error clearing tab performance data from localStorage:', error);
        }
        
        resolve();
      }
    });
  }
  
  /**
   * Save current tab performance data for popup
   * @param {Object} data - Performance data
   * @returns {Promise} - Promise that resolves when data is saved
   */
  async saveCurrentTabPerformance(data) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ currentTabPerformance: data }, () => {
          resolve(data);
        });
      } else {
        // Fallback to localStorage for development or non-Chrome environments
        try {
          localStorage.setItem('currentTabPerformance', JSON.stringify(data));
        } catch (error) {
          console.error('Error saving current tab performance to localStorage:', error);
        }
        
        resolve(data);
      }
    });
  }
  
  /**
   * Get current tab performance data for popup
   * @returns {Promise} - Promise that resolves with the performance data
   */
  async getCurrentTabPerformance() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['currentTabPerformance'], (result) => {
          resolve(result.currentTabPerformance || null);
        });
      } else {
        // Fallback to localStorage for development or non-Chrome environments
        try {
          const data = localStorage.getItem('currentTabPerformance');
          resolve(data ? JSON.parse(data) : null);
        } catch (error) {
          console.error('Error getting current tab performance from localStorage:', error);
          resolve(null);
        }
      }
    });
  }
}
