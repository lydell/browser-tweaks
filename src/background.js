async function start() {
  const titleContextMenuId =
    chrome.contextMenus.refresh != null
      ? chrome.contextMenus.create({
          title: "",
          visible: false,
          contexts: [
            "audio",
            "editable",
            "frame",
            "image",
            "link",
            "page",
            "password",
            "selection",
            "video",
          ],
        })
      : undefined;

  chrome.runtime.onMessage.addListener((message, sender) => {
    switch (message.type) {
      case "Title": {
        if (titleContextMenuId != null) {
          const title = message.title == null ? "(no title)" : message.title;
          chrome.contextMenus.update(titleContextMenuId, {
            title,
            visible: message.title != null,
            onclick: () => {
              chrome.tabs.sendMessage(sender.tab.id, {
                type: "Alert",
                text: title,
              });
            },
          });
          chrome.contextMenus.refresh();
        }
        break;
      }

      default:
        console.error(
          "browser-tweaks/background.js: Unknown message",
          message,
          sender
        );
    }
  });

  chrome.commands.onCommand.addListener(command => {
    switch (command) {
      case "close-tabs-to-right":
        chrome.tabs.query({ currentWindow: true }, tabs => {
          const index = tabs.findIndex(tab => tab.active);
          const ids =
            index >= 0
              ? tabs
                  .slice(index + 1)
                  .filter(tab => !tab.hidden && !tab.pinned)
                  .map(tab => tab.id)
              : [];
          chrome.tabs.remove(ids);
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

start().catch(error => {
  console.error("browser-tweaks/background.js: Failed to start", error);
});
