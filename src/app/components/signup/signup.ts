import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Authservice } from '../../services/authservice';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-signup',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './signup.html',
})
export class Signup {
  authService = inject(Authservice);
  router = inject(Router);
  notify = inject(NotificationService);

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)/),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.signupForm.controls;
  }

  onSignup() {
    if (this.signupForm.invalid) return;

    const data = this.signupForm.value;

    if (data.password !== data.confirmPassword) {
      this.notify.error('Passwords do not match');
      return;
    }

    this.authService.register({
      userName: data.name!,
      email: data.email!,
      phone: data.phone!,
      password: data.password!,
    }).subscribe({
      next: () => {
        this.notify.success('Account created! Please log in.', 3000);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        const msg = err?.error?.detail || 'Registration failed. Email may already be in use.';
        this.notify.error(msg);
      },
    });
  }
}
