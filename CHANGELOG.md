# Release Notes and Change Log

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/pddljdmihkpdfpkgmbhdomeeifpklgnm)](https://chrome.google.com/webstore/detail/vertical-tabs/pddljdmihkpdfpkgmbhdomeeifpklgnm)
[![users](https://img.shields.io/chrome-web-store/users/pddljdmihkpdfpkgmbhdomeeifpklgnm)](https://chrome.google.com/webstore/detail/vertical-tabs/pddljdmihkpdfpkgmbhdomeeifpklgnm)

[![issues open](https://img.shields.io/github/issues-raw/lxieyang/vertical-tabs-chrome-extension)](https://github.com/lxieyang/vertical-tabs-chrome-extension/issues?q=is%3Aopen+is%3Aissue)
[![issues closed](https://img.shields.io/github/issues-closed-raw/lxieyang/vertical-tabs-chrome-extension)](https://github.com/lxieyang/vertical-tabs-chrome-extension/issues?q=is%3Aissue+is%3Aclosed)
[![pr open](https://img.shields.io/github/issues-pr-raw/lxieyang/vertical-tabs-chrome-extension)](https://github.com/lxieyang/vertical-tabs-chrome-extension/pulls?q=is%3Aopen+is%3Apr)
[![pr closed](https://img.shields.io/github/issues-pr-closed-raw/lxieyang/vertical-tabs-chrome-extension)](https://github.com/lxieyang/vertical-tabs-chrome-extension/pulls?q=is%3Apr+is%3Aclosed)

All notable changes to this project will be documented in this file.

# v1.x (official releases)

### [1.0.2](https://github.com/lxieyang/vertical-tabs-chrome-extension/releases/tag/v1.0.2) (2019-08-27)

- Fixed a bug where settings could go out of sync across tabs
- Added a tip for using `Command + E` (`Ctrl + E` on PCs) to toggle the sidebar

### [1.0.1](https://github.com/lxieyang/vertical-tabs-chrome-extension/releases/tag/v1.0.1) (2019-08-22)

- Updated dependencies

### [1.0.0](https://github.com/lxieyang/vertical-tabs-chrome-extension/releases/tag/v1.0.0) (2019-08-21)

#### Official release! 🎆🎆🎆🔥🔥🔥❤❤❤

- Added a settings menu where you could customize:

  - whether to put the sidebar on the **left** or the **right** side of the browser window
  - whether to have the sidebar squeeze the webpage you're viewing when it opens
  - whether to display the tab titles in full or truncated (in one line, overflow hidden)

<img src="./preview/repo/settings-popover.png" alt="settings" width="250" />

# v0.x (preview releases)

### [0.4.1](https://github.com/lxieyang/vertical-tabs-chrome-extension/releases/tag/v0.4.1) (2019-08-19)

- Fixed a bug where long press could trigger the context menu.

### [0.4.0](https://github.com/lxieyang/vertical-tabs-chrome-extension/releases/tag/v0.4.0) (2019-08-12)

#### New Features:

- Context menus.
- Added (re)loading indicator.
- Added new keyboard shortcut: `Ctrl/Command + E`.

#### Bug fixes:

- Fixed a browser icon bug.
- Autofocuses on the search box once sidebar opens.

### [0.3.0](https://github.com/lxieyang/vertical-tabs-chrome-extension/releases/tag/v0.3.0) (2019-08-07)

- Search and filter tabs.

<img src="./preview/repo/filter-tabs.gif" alt="filter tabs" width="250" />

### [0.2.0](https://github.com/lxieyang/vertical-tabs-chrome-extension/releases/tag/v0.2.0) (2019-08-07)

- Drag and Drop to reorder the tabs.

![dnd tabs](./preview/repo/dnd-tabs.gif)

### [0.1.2](https://github.com/lxieyang/vertical-tabs-chrome-extension/releases/tag/v0.1.2) (2019-08-05)

- Sync the scroll position of the sidebar across all tabs.
- Fixed a bug where tab highlights won't clear after the cursor leaves the tab.
- Higher favicon resolution.
- Fixed an issue where the extension icon was not properly updated upon first installation.

### [0.1.1](https://github.com/lxieyang/vertical-tabs-chrome-extension/releases/tag/v0.1.1) (2019-07-31)

- Minor styling fixes.
- Display the reload button on hover.

### [0.1.0](https://github.com/lxieyang/vertical-tabs-chrome-extension/releases/tag/v0.1.0) (2019-07-27)

#### Initial Release! 🎆🔥❤

- **Basic Feature:**
  - Display tabs vertically in a sidebar on web pages.
  - Tabs are displayed with the same style as Google Chrome.
  - Toggle the sidebar by clicking on the extension icon.
  - Toggle the sidebar using the keyboard shortcut: `Ctrl` + `` ` `` or `Ctrl` + `Esc` or `Cmd` + `Esc` or `Opt` + `Esc` or `Alt` + `Esc`
    - Using keyboard shortcuts are recommended once you formed the corresponding muscle memory.
  - The sidebar is resizable.
