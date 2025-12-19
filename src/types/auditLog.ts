export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'toggle'
  | 'reorder'
  | 'priority';

export interface AuditLog {
  id: string;
  action: AuditAction;
  targetType: string;
  targetId: string;
  description: string;
  createdAt: Date;
}

export interface AuditLogRow {
  id: string;
  action: AuditAction;
  target_type: string;
  target_id: string;
  description: string;
  created_at: string;
}

export interface CreateAuditLogInput {
  action: AuditAction;
  targetType?: string;
  targetId: string;
  description: string;
}

