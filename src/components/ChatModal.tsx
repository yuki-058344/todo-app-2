import { useState, useEffect, useRef } from 'react';
import { Todo } from '@/types/todo';
import { useChats } from '@/hooks/useChats';
import styles from '../app/page.module.css';

interface ChatModalProps {
  todo: Todo;
  onClose: () => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return '今日';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨日';
  }
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
  });
}

export function ChatModal({ todo, onClose }: ChatModalProps) {
  const [message, setMessage] = useState('');
  const {
    chats,
    isLoading,
    error,
    fetchChats,
    sendMessage,
  } = useChats(todo.id);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;

    await sendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 日付ごとにグループ化
  let lastDate = '';

  return (
    <div
      className={styles.modalBackdrop}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.chatModal}>
        <div className={styles.chatHeader}>
          <h3 className={styles.chatTitle}>{todo.text}</h3>
          <button
            onClick={onClose}
            className={styles.chatCloseButton}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        <div className={styles.chatMessages}>
          {isLoading ? (
            <p className={styles.chatLoading}>読み込み中...</p>
          ) : error ? (
            <p className={styles.chatError}>{error}</p>
          ) : chats.length === 0 ? (
            <p className={styles.chatEmpty}>
              メッセージがありません。<br />
              最初のメッセージを送信してください。
            </p>
          ) : (
            chats.map((chat) => {
              const dateStr = formatDate(chat.createdAt);
              const showDate = dateStr !== lastDate;
              lastDate = dateStr;

              return (
                <div key={chat.id}>
                  {showDate && (
                    <div className={styles.chatDateDivider}>
                      <span>{dateStr}</span>
                    </div>
                  )}
                  <div className={styles.chatMessage}>
                    <p className={styles.chatMessageText}>{chat.message}</p>
                    <time className={styles.chatMessageTime}>
                      {formatTime(chat.createdAt)}
                    </time>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className={styles.chatInputForm}>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="メッセージを入力..."
            className={styles.chatInput}
          />
          <button
            type="submit"
            className={styles.chatSendButton}
            disabled={message.trim() === ''}
          >
            送信
          </button>
        </form>
      </div>
    </div>
  );
}

