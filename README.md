# browser-tweaks

Personal browser extension containing a couple of tweaks.

- Alt+Shift+U to close tabs to the right.
- Alt+Shift+P to toggle pinned tab.
- Alt+Shift+D to duplicate tab.
- Custom CSS for Wikipedia.

### Firefox

1. Install [Firefox Developer Edition].
2. Run `npm run build`.
3. Rename the generated `.zip` file to `.xpi`.
4. Open the `.xpi` file in Firefox (`ctrl+o`).

### Chrome

1. Go to `chrome://extensions`.
2. Enable Developer Mode.
3. Load the `src/` directory as an unpacked extension.

[firefox developer edition]: https://www.mozilla.org/firefox/developer/
