import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskList } from '../../models/task-list.model';

import { Card } from '../../models/cards.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit, OnChanges {
  @Input() taskLists: TaskList[] = [];
  @Input() boardId: number = 0;
  @Output() refreshBoards = new EventEmitter<number>();
  newCardName = '';
  isModalOpen: boolean = false;
  userInput: string = '';
  selectedCard: Card | null = null;
  taskListId = 0;

  activeTaskList: TaskList | null = null;
  activeCard: Card | null = null;

  http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/cards/tasklist/';


  ngOnInit() {
    this.sortTaskListsCards();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskLists']) {
      this.sortTaskListsCards();
    }
  }

  onDeleteCard(event: Event, card: Card) {
    event.stopPropagation();
    console.log('Delete clicked', card);
    this.http.delete(`http://localhost:8080/cards/${card.id}`).subscribe(
      () => {
        this.refreshBoards.emit(this.boardId); // Trigger UI refresh
      },
      (error) => {
        console.error('Error deleting card:', error);
        alert('Failed to delete the card. Please try again.');
      }
    );
  
  }

  onDeleteTaskList(tasklist: TaskList) {
    this.http.delete(`http://localhost:8080/tasklists/${tasklist.id}`).subscribe(
      () => {
        this.refreshBoards.emit(this.boardId); // Trigger UI refresh
      },
      (error) => {
        console.error('Error deleting tasklist:', error);
        alert('Failed to delete the tasklist. Please try again.');
      }
    );
  }

  //sortiranje kartica u listi
  sortTaskListsCards() {
    this.taskLists = this.taskLists.map((taskList) => ({
      ...taskList,
      cards: [...taskList.cards].sort((a, b) => a.position - b.position),
    }));
    console.log('Sorted Task Lists:', this.taskLists);
  }

  //otvaranje inputa i spremanje/brisanje trenutno aktivne liste koja se uređiva
  //kako bi znali koja se tocno lista uređuje
  toggleInputField(taskList: TaskList) {
    this.newCardName = '';
    if (this.activeTaskList === taskList) {
      this.activeTaskList = null;
    } else {
      this.activeTaskList = taskList;
    }
  }
  

  //spremanje kartice u bazu
  saveCard(taskList: TaskList) {
    if (this.newCardName.trim()) {
      const newCard: Omit<Card, 'id' | 'description'> = {
        name: this.newCardName,
        taskListId: taskList.id,
        position: taskList.cards.length + 1,
      };
      this.activeTaskList = null; //resetiranje trenutne liste

      this.http.post<Card>(this.apiUrl, newCard).subscribe(
        () => {
          this.refreshBoards.emit(this.boardId); //UI refresh
        },
        (error) => {
          console.error('Error creating taskList:', error);
          alert('Failed to create taskList. Please try again.');
        }
      );
      this.newCardName = '';
    } else {
      alert('Card name cannot be empty!');
    }
  }

  //spremanje kartice i otvaranje modala
  onCardClick(card: Card) {
    this.selectedCard = card;
    this.isModalOpen = true;
  }

  //zatvaranje modala i resetiranje deskripcije od kartice
  closeModal() {
    this.isModalOpen = false;
    this.userInput = '';
  }

  //spremanje deskripcije od kartice u bazu
  submitInput() {
    if (this.userInput.trim() !== '') {
      const url = `http://localhost:8080/cards/${this.selectedCard?.id}`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      const body = {
        description: this.userInput,
      };

      this.http.put(url, body, { headers }).subscribe({
        next: (response) => {
          console.log('Opis uspješno ažuriran:', response);
          this.refreshBoards.emit(this.boardId); //UI refresh 
          this.sortTaskListsCards();
          this.closeModal();
        },
        error: (error) => {
          console.error('Greška pri ažuriranju opisa:', error);
          alert(
            'Došlo je do greške prilikom spremanja opisa. Pokušajte ponovno.'
          );
        },
      });
    } else {
      alert('Molimo unesite tekst prije spremanja.');
    }
  }
}
