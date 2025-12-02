import * as vscode from 'vscode';
import { TodoItem } from './todoItem';
import { TodoStorage } from './storage';

export class TodoProvider implements vscode.TreeDataProvider<TodoTreeItem>, vscode.TreeDragAndDropController<TodoTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TodoTreeItem | undefined | null | void> = new vscode.EventEmitter<TodoTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TodoTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  // Drag and drop support
  dropMimeTypes = ['application/vnd.code.tree.todoneTodoList'];
  dragMimeTypes = ['application/vnd.code.tree.todoneTodoList'];

  private todos: TodoItem[] = [];
  private storage: TodoStorage;

  constructor(private workspaceRoot: string) {
    this.storage = new TodoStorage(workspaceRoot);
    this.todos = this.storage.load();
    this.ensureOrder();
  }

  private ensureOrder(): void {
    // Ensure all todos have order property
    let maxOrder = 0;
    this.todos.forEach((todo, index) => {
      if (todo.order === undefined) {
        todo.order = index;
      }
      maxOrder = Math.max(maxOrder, todo.order);
    });
    // Sort by order
    this.todos.sort((a, b) => a.order - b.order);
  }

  refresh(): void {
    this.todos = this.storage.load();
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TodoTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TodoTreeItem): Thenable<TodoTreeItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No workspace folder open');
      return Promise.resolve([]);
    }

    if (!element) {
      // Root level - return section headers and add button
      return Promise.resolve(this.getRootItems());
    } else if (element.sectionType === 'todo') {
      // Return TODO section children
      const activeTodos = this.todos.filter(t => !t.done).sort((a, b) => a.order - b.order);
      return Promise.resolve(activeTodos.map(todo => new TodoTreeItem(
        todo.text,
        vscode.TreeItemCollapsibleState.None,
        false,
        todo
      )));
    } else if (element.sectionType === 'done') {
      // Return DONE section children
      const doneTodos = this.todos.filter(t => t.done).sort((a, b) => b.createdAt - a.createdAt);
      return Promise.resolve(doneTodos.map(todo => new TodoTreeItem(
        todo.text,
        vscode.TreeItemCollapsibleState.None,
        false,
        todo
      )));
    }

    return Promise.resolve([]);
  }

  private getRootItems(): TodoTreeItem[] {
    const activeTodos = this.todos.filter(t => !t.done);
    const doneTodos = this.todos.filter(t => t.done);

    const items: TodoTreeItem[] = [];

    // Add permanent "Add Todo" button at the top
    items.push(new TodoTreeItem(
      '+ Add Todo',
      vscode.TreeItemCollapsibleState.None,
      false,
      undefined,
      'addButton'
    ));

    // Add "TODO" section (always show, even if empty)
    items.push(new TodoTreeItem(
      `TODO (${activeTodos.length})`,
      activeTodos.length > 0 ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None,
      true,
      undefined,
      'section',
      'todo'
    ));

    // Add "DONE" section (collapsed by default)
    if (doneTodos.length > 0) {
      items.push(new TodoTreeItem(
        `DONE (${doneTodos.length})`,
        vscode.TreeItemCollapsibleState.Collapsed,
        true,
        undefined,
        'section',
        'done'
      ));
    }

    return items;
  }

  addTodo(text: string): void {
    const maxOrder = this.todos.reduce((max, todo) => Math.max(max, todo.order || 0), -1);
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      done: false,
      createdAt: Date.now(),
      order: maxOrder + 1
    };

    this.todos.push(newTodo);
    this.storage.save(this.todos);
    this.refresh();
  }

  toggleDone(item: TodoTreeItem): void {
    if (!item.todo) {
      return;
    }

    const todo = this.todos.find(t => t.id === item.todo!.id);
    if (todo) {
      todo.done = !todo.done;
      this.storage.save(this.todos);
      this.refresh();
    }
  }

  deleteTodo(item: TodoTreeItem): void {
    if (!item.todo) {
      return;
    }

    this.todos = this.todos.filter(t => t.id !== item.todo!.id);
    this.storage.save(this.todos);
    this.refresh();
  }

  clearCompleted(): void {
    this.todos = this.todos.filter(t => !t.done);
    this.storage.save(this.todos);
    this.refresh();
  }

  // Drag and Drop implementation
  public async handleDrag(source: readonly TodoTreeItem[], dataTransfer: vscode.DataTransfer): Promise<void> {
    // Only allow dragging actual todo items
    const items = source.filter(item => item.todo && !item.isHeader && !item.specialType);
    dataTransfer.set('application/vnd.code.tree.todoneTodoList', new vscode.DataTransferItem(items));
  }

  public async handleDrop(target: TodoTreeItem | undefined, dataTransfer: vscode.DataTransfer): Promise<void> {
    const transferItem = dataTransfer.get('application/vnd.code.tree.todoneTodoList');
    if (!transferItem) {
      return;
    }

    const draggedItems: TodoTreeItem[] = transferItem.value;
    if (!draggedItems || draggedItems.length === 0) {
      return;
    }

    const draggedTodo = draggedItems[0].todo;
    if (!draggedTodo) {
      return;
    }

    // Can't drop on headers, sections, or special items
    if (target?.isHeader || target?.specialType) {
      return;
    }

    // Can only drop on items of the same status (done/not done)
    if (target?.todo && target.todo.done !== draggedTodo.done) {
      return;
    }

    // Find the dragged todo in our list
    const draggedIndex = this.todos.findIndex(t => t.id === draggedTodo.id);
    if (draggedIndex === -1) {
      return;
    }

    // Determine target index
    let targetIndex: number;

    if (!target || !target.todo) {
      // Dropped at the end of the section
      const sameSectionTodos = this.todos.filter(t => t.done === draggedTodo.done);
      if (sameSectionTodos.length === 0) {
        return;
      }
      const lastInSection = sameSectionTodos[sameSectionTodos.length - 1];
      targetIndex = this.todos.findIndex(t => t.id === lastInSection.id);
    } else {
      targetIndex = this.todos.findIndex(t => t.id === target.todo!.id);
      if (targetIndex === -1) {
        return;
      }
    }

    // Don't reorder if same position
    if (draggedIndex === targetIndex) {
      return;
    }

    // Reorder the array
    const [removed] = this.todos.splice(draggedIndex, 1);
    this.todos.splice(targetIndex, 0, removed);

    // Update order values
    this.todos.forEach((todo, index) => {
      todo.order = index;
    });

    this.storage.save(this.todos);
    this.refresh();
  }

  getTodos(): TodoItem[] {
    return this.todos;
  }
}

