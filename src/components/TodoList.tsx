import { useState } from 'react';
import { Todo, Priority } from '@/types/todo';
import { TodoItem } from './TodoItem';
import styles from '../app/page.module.css';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (id: string) => void;
  onToggleTodo: (id: string) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
  onReorderTodos: (draggedId: string, targetId: string) => void;
  onOpenChat: (todo: Todo) => void;
}

const EMPTY_MESSAGE = 'TODOがありません。新しいTODOを追加してください。';

export function TodoList({
  todos,
  onDeleteTodo,
  onToggleTodo,
  onUpdatePriority,
  onReorderTodos,
  onOpenChat,
}: TodoListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && draggedId !== targetId) {
      onReorderTodos(draggedId, targetId);
    }
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  if (todos.length === 0) {
    return (
      <div className={styles.todoList}>
        <p className={styles.emptyMessage}>{EMPTY_MESSAGE}</p>
      </div>
    );
  }

  return (
    <div className={styles.todoList}>
      <ul className={styles.list}>
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            index={index}
            onDelete={onDeleteTodo}
            onToggle={onToggleTodo}
            onUpdatePriority={onUpdatePriority}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            isDragging={draggedId === todo.id}
            onOpenChat={onOpenChat}
          />
        ))}
      </ul>
    </div>
  );
}

