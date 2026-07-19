import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Notfound } from '../../pages/notfound/notfound';

@Component({
  selector: 'app-not-found-layout',
  imports: [Header, Notfound],
  templateUrl: './not-found-layout.html',
})
export class NotFoundLayout {}
