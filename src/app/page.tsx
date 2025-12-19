'use client';

import { useTodos } from '@/hooks/useTodos';
import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import { TodoSort } from '@/components/TodoSort';
import styles from './page.module.css';

const APP_TITLE = 'TODOアプリ';

export default function Home() {
  const {
    todos,
    isLoading,
    error,
    addTodo,
    deleteTodo,
    toggleTodo,
    updatePriority,
    reorderTodos,
    sortType,
    setSortType,
    sortOrder,
    setSortOrder,
    filterType,
    setFilterType,
  } = useTodos();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{APP_TITLE}</h1>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <TodoForm onAddTodo={addTodo} />
        <TodoSort
          sortType={sortType}
          sortOrder={sortOrder}
          filterType={filterType}
          onSortTypeChange={setSortType}
          onSortOrderChange={setSortOrder}
          onFilterTypeChange={setFilterType}
        />
        {isLoading ? (
          <div className={styles.loadingMessage}>読み込み中...</div>
        ) : (
          <TodoList
            todos={todos}
            onDeleteTodo={deleteTodo}
            onToggleTodo={toggleTodo}
            onUpdatePriority={updatePriority}
            onReorderTodos={reorderTodos}
          />
        )}
      </div>
    </div>
  );
}
