import { useState, useMemo } from 'react';
import { Todo, Priority } from '@/types/todo';

export type SortType = 'createdAt' | 'priority' | 'text' | 'completed';
export type SortOrder = 'asc' | 'desc';
export type FilterType = 'all' | 'active' | 'completed';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<SortType>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [customOrder, setCustomOrder] = useState<string[]>([]);

  const addTodo = (text: string, priority: Priority = 'medium') => {
    if (text.trim() === '') return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      priority,
      createdAt: Date.now(),
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const deleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const updatePriority = (id: string, priority: Priority) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  };

  const reorderTodos = (draggedId: string, targetId: string) => {
    setTodos((prevTodos) => {
      const newTodos = [...prevTodos];
      const draggedIndex = newTodos.findIndex((todo) => todo.id === draggedId);
      const targetIndex = newTodos.findIndex((todo) => todo.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return prevTodos;

      const [draggedTodo] = newTodos.splice(draggedIndex, 1);
      newTodos.splice(targetIndex, 0, draggedTodo);

      // カスタム順序を更新
      setCustomOrder(newTodos.map((todo) => todo.id));

      return newTodos;
    });
  };

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

    // カスタム順序が設定されている場合はそれを使用
    if (customOrder.length > 0 && customOrder.length === todos.length) {
      const orderMap = new Map(customOrder.map((id, index) => [id, index]));
      return filtered.sort((a, b) => {
        const aOrder = orderMap.get(a.id) ?? Infinity;
        const bOrder = orderMap.get(b.id) ?? Infinity;
        return aOrder - bOrder;
      });
    }

    // ソート
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortType) {
        case 'createdAt':
          comparison = a.createdAt - b.createdAt;
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
  }, [todos, sortType, sortOrder, filterType, customOrder]);

  return {
    todos: filteredAndSortedTodos,
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
    setCustomOrder,
  };
}

