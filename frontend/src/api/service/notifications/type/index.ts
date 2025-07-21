export interface NotificationType {
  id: number;
  type?: "danger" | "warning" | "success" | "info";
  title?: string;
  content?: string;
  is_read?: boolean;
  read_at?: string;
  created_at?: string;
  user?: number;
}

export interface NotificationUpdate {
  is_read: boolean;
}
