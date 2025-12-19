import { useState, useEffect, useCallback } from 'react';
import { AuditLog } from '@/types/auditLog';
import { fetchAuditLogs } from '@/lib/api/auditLogs';
import styles from '../app/page.module.css';

const actionLabels: Record<string, string> = {
  create: '作成',
  update: '更新',
  delete: '削除',
  toggle: '状態変更',
  reorder: '並び替え',
  priority: '優先順位',
};

const actionColors: Record<string, string> = {
  create: 'actionCreate',
  update: 'actionUpdate',
  delete: 'actionDelete',
  toggle: 'actionToggle',
  reorder: 'actionReorder',
  priority: 'actionPriority',
};

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'たった今';
  if (minutes < 60) return `${minutes}分前`;
  if (hours < 24) return `${hours}時間前`;
  if (days < 7) return `${days}日前`;

  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AuditLogSidebar() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAuditLogs(30);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
    // 30秒ごとに自動更新
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, [loadLogs]);

  return (
    <aside className={styles.auditSidebar}>
      <div className={styles.auditHeader}>
        <h2 className={styles.auditTitle}>操作ログ</h2>
        <button
          onClick={loadLogs}
          className={styles.refreshButton}
          aria-label="更新"
          disabled={isLoading}
        >
          ↻
        </button>
      </div>

      {error && <p className={styles.auditError}>{error}</p>}

      {isLoading && logs.length === 0 ? (
        <p className={styles.auditLoading}>読み込み中...</p>
      ) : logs.length === 0 ? (
        <p className={styles.auditEmpty}>ログがありません</p>
      ) : (
        <ul className={styles.auditList}>
          {logs.map((log) => (
            <li key={log.id} className={styles.auditItem}>
              <span
                className={`${styles.auditAction} ${styles[actionColors[log.action]] || ''}`}
              >
                {actionLabels[log.action] || log.action}
              </span>
              <p className={styles.auditDescription}>{log.description}</p>
              <time className={styles.auditTime}>{formatTime(log.createdAt)}</time>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

