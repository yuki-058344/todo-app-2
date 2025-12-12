import { Todo } from '@/types/todo';
import { TodoItem } from './TodoItem';
import styles from '../app/page.module.css';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (id: string) => void;
  onToggleTodo: (id: string) => void;
}

const EMPTY_MESSAGE = 'TODOがありません。新しいTODOを追加してください。';

export function TodoList({
  todos,
  onDeleteTodo,
  onToggleTodo,
}: TodoListProps) {
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
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDeleteTodo}
            onToggle={onToggleTodo}
          />
        ))}
      </ul>
    </div>
  );
}

