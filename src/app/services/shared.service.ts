import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {

  //odabrani item koji se prikazuje na sidebaru sa tamnom pozadinom
  private selectedItemSubject = new BehaviorSubject<number>(0);
  selectedItem$ = this.selectedItemSubject.asObservable();

  updateSelectedItem(itemId: number): void {
    this.selectedItemSubject.next(itemId);
  }
}
