import { supabase } from '../supabase';
import { Chat, ChatRow, CreateChatInput } from '@/types/chat';
import { createAuditLog } from './auditLogs';

// データベース行をChat型に変換
function rowToChat(row: ChatRow): Chat {
  return {
    id: row.id,
    todoId: row.todo_id,
    message: row.message,
    createdAt: new Date(row.created_at),
  };
}

// 特定のTODOに紐づくチャットを取得
export async function fetchChatsByTodoId(todoId: string): Promise<Chat[]> {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('todo_id', todoId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch chats: ${error.message}`);
  }

  return (data as ChatRow[]).map(rowToChat);
}

// チャットメッセージを作成
export async function createChat(input: CreateChatInput): Promise<Chat> {
  // TODOのテキストを取得（監査ログ用）
  const { data: todoData } = await supabase
    .from('todos')
    .select('text')
    .eq('id', input.todoId)
    .single();

  const todoText = todoData?.text || '不明';

  const { data, error } = await supabase
    .from('chats')
    .insert({
      todo_id: input.todoId,
      message: input.message,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create chat: ${error.message}`);
  }

  const chat = rowToChat(data as ChatRow);

  // 監査ログを記録
  await createAuditLog({
    action: 'create',
    targetType: 'chat',
    targetId: chat.id,
    description: `チャットメッセージを送信: "${input.message}" (TODO: "${todoText}")`,
  });

  return chat;
}

// チャットメッセージを削除
export async function deleteChat(id: string): Promise<void> {
  // 削除前にチャット情報を取得（監査ログ用）
  const { data: chatData } = await supabase
    .from('chats')
    .select('message, todo_id')
    .eq('id', id)
    .single();

  const { data: todoData } = chatData
    ? await supabase
        .from('todos')
        .select('text')
        .eq('id', chatData.todo_id)
        .single()
    : { data: null };

  const message = chatData?.message || '不明';
  const todoText = todoData?.text || '不明';

  const { error } = await supabase.from('chats').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete chat: ${error.message}`);
  }

  // 監査ログを記録
  await createAuditLog({
    action: 'delete',
    targetType: 'chat',
    targetId: id,
    description: `チャットメッセージを削除: "${message}" (TODO: "${todoText}")`,
  });
}

// 特定のTODOに紐づくチャット数を取得
export async function getChatCountByTodoId(todoId: string): Promise<number> {
  const { count, error } = await supabase
    .from('chats')
    .select('*', { count: 'exact', head: true })
    .eq('todo_id', todoId);

  if (error) {
    throw new Error(`Failed to get chat count: ${error.message}`);
  }

  return count || 0;
}

