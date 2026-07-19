import { Component, inject } from '@angular/core';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  authService = inject(Authservice);
  currentUser = this.authService.currentUser;
}
