import { useState } from 'react';
import { Todo, Priority } from '@/types/todo';
import styles from '../app/page.module.css';

interface TodoItemProps {
  todo: Todo;
  index: number;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  onOpenChat: (todo: Todo) => void;
}

const priorityLabels: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

export function TodoItem({
  todo,
  index,
  onDelete,
  onToggle,
  onUpdatePriority,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  onOpenChat,
}: TodoItemProps) {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handlePriorityClick = () => {
    const priorityOrder: Priority[] = ['high', 'medium', 'low'];
    const currentIndex = priorityOrder.indexOf(todo.priority);
    const nextIndex = (currentIndex + 1) % priorityOrder.length;
    onUpdatePriority(todo.id, priorityOrder[nextIndex]);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', todo.id);
    onDragStart(todo.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggedOver(true);
    onDragOver(e, todo.id);
  };

  const handleDragLeave = () => {
    setIsDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggedOver(false);
    onDrop(e, todo.id);
  };

  return (
    <li
      className={`${styles.todoItem} ${isDragging ? styles.dragging : ''} ${
        isDraggedOver ? styles.dragOver : ''
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
    >
      <span className={styles.dragHandle} aria-label="ドラッグハンドル">
        ⋮⋮
      </span>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className={styles.checkbox}
        aria-label={todo.completed ? '未完了にする' : '完了にする'}
      />
      <span
        className={`${styles.todoText} ${
          todo.completed ? styles.completed : ''
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={handlePriorityClick}
        className={`${styles.priorityBadge} ${styles[todo.priority]}`}
        aria-label={`優先順位を変更（現在: ${priorityLabels[todo.priority]}）`}
        type="button"
      >
        {priorityLabels[todo.priority]}
      </button>
      <button
        onClick={() => onOpenChat(todo)}
        className={styles.chatButton}
        aria-label="チャットを開く"
        type="button"
      >
        💬
      </button>
      <button
        onClick={handleDelete}
        className={styles.deleteButton}
        aria-label="削除"
      >
        ×
      </button>
    </li>
  );
}
