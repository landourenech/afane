export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content?: string;
  link?: string;
  read: boolean;
  created_at: string;
}
