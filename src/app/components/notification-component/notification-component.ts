import { Component, OnInit, OnDestroy, Signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Notification } from '../../Models/Notification';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notification-component.html',
  styleUrl: './notification-component.css',
})
export class NotificationComponent {
  // We expose the signal directly from the service.
  // The template will call notifications() to read the current value,
  // and Angular will automatically re-render when the signal changes.
  // No ngOnInit, no ngOnDestroy, no subscription to manage.
  readonly notifications: Signal<Notification[]>;

  // Angular injects the service automatically because it's provided in 'root'.
  constructor(private notificationService: NotificationService) {
    this.notifications = this.notificationService.notifications;
  }

  /** Called when the user clicks the dismiss button on a notification */
  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  /**
   * trackBy tells Angular how to identify each item in the list.
   * Without it, Angular re-renders the entire list on every change.
   * With it, Angular only updates the items that actually changed.
   */
  trackById(_index: number, notification: Notification): string {
    return notification.id;
  }
}
