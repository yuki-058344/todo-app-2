export interface Chat {
  id: string;
  todoId: string;
  message: string;
  createdAt: Date;
}

export interface ChatRow {
  id: string;
  todo_id: string;
  message: string;
  created_at: string;
}

export interface CreateChatInput {
  todoId: string;
  message: string;
}

