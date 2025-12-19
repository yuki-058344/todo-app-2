export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// データベースから取得した行をTodo型に変換するための型
export interface TodoRow {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// 新規作成時の入力型
export interface CreateTodoInput {
  text: string;
  priority?: Priority;
}

// 更新時の入力型
export interface UpdateTodoInput {
  text?: string;
  completed?: boolean;
  priority?: Priority;
  display_order?: number;
}

