import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatBotService {
  private apiUrl = 'http://localhost:4242/api/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, products: any[]) {
    return this.http.post<any>(this.apiUrl, {
      message: message,
      products: products
    });
  }
}
