import { useState, useCallback } from 'react';
import { Chat } from '@/types/chat';
import * as chatsApi from '@/lib/api/chats';

export function useChats(todoId: string | null) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    if (!todoId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await chatsApi.fetchChatsByTodoId(todoId);
      setChats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'チャットの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [todoId]);

  const sendMessage = useCallback(async (message: string) => {
    if (!todoId || message.trim() === '') return;

    try {
      setError(null);
      const newChat = await chatsApi.createChat({
        todoId,
        message: message.trim(),
      });
      setChats((prev) => [...prev, newChat]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'メッセージの送信に失敗しました');
    }
  }, [todoId]);

  const deleteMessage = useCallback(async (chatId: string) => {
    try {
      setError(null);
      await chatsApi.deleteChat(chatId);
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'メッセージの削除に失敗しました');
    }
  }, []);

  const clearChats = useCallback(() => {
    setChats([]);
    setError(null);
  }, []);

  return {
    chats,
    isLoading,
    error,
    fetchChats,
    sendMessage,
    deleteMessage,
    clearChats,
  };
}

