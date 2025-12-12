import { Todo } from '@/types/todo';
import styles from '../app/page.module.css';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onDelete }: TodoItemProps) {
  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <li className={styles.todoItem}>
      <span className={styles.todoText}>{todo.text}</span>
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

