import { supabase } from '../supabase';
import {
  Todo,
  TodoRow,
  Priority,
  CreateTodoInput,
  UpdateTodoInput,
} from '@/types/todo';

// データベース行をTodo型に変換
function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    text: row.text,
    completed: row.completed,
    priority: row.priority,
    displayOrder: row.display_order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// 全件取得
export async function fetchTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch todos: ${error.message}`);
  }

  return (data as TodoRow[]).map(rowToTodo);
}

// 新規作成
export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  // 現在の最大display_orderを取得
  const { data: maxOrderData } = await supabase
    .from('todos')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1);

  const nextOrder =
    maxOrderData && maxOrderData.length > 0
      ? maxOrderData[0].display_order + 1
      : 0;

  const { data, error } = await supabase
    .from('todos')
    .insert({
      text: input.text,
      priority: input.priority || 'medium',
      display_order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create todo: ${error.message}`);
  }

  return rowToTodo(data as TodoRow);
}

// 更新
export async function updateTodo(
  id: string,
  input: UpdateTodoInput
): Promise<Todo> {
  const updateData: Record<string, unknown> = {};

  if (input.text !== undefined) updateData.text = input.text;
  if (input.completed !== undefined) updateData.completed = input.completed;
  if (input.priority !== undefined) updateData.priority = input.priority;
  if (input.display_order !== undefined)
    updateData.display_order = input.display_order;

  const { data, error } = await supabase
    .from('todos')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update todo: ${error.message}`);
  }

  return rowToTodo(data as TodoRow);
}

// 削除
export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase.from('todos').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete todo: ${error.message}`);
  }
}

// 完了状態をトグル
export async function toggleTodo(id: string): Promise<Todo> {
  // 現在の状態を取得
  const { data: currentData, error: fetchError } = await supabase
    .from('todos')
    .select('completed')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch todo: ${fetchError.message}`);
  }

  // 反転して更新
  const { data, error } = await supabase
    .from('todos')
    .update({ completed: !currentData.completed })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to toggle todo: ${error.message}`);
  }

  return rowToTodo(data as TodoRow);
}

// 優先順位を更新
export async function updatePriority(
  id: string,
  priority: Priority
): Promise<Todo> {
  return updateTodo(id, { priority });
}

// 順序を変更（ドラッグ&ドロップ用）
export async function reorderTodos(
  draggedId: string,
  targetId: string,
  todos: Todo[]
): Promise<void> {
  // 新しい順序を計算
  const draggedIndex = todos.findIndex((t) => t.id === draggedId);
  const targetIndex = todos.findIndex((t) => t.id === targetId);

  if (draggedIndex === -1 || targetIndex === -1) return;

  const newTodos = [...todos];
  const [draggedTodo] = newTodos.splice(draggedIndex, 1);
  newTodos.splice(targetIndex, 0, draggedTodo);

  // バッチ更新
  const updates = newTodos.map((todo, index) => ({
    id: todo.id,
    display_order: index,
  }));

  // 各TODOのdisplay_orderを更新
  for (const update of updates) {
    const { error } = await supabase
      .from('todos')
      .update({ display_order: update.display_order })
      .eq('id', update.id);

    if (error) {
      throw new Error(`Failed to reorder todos: ${error.message}`);
    }
  }
}

