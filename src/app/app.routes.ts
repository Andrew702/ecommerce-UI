import { Routes } from '@angular/router';
import { HomeLayout } from './layouts/home-layout/home-layout';
import { NotFoundLayout } from './layouts/not-found-layout/not-found-layout';
import { Signup } from './components/signup/signup';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { ShopLayout } from './layouts/shop-layout/shop-layout';
import { Login } from './components/login/login';
import { TermsOfUse } from './components/terms-of-use/terms-of-use';
import { PrivacyPolicy } from './components/privacy-policy/privacy-policy';
import { ContactUs } from './components/contact-us/contact-us';
import { Support } from './components/support/support';
import { Cart } from './components/cart/cart';
import { LandingPageLayout } from './pages/landing-page-layout/landing-page-layout';
import { Productdetails } from './components/productdetails/productdetails';
import { authguardGuard } from './guards/authguard-guard';
import { CheckoutSuccess } from './pages/checkout-success/checkout-success';
import { Profile } from './components/profile/profile';
import { ProfilePage } from './pages/profile-page/profile-page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: HomeLayout,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: LandingPageLayout,
      },
      {
        path: 'shop',
        component: ShopLayout,
      },
      {
        path: 'shop/:id',
        component: Productdetails,
      },
      {
        path: 'cart',
        canActivate: [authguardGuard],
        component: Cart,
      },
      {
        path: 'profile',
        canActivate: [authguardGuard],
        component: ProfilePage,
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'signup',
        component: Signup,
      },
    ],
  },
  {
    path: 'termsofuse',
    component: TermsOfUse,
  },
  {
    path: 'privacypolicy',
    component: PrivacyPolicy,
  },
  {
    path: 'contactus',
    component: ContactUs,
  },
  {
    path: 'support',
    component: Support,
  },
  {
    path: 'checkout/success',
    component: CheckoutSuccess,
  },
  {
    path: '**',
    component: NotFoundLayout,
  },
];
