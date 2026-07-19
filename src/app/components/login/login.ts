import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Authservice } from '../../services/authservice';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-signin',
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  authService = inject(Authservice);
  router = inject(Router);
  notify = inject(NotificationService);

  user = {
    email: '',
    password: '',
  };

  onLogin(form: any) {
    if (form.invalid) return;

    this.authService.login({
      email: this.user.email,
      password: this.user.password,
    }).subscribe({
      next: (response) => {
        this.authService.handleAuthResponse(response);
        this.router.navigate(['/']);
        this.notify.success('Logged In Successfully', 3000);
      },
      error: () => {
        this.notify.error('Invalid Email or Password');
      },
    });
  }

  goToSignup() {
    this.router.navigate(['/auth/signup']);
  }
}
