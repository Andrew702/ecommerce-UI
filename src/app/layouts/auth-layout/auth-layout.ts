import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [Header, RouterOutlet],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
