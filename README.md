# ToDone - Simple Todo List for VS Code

A clean and elegant todo list manager that lives in your VS Code sidebar. Manage project tasks with ease using collapsible sections, drag-and-drop reordering, and persistent storage.

[![Version](https://img.shields.io/visual-studio-marketplace/v/hugoalmeida.todone)](https://marketplace.visualstudio.com/items?itemName=hugoalmeida.todone)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/hugoalmeida.todone)](https://marketplace.visualstudio.com/items?itemName=hugoalmeida.todone)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/hugoalmeida.todone)](https://marketplace.visualstudio.com/items?itemName=hugoalmeida.todone)

## ✨ Features

- **📝 Quick Task Entry** - Add todos instantly with the "+ Add Todo" button or `Ctrl+Shift+A`
- **✅ Collapsible Sections** - Separate TODO and DONE sections that collapse independently
- **🎯 Drag & Drop** - Reorder tasks within sections by dragging
- **⚡ Keyboard Shortcuts** - Complete, delete, and manage tasks without touching your mouse
- **💾 Persistent Storage** - Todos saved per-project in `.vscode/todone.json`
- **🗑️ Bulk Actions** - Clear all completed todos at once
- **🎨 Strikethrough Completed** - Visual distinction for completed tasks
- **📦 Git-Friendly** - Commit your todo list to share with your team, or add to `.gitignore` for personal use

## 📸 Screenshots

### Todo List in Action
*The extension adds a clean todo list to your VS Code sidebar with collapsible sections.*

### Features
- **TODO section** - Expanded by default, shows active tasks
- **DONE section** - Collapsed by default to save space, shows completed tasks with strikethrough
- **Quick add button** - Always visible at the top
- **Clear completed** - Hover over DONE section to see the clear all button

## 🚀 Getting Started

### Installation

1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type `ext install hugoalmeida.todone`
4. Press Enter

Or search for "ToDone" in the Extensions view (`Ctrl+Shift+X`).

### Basic Usage

1. **Open a workspace** - The extension requires a workspace folder
2. **Click the clipboard icon** in the Activity Bar (sidebar)
3. **Add your first todo** - Click "+ Add Todo" or press `Ctrl+Shift+A`
4. **Manage your tasks**:
   - Click the checkmark icon to mark complete
   - Press `Delete` to remove a task
   - Drag and drop to reorder
   - Click section headers to collapse/expand

## ⌨️ Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|--------------|-------|
| Add Todo | `Ctrl+Shift+A` | `Cmd+Shift+A` |
| Toggle Done | `Ctrl+Enter` | `Cmd+Enter` |
| Delete Todo | `Delete` | `Delete` |
| Refresh List | `Ctrl+Shift+R` | `Cmd+Shift+R` |

## 📁 Data Storage

Todos are stored in your workspace at:
```
<workspace>/.vscode/todone.json
```

### Personal vs Team Todos

**Personal Use** - Add to `.gitignore`:
```gitignore
.vscode/todone.json
```

**Team Use** - Commit the file to share todos with your team:
```bash
git add .vscode/todone.json
git commit -m "Add project todos"
```

## 🎨 Features in Detail

### Collapsible Sections
- **TODO** - Active tasks, expanded by default
- **DONE** - Completed tasks, collapsed by default to save space
- Click section headers to toggle visibility

### Drag and Drop
- Reorder tasks within the same section
- Maintain custom sort order
- Cannot drag between TODO and DONE (use toggle instead)

### Clear Completed
- Hover over the DONE section header
- Click the "Clear All" icon
- Confirms before deleting all completed tasks

### Strikethrough Styling
- Completed tasks show with strikethrough text
- Green checkmark icon
- ✓ badge for visual distinction

## 🔧 Requirements

- VS Code 1.80.0 or higher
- An open workspace folder

## 🐛 Known Issues

- Extension requires a workspace folder to be open
- Cannot drag todos between TODO and DONE sections (use the toggle button instead)

## 📝 Release Notes

### 1.0.0 (Initial Release)

Initial release of ToDone with all core features:
- Add, toggle, and delete todos
- Collapsible TODO and DONE sections
- Drag-and-drop reordering
- Persistent storage per project
- Keyboard shortcuts
- Clear all completed todos
- Strikethrough formatting for completed tasks

See [CHANGELOG.md](CHANGELOG.md) for detailed release history.

## 🤝 Contributing

Found a bug or have a feature request?

- **Issues**: [GitHub Issues](https://github.com/hugoalmeida-pt/todone/issues)
- **Pull Requests**: Contributions welcome!

## 📄 License

This extension is licensed under the [MIT License](LICENSE).

## 💖 Support

If you find this extension useful, please:
- ⭐ Star the [GitHub repository](https://github.com/hugoalmeida-pt/todone)
- ✍️ Leave a review on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=hugoalmeida.todone)
- 🐛 Report issues or suggest features

---

**Enjoy managing your tasks with ToDone!** 📋✨
