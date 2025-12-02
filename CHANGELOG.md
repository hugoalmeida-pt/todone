# Change Log

All notable changes to the "ToDone" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-02

### Added
- Initial release of ToDone
- Quick add button permanently visible at the top of the list
- Collapsible TODO and DONE sections
- TODO section expanded by default
- DONE section collapsed by default to save space
- Strikethrough formatting for completed todos
- Drag and drop reordering within sections
- Clear all completed todos functionality
- Keyboard shortcuts for all actions:
  - `Ctrl+Shift+A` / `Cmd+Shift+A` - Add todo
  - `Ctrl+Enter` / `Cmd+Enter` - Toggle done
  - `Delete` - Delete todo
  - `Ctrl+Shift+R` / `Cmd+Shift+R` - Refresh list
- Persistent storage in `.vscode/todone.json`
- Context menu actions on todo items
- Inline action buttons for quick access
- Custom sort order maintained via drag and drop
- Automatic separation of active and completed tasks
- Visual indicators:
  - Circle outline for active todos
  - Green checkmark with strikethrough for completed todos
  - Badge with ✓ symbol on completed items
- Confirmation dialogs for destructive actions
- Support for team-shared or personal todo lists via git

### Features
- Clean sidebar integration with custom activity bar icon
- Real-time updates when todos are modified
- Empty state handling
- Works with any workspace folder
- Supports both light and dark VS Code themes

## [Unreleased]

### Planned Features
- Todo priorities/tags
- Due dates
- Subtasks
- Search/filter functionality
- Multi-workspace support
- Import/export functionality
- Batch operations
- Todo templates
