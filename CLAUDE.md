# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ToDone** is a VS Code extension that provides a simple sidebar todo list manager. Todos are saved per-project in `.vscode/todone.json` and can be version controlled with git.

## Technology Stack

- **TypeScript**: Primary language
- **VS Code Extension API**: TreeView API for sidebar integration
- **Node.js**: Runtime (v25.1.0)

## Architecture

### Core Components

1. **extension.ts** (`src/extension.ts`)
   - Extension entry point
   - Registers commands: `todone.addTodo`, `todone.toggleDone`, `todone.deleteTodo`, `todone.clearCompleted`, `todone.refresh`
   - Creates TreeView with drag-and-drop support
   - Activates on workspace open (`onStartupFinished`)

2. **TodoProvider** (`src/todoProvider.ts`)
   - Implements `vscode.TreeDataProvider<TodoTreeItem>` and `vscode.TreeDragAndDropController<TodoTreeItem>`
   - Manages todo state and tree structure
   - Organizes todos into collapsible "TODO" and "DONE" sections
   - Tree structure: Root → Section Headers → Todo Items (parent-child hierarchy)
   - Provides methods: `addTodo()`, `toggleDone()`, `deleteTodo()`, `clearCompleted()`, `refresh()`
   - Implements drag-and-drop: `handleDrag()`, `handleDrop()` (within same section only)
   - Maintains custom sort order via `order` property

3. **TodoStorage** (`src/storage.ts`)
   - Handles file I/O for `.vscode/todone.json`
   - Creates `.vscode` directory if needed
   - Loads and saves `TodoItem[]` array
   - Error handling for file operations

4. **Data Model** (`src/todoItem.ts`)
   - `TodoItem`: `{ id, text, done, createdAt, order }`
   - `TodoData`: `{ todos: TodoItem[] }` (JSON file structure)
   - `order`: Integer for custom sorting (maintained via drag-and-drop)

### UI Structure

- **Sidebar View**: Custom activity bar icon with "Tasks" view
- **Add Button**: Permanent "+ Add Todo" button at the top of the list (green plus icon)
- **Collapsible Sections**:
  - "TODO (n)" - Expanded by default, contains active todos
  - "DONE (n)" - Collapsed by default, contains completed todos with inline "Clear Completed" button
  - Click section headers to expand/collapse independently
- **Todo Items**:
  - Active todos show circle outline icon
  - Done todos show strikethrough text with green checkmark icon and (✓) badge
  - Context menu: toggle done, delete
  - **Drag and drop**: Reorder todos by dragging within the same section
- **Toolbar Actions**: Add (+), Refresh
- **Clear Completed**: Inline button on DONE section header to delete all completed todos (with confirmation)

## Common Development Commands

### Build & Run
```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-compile on save)
npm run watch

# Run extension (or press F5 in VS Code)
# Opens Extension Development Host window
```

### Testing the Extension
1. Press `F5` to launch Extension Development Host
2. Open any workspace folder in the new window
3. Click the todo list icon in the activity bar (sidebar)
4. Click "+ Add Todo" or use `Ctrl+Shift+A` (`Cmd+Shift+A` on Mac)
5. Select a todo and press `Ctrl+Enter` (`Cmd+Enter` on Mac) to toggle done
6. Press `Delete` to remove a todo
7. Drag and drop todos to reorder them within their section
8. Click section headers (TODO/DONE) to collapse/expand them
9. Notice done todos have strikethrough text
10. Hover over the DONE section header to see the "Clear Completed" button (trash icon)
11. Click it to delete all completed todos at once (requires confirmation)

### Keyboard Shortcuts
- **Add Todo**: `Ctrl+Shift+A` (Mac: `Cmd+Shift+A`)
- **Toggle Done**: `Ctrl+Enter` (Mac: `Cmd+Enter`) - when todo is selected
- **Delete Todo**: `Delete` - when todo is selected
- **Refresh**: `Ctrl+Shift+R` (Mac: `Cmd+Shift+R`)

### Debugging
- Breakpoints work in TypeScript source files
- `console.log()` output appears in Debug Console
- Launch configuration in `.vscode/launch.json`

## File Locations

- **Source**: `src/*.ts`
- **Compiled**: `out/*.js` (gitignored)
- **Configuration**: `package.json`, `tsconfig.json`
- **Todo Data**: `.vscode/todone.json` (created in workspace root)
- **Extension Icon**: `resources/todo-icon.svg`

## Extension Manifest (`package.json`)

Key sections:
- **activationEvents**: `onStartupFinished` (loads extension on workspace open)
- **contributes.viewsContainers**: Adds activity bar icon
- **contributes.views**: Registers "Tasks" tree view
- **contributes.commands**: Defines all commands
- **contributes.menus**: Adds buttons to view title and item context menus

## Data Persistence

Todos are stored in `<workspace>/.vscode/todone.json`:

```json
{
  "todos": [
    {
      "id": "1732541234567",
      "text": "Example todo",
      "done": false,
      "createdAt": 1732541234567,
      "order": 0
    }
  ]
}
```

This file can be committed to git for team-shared todos, or added to `.gitignore` for personal use.

## Known Limitations

- **Single Workspace**: Extension requires a workspace folder to be open.
- **Drag Between Sections**: Can't drag todos between TODO and DONE sections directly (use toggle instead).

## Features Implemented

- ✅ Add, toggle, delete todos
- ✅ Persistent storage in `.vscode/todone.json`
- ✅ Drag-and-drop reordering within sections
- ✅ Keyboard shortcuts for all actions
- ✅ Permanent "+ Add Todo" button for quick access
- ✅ Automatic separation of active and done todos
- ✅ Strikethrough formatting for completed todos (using Unicode combining characters)
- ✅ Collapsible sections (TODO and DONE) that can be expanded/collapsed independently
- ✅ DONE section collapsed by default to save space
- ✅ Clear Completed button to delete all done todos at once (with confirmation dialog)

## Future Enhancements

Potential features to add:
- Todo priorities/tags
- Due dates
- Subtasks
- Filtering/search
- Multi-workspace support
- Batch operations (mark all done, clear completed, etc.)
