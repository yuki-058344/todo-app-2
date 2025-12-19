import { useState, useMemo, useEffect, useCallback } from 'react';
import { Todo, Priority } from '@/types/todo';
import * as todosApi from '@/lib/api/todos';

export type SortType = 'createdAt' | 'priority' | 'text' | 'completed';
export type SortOrder = 'asc' | 'desc';
export type FilterType = 'all' | 'active' | 'completed';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<SortType>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初回データ取得
  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await todosApi.fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (text: string, priority: Priority = 'medium') => {
    if (text.trim() === '') return;

    try {
      setError(null);
      const newTodo = await todosApi.createTodo({ text: text.trim(), priority });
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'TODOの追加に失敗しました');
    }
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      setError(null);
      await todosApi.deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'TODOの削除に失敗しました');
    }
  }, []);

  const toggleTodo = useCallback(async (id: string) => {
    try {
      setError(null);
      const updatedTodo = await todosApi.toggleTodo(id);
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'TODOの更新に失敗しました');
    }
  }, []);

  const updatePriority = useCallback(async (id: string, priority: Priority) => {
    try {
      setError(null);
      const updatedTodo = await todosApi.updatePriority(id, priority);
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '優先順位の更新に失敗しました');
    }
  }, []);

  const reorderTodos = useCallback(async (draggedId: string, targetId: string) => {
    // 楽観的更新のために先にUIを更新
    setTodos((prevTodos) => {
      const newTodos = [...prevTodos];
      const draggedIndex = newTodos.findIndex((todo) => todo.id === draggedId);
      const targetIndex = newTodos.findIndex((todo) => todo.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return prevTodos;

      const [draggedTodo] = newTodos.splice(draggedIndex, 1);
      newTodos.splice(targetIndex, 0, draggedTodo);

      // バックグラウンドでAPI更新
      todosApi.reorderTodos(draggedId, targetId, prevTodos).catch((err) => {
        setError(err instanceof Error ? err.message : '順序の更新に失敗しました');
        // エラー時はデータを再取得
        fetchTodos();
      });

      return newTodos;
    });
  }, [fetchTodos]);

  const priorityOrder: Record<Priority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const filteredAndSortedTodos = useMemo(() => {
    // フィルタリング
    let filtered = todos;
    switch (filterType) {
      case 'active':
        filtered = todos.filter((todo) => !todo.completed);
        break;
      case 'completed':
        filtered = todos.filter((todo) => todo.completed);
        break;
      case 'all':
      default:
        filtered = todos;
        break;
    }

    // ソート
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortType) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'priority':
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'text':
          comparison = a.text.localeCompare(b.text, 'ja');
          break;
        case 'completed':
          comparison = Number(a.completed) - Number(b.completed);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [todos, sortType, sortOrder, filterType]);

  return {
    todos: filteredAndSortedTodos,
    isLoading,
    error,
    addTodo,
    deleteTodo,
    toggleTodo,
    updatePriority,
    reorderTodos,
    refetch: fetchTodos,
    sortType,
    setSortType,
    sortOrder,
    setSortOrder,
    filterType,
    setFilterType,
  };
}
