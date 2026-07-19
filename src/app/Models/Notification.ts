export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  /**
   * Optional: how long (in ms) before the notification auto-dismisses.
   * If not provided, the notification stays until manually dismissed.
   */
  autoDismissMs?: number;
}
