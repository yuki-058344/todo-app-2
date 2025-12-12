import { Todo } from '@/types/todo';
import styles from '../app/page.module.css';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function TodoItem({ todo, onDelete, onToggle }: TodoItemProps) {
  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleToggle = () => {
    onToggle(todo.id);
  };

  return (
    <li className={styles.todoItem}>
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
        onClick={handleDelete}
        className={styles.deleteButton}
        aria-label="削除"
      >
        ×
      </button>
    </li>
  );
}

