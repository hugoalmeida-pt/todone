import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TodoItem, TodoData } from './todoItem';

export class TodoStorage {
  private filePath: string;

  constructor(workspaceRoot: string) {
    const vscodePath = path.join(workspaceRoot, '.vscode');

    // Ensure .vscode directory exists
    if (!fs.existsSync(vscodePath)) {
      fs.mkdirSync(vscodePath, { recursive: true });
    }

    this.filePath = path.join(vscodePath, 'todone.json');
  }

  load(): TodoItem[] {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        const parsed: TodoData = JSON.parse(data);
        return parsed.todos || [];
      }
    } catch (error) {
      console.error('Error loading todos:', error);
      vscode.window.showErrorMessage('Failed to load todos');
    }
    return [];
  }

  save(todos: TodoItem[]): void {
    try {
      const data: TodoData = { todos };
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving todos:', error);
      vscode.window.showErrorMessage('Failed to save todos');
    }
  }

  getFilePath(): string {
    return this.filePath;
  }
}
