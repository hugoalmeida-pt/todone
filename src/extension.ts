import * as vscode from 'vscode';
import { TodoProvider } from './todoProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('ToDone extension is now active');

  // Get workspace root (may be undefined)
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const workspaceRoot = workspaceFolders?.[0]?.uri.fsPath;

  let todoProvider: TodoProvider | undefined;
  let treeView: vscode.TreeView<any> | undefined;

  // Only initialize provider if we have a workspace
  if (workspaceRoot) {
    todoProvider = new TodoProvider(workspaceRoot);

    // Register the tree data provider with drag and drop
    treeView = vscode.window.createTreeView('todoneTodoList', {
      treeDataProvider: todoProvider,
      dragAndDropController: todoProvider,
      canSelectMany: false
    });
  }

  // Helper to check if workspace is available
  const checkWorkspace = (): boolean => {
    if (!todoProvider || !workspaceRoot) {
      vscode.window.showErrorMessage('No workspace folder open. Please open a folder to use ToDone.');
      return false;
    }
    return true;
  };

  // Register commands (always register them, check workspace inside)
  const addTodoCommand = vscode.commands.registerCommand('todone.addTodo', async () => {
    if (!checkWorkspace()) return;

    const text = await vscode.window.showInputBox({
      prompt: 'Enter todo text',
      placeHolder: 'What needs to be done?'
    });

    if (text && text.trim()) {
      todoProvider!.addTodo(text.trim());
      vscode.window.showInformationMessage(`Todo added: ${text}`);
    }
  });

  const toggleDoneCommand = vscode.commands.registerCommand('todone.toggleDone', (item) => {
    if (!checkWorkspace()) return;
    todoProvider!.toggleDone(item);
  });

  const deleteTodoCommand = vscode.commands.registerCommand('todone.deleteTodo', async (item) => {
    if (!checkWorkspace()) return;

    const confirmed = await vscode.window.showWarningMessage(
      `Delete todo: "${item.todo?.text}"?`,
      'Delete',
      'Cancel'
    );

    if (confirmed === 'Delete') {
      todoProvider!.deleteTodo(item);
      vscode.window.showInformationMessage('Todo deleted');
    }
  });

  const refreshCommand = vscode.commands.registerCommand('todone.refresh', () => {
    if (!checkWorkspace()) return;
    todoProvider!.refresh();
  });

  const clearCompletedCommand = vscode.commands.registerCommand('todone.clearCompleted', async () => {
    if (!checkWorkspace()) return;

    const doneTodos = todoProvider!.getTodos().filter(t => t.done);
    if (doneTodos.length === 0) {
      vscode.window.showInformationMessage('No completed todos to clear');
      return;
    }

    const confirmed = await vscode.window.showWarningMessage(
      `Delete ${doneTodos.length} completed todo${doneTodos.length > 1 ? 's' : ''}?`,
      { modal: true },
      'Delete',
      'Cancel'
    );

    if (confirmed === 'Delete') {
      todoProvider!.clearCompleted();
      vscode.window.showInformationMessage(`Cleared ${doneTodos.length} completed todo${doneTodos.length > 1 ? 's' : ''}`);
    }
  });

  // Add all disposables to context
  context.subscriptions.push(
    addTodoCommand,
    toggleDoneCommand,
    deleteTodoCommand,
    refreshCommand,
    clearCompletedCommand
  );

  // Add tree view if it was created
  if (treeView) {
    context.subscriptions.push(treeView);
  }
}

export function deactivate() {}
