import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { ShopMainContent } from '../../components/shop-main-content/shop-main-content';

@Component({
  selector: 'app-shop-layout',
  imports: [Sidebar, ShopMainContent],
  templateUrl: './shop-layout.html',
})
export class ShopLayout {}
