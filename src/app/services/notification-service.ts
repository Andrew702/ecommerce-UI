import { Injectable, signal, Signal } from '@angular/core';
import { Notification, NotificationType } from '../Models/Notification';

@Injectable({
  // 'root' means one single shared instance across the whole app (singleton).
  // Any component or service that injects this will talk to the same list.
  providedIn: 'root',
})
export class NotificationService {
  // signal() holds the current list.
  // When its value changes, Angular automatically updates any template that reads it —
  // no subscriptions or manual change detection needed.
  // Private so only this service can write to it.
  private _notifications = signal<Notification[]>([]);

  // The public read-only signal exposed to components.
  // .asReadonly() prevents external code from calling .set() on it directly —
  // same idea as exposing an Observable instead of a Subject.
  readonly notifications: Signal<Notification[]> = this._notifications.asReadonly();

  /**
   * Add a new notification.
   * Returns the generated ID in case the caller needs to dismiss it manually later.
   */
  show(type: NotificationType, message: string, autoDismissMs?: number): string {
    const id = this.generateId();
    const notification: Notification = { id, type, message, autoDismissMs };

    // update() is the signal method for deriving the next value from the current one.
    // We spread the existing array to keep immutability — same principle as before,
    // just expressed through the signal API instead of BehaviorSubject.next().
    this._notifications.update((current) => [...current, notification]);

    if (autoDismissMs) {
      setTimeout(() => this.dismiss(id), autoDismissMs);
    }

    return id;
  }

  /** Convenience methods so callers don't have to pass the type string manually */
  success(message: string, autoDismissMs?: number): string {
    return this.show('success', message, autoDismissMs);
  }

  error(message: string, autoDismissMs?: number): string {
    return this.show('error', message, autoDismissMs);
  }

  warning(message: string, autoDismissMs?: number): string {
    return this.show('warning', message, autoDismissMs);
  }

  info(message: string, autoDismissMs?: number): string {
    return this.show('info', message, autoDismissMs);
  }

  /** Remove a specific notification by its ID */
  dismiss(id: string): void {
    this._notifications.update((current) => current.filter((n) => n.id !== id));
  }

  /** Remove all notifications at once */
  dismissAll(): void {
    this._notifications.set([]);
  }

  /** Generates a simple unique ID. No external library needed for this. */
  private generateId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }
}
