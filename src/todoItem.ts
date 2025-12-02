export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
  order: number;
}

export interface TodoData {
  todos: TodoItem[];
}
