import { Component } from '@angular/core';
import { Profile } from '../../components/profile/profile';
import { OrderHistory } from '../../components/order-history/order-history';

@Component({
  selector: 'app-profile-page',
  imports: [Profile, OrderHistory],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {}
