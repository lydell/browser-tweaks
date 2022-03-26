async function start() {
  chrome.commands.onCommand.addListener((command) => {
    switch (command) {
      case "close-tabs-to-right":
        chrome.tabs.query({ currentWindow: true }, (tabs) => {
          const index = tabs.findIndex((tab) => tab.active);
          const ids =
            index >= 0
              ? tabs
                  .slice(index + 1)
                  .filter((tab) => !tab.hidden && !tab.pinned)
                  .map((tab) => tab.id)
              : [];
          chrome.tabs.remove(ids);
        });
        break;

      case "duplicate-tab":
        chrome.tabs.query({ currentWindow: true, active: true }, ([tab]) => {
          chrome.tabs.duplicate(tab.id);
        });
        break;

      case "toggle-pinned-tab":
        chrome.tabs.query({ currentWindow: true, active: true }, ([tab]) => {
          chrome.tabs.update(tab.id, { pinned: !tab.pinned });
        });
        break;

      default:
        console.error("browser-tweaks/background.js: Unknown command", command);
    }
  });
}

start().catch((error) => {
  console.error("browser-tweaks/background.js: Failed to start", error);
});
