import { Component } from '@angular/core';
import { Carousel } from '../../components/carousel/carousel';
import { Categoriesgrid } from '../../components/categoriesgrid/categoriesgrid';
import { Offersbar } from '../../components/offersbar/offersbar';
import { Offerstrip } from '../../components/offerstrip/offerstrip';
import { ChatBot } from '../../components/chat-bot/chat-bot';

@Component({
  selector: 'app-landing-page-layout',
  imports: [Carousel, Categoriesgrid, Offersbar, Offerstrip, ChatBot],
  templateUrl: './landing-page-layout.html',
})
export class LandingPageLayout {}
