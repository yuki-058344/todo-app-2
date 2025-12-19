'use client';

import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import { TodoSort } from '@/components/TodoSort';
import { AuditLogSidebar } from '@/components/AuditLogSidebar';
import { ChatModal } from '@/components/ChatModal';
import { Todo } from '@/types/todo';
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

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleOpenChat = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const handleCloseChat = () => {
    setSelectedTodo(null);
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.mainArea}>
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
              onOpenChat={handleOpenChat}
            />
          )}
        </div>
      </div>
      <AuditLogSidebar />
      {selectedTodo && (
        <ChatModal todo={selectedTodo} onClose={handleCloseChat} />
      )}
    </div>
  );
}