export class TodoTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly isHeader: boolean,
    public readonly todo?: TodoItem,
    public readonly specialType?: string,
    public readonly sectionType?: 'todo' | 'done'
  ) {
    // Apply strikethrough to done items using Unicode combining characters
    const displayLabel = todo?.done ? applyStrikethrough(label) : label;
    super(displayLabel, collapsibleState);

    if (specialType === 'addButton') {
      // Add button
      this.contextValue = 'addButton';
      this.iconPath = new vscode.ThemeIcon('add', new vscode.ThemeColor('charts.green'));
      this.command = {
        command: 'todone.addTodo',
        title: 'Add Todo'
      };
      this.tooltip = 'Click to add a new todo (Ctrl+Shift+A)';
    } else if (specialType === 'section') {
      // Collapsible section headers (TODO/DONE)
      // Use different contextValue for DONE section to show clear button
      this.contextValue = sectionType === 'done' ? 'doneSection' : 'section';
      this.iconPath = undefined;
    } else if (isHeader) {
      // Legacy section headers (should not be used anymore)
      this.contextValue = 'header';
      this.iconPath = undefined;
    } else if (todo) {
      // Regular todo items
      this.contextValue = 'todoItem';

      if (todo.done) {
        // Done items - strikethrough applied in label above
        this.description = '✓';
        this.iconPath = new vscode.ThemeIcon('check', new vscode.ThemeColor('terminal.ansiGreen'));
        this.command = undefined;
      } else {
        this.description = '';
        this.iconPath = new vscode.ThemeIcon('circle-outline');
      }
    }
  }
}

// Helper function to apply strikethrough using Unicode combining characters
function applyStrikethrough(text: string): string {
  // U+0336 is the combining long stroke overlay (strikethrough)
  return text.split('').map(char => char + '\u0336').join('');
}
