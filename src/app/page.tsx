'use client';

import { useTodos } from '@/hooks/useTodos';
import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import styles from './page.module.css';

const APP_TITLE = 'TODOアプリ';

export default function Home() {
  const { todos, addTodo, deleteTodo } = useTodos();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{APP_TITLE}</h1>
        <TodoForm onAddTodo={addTodo} />
        <TodoList todos={todos} onDeleteTodo={deleteTodo} />
      </div>
    </div>
  );
}
