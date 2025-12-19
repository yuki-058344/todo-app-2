import { supabase } from '../supabase';
import {
  AuditLog,
  AuditLogRow,
  CreateAuditLogInput,
} from '@/types/auditLog';

// データベース行をAuditLog型に変換
function rowToAuditLog(row: AuditLogRow): AuditLog {
  return {
    id: row.id,
    action: row.action,
    targetType: row.target_type,
    targetId: row.target_id,
    description: row.description,
    createdAt: new Date(row.created_at),
  };
}

// 最新の監査ログを取得（デフォルト30件）
export async function fetchAuditLogs(limit: number = 30): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch audit logs: ${error.message}`);
  }

  return (data as AuditLogRow[]).map(rowToAuditLog);
}

// 監査ログを作成
export async function createAuditLog(input: CreateAuditLogInput): Promise<AuditLog> {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert({
      action: input.action,
      target_type: input.targetType || 'todo',
      target_id: input.targetId,
      description: input.description,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create audit log: ${error.message}`);
  }

  return rowToAuditLog(data as AuditLogRow);
}

// 特定のターゲットに関連する監査ログを取得
export async function fetchAuditLogsByTarget(
  targetId: string,
  limit: number = 30
): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('target_id', targetId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch audit logs: ${error.message}`);
  }

  return (data as AuditLogRow[]).map(rowToAuditLog);
}

