// All `<input type="…">` values that look like a button by default, and can be
// activated by pressing space and as such prevent _scrolling_ by pressing space
// when focused. Note: Blurring `<input type="file">` when pressing space does
// not result in a page scroll on Firefox (but all the others do).
const BUTTON_INPUT_TYPES = new Set([
  "button",
  "color",
  "file",
  "image",
  "reset",
  "submit",
]);

async function start() {
  chrome.runtime.onMessage.addListener((message, sender) => {
    switch (message.type) {
      case "Alert":
        // eslint-disable-next-line no-alert
        window.alert(message.text);
        break;

      default:
        console.error(
          "browser-tweaks/content.js: Unknown message",
          message,
          sender
        );
    }
  });

  window.addEventListener(
    "keydown",
    event => {
      if (!event.isTrusted || event.repeat) {
        return;
      }

      if (event.key === "ContextMenu") {
        chrome.runtime.sendMessage({
          type: "Title",
          title: findTitle(event.target),
        });
      }

      const { activeElement } = document;

      // Scroll the page when pressing space while a button is focused, rather
      // than activating the button. The button can still be activated by
      // pressing Enter (or sometimes ctrl+space or similar).
      if (
        event.key === " " &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        // `event.shiftKey` scrolls backwards.
        activeElement != null &&
        (activeElement instanceof HTMLButtonElement ||
          (activeElement instanceof HTMLInputElement &&
            BUTTON_INPUT_TYPES.has(activeElement.type)) ||
          activeElement.nodeName === "SUMMARY")
      ) {
        activeElement.blur();
      }
    },
    { passive: true, capture: true }
  );

  window.addEventListener(
    "mousedown",
    event => {
      if (!event.isTrusted) {
        return;
      }

      // Right-click.
      if (event.button === 2) {
        chrome.runtime.sendMessage({
          type: "Title",
          title: undefined,
        });
      }
    },
    { passive: true, capture: true }
  );
}

const TITLE_SELECTOR = "[title], [alt], [aria-label]";

function findTitle(element) {
  const title1 = getTitle(element);
  if (title1 != null) {
    return title1;
  }

  const parent = element.closest(TITLE_SELECTOR);
  if (parent != null) {
    const title2 = getTitle(parent);
    if (title2 != null) {
      return title2;
    }
  }

  const children = element.querySelectorAll(TITLE_SELECTOR);
  if (children.length === 1) {
    const title3 = getTitle(children[0]);
    if (title3 != null) {
      return title3;
    }
  }

  return undefined;
}

function getTitle(element) {
  const parts = [
    element.title,
    element.getAttribute("alt"),
    element.getAttribute("aria-label"),
  ]
    .map(maybeText => (maybeText || "").trim())
    .filter(Boolean);

  return parts.length === 0 ? undefined : parts.join(" | ");
}

start().catch(error => {
  console.error("browser-tweaks/content.js: Failed to start", error);
});
