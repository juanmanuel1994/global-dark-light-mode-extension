Dark / Light Mode Toggle - Chrome Extension
============================================

A simple Chrome extension that lets you switch any website between dark and light mode with a single click.

HOW IT WORKS
------------
The extension applies a CSS filter (invert + hue-rotate) to the page to simulate dark mode. It is smart enough to detect pages that already have their own dark theme (like YouTube) to avoid double-inverting them.

FEATURES
--------
- Global toggle: enable dark mode across all websites at once
- Per-site override: force Light or Dark mode on specific sites, independent of the global setting
- Auto mode: each site follows the global setting by default
- Preferences are saved and synced across devices via Chrome storage
- Works instantly on all open tabs, even after an extension update

USAGE
-----
1. Click the extension icon to open the popup
2. Use the main toggle to enable or disable dark mode globally
3. On any specific site, use the Light / Dark / Auto buttons to override that site individually
