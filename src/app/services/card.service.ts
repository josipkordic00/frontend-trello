import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../models/cards.model';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private apiUrl = 'http://your-backend-api-url/cards';

  constructor(private http: HttpClient) {}

  updateCard(card: Card): Observable<Card> {
    const url = `${this.apiUrl}/${card.id}`;
    return this.http.put<Card>(url, card);
  }

  // Optionally, a method to update the card's position
  // updateCardPosition(card: Card): Observable<Card> {
  //   const url = `${this.apiUrl}/${card.id}/position`;
  //   return this.http.put<Card>(url, { position: card.position });
  // }
}
