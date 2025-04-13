// Create a panel in Chrome DevTools
chrome.devtools.panels.create(
  "Performance Insights", // Panel title
  "/assets/icons/icon16.png", // Panel icon
  "/devtools/panel/panel.html", // Panel HTML page
  (panel) => {
    // Panel created callback
    console.log("Performance Insights DevTools panel created");
    
    // Listen for panel showing/hiding events
    panel.onShown.addListener((panelWindow) => {
      // Panel is shown
      chrome.runtime.sendMessage({
        type: 'devtoolsPanelShown',
        tabId: chrome.devtools.inspectedWindow.tabId
      });
    });
    
    panel.onHidden.addListener(() => {
      // Panel is hidden
      chrome.runtime.sendMessage({
        type: 'devtoolsPanelHidden',
        tabId: chrome.devtools.inspectedWindow.tabId
      });
    });
  }
);

// Create a connection to the background script
const backgroundPageConnection = chrome.runtime.connect({
  name: "devtools-page"
});

// Send the tab ID to the background script
backgroundPageConnection.postMessage({
  type: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

// Listen for network request events
chrome.devtools.network.onRequestFinished.addListener((request) => {
  // Send network request data to the background script
  backgroundPageConnection.postMessage({
    type: 'networkRequest',
    tabId: chrome.devtools.inspectedWindow.tabId,
    request: {
      url: request.request.url,
      method: request.request.method,
      type: request.type,
      size: request.response.content.size,
      mimeType: request.response.content.mimeType,
      status: request.response.status,
      timing: request.time,
      startTime: request.startedDateTime,
      endTime: new Date(new Date(request.startedDateTime).getTime() + request.time),
      // Add more request data as needed
    }
  });
});
