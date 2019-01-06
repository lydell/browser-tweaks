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
}

start().catch(error => {
  console.error("browser-tweaks/background.js: Failed to start", error);
});
