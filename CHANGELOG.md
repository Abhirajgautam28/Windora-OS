
# Changelog

All notable changes to the **Windora OS** project will be documented in this file.

## [1.0.0] - 2024-05-20

### Added
- **Draggable Desktop Icons**: Users can now move app shortcuts around the desktop freely.
- **Virtual Desktops**: Implementation of Task View for workspace management.
- **File Explorer Tabs**: Added multi-tab support to the file manager.
- **System Apps**: Added Calculator, Weather, Clock, News, Mail, Tasks, and more.
- **Games**: Added Snake, Minesweeper, Tic-Tac-Toe, and 2048.
- **Utilities**: Added Disk Cleanup and Screen Recorder.
- **Customization**: Accent color picker and Dark Mode toggle.

### Changed
- Refactored `App.tsx` to support dynamic window management and desktop state.
- Updated `TerminalApp` to support file system operations (`cd`, `ls`, `mkdir`, etc.).
- Improved `StartMenu` design with pinned and recommended sections.

### Fixed
- Fixed module resolution issues with relative imports.
- Fixed window snapping logic.
