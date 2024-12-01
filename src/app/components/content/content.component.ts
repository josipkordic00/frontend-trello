import { Component, Input, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListComponent } from '../list/list.component';
import { SharedService } from '../../services/shared.service';
import { HttpClient } from '@angular/common/http';
import { TaskList } from '../../models/task-list.model';
import { Board } from '../../models/board.model';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [ListComponent, CommonModule, FormsModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent implements OnInit {
  @Input() boards: Board[] = [];
  showInputField = false;
  showAddButton = true;
  newListName = '';
  boardId = 0;
  taskLists: TaskList[] = [];

  receivedData!: boolean;

  http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/tasklists/board';
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    //id od odabanog itema na sidebar component je potreban
    //za prikaz i spremanje njegovih podataka na content component
    this.sharedService.selectedItem$.subscribe((itemId) => {
      this.boardId = itemId;
      this.loadBoardData(itemId);
    });
  }

  toggleInputField() {
    this.showInputField = !this.showInputField;
    this.newListName = '';
  }

  //spremanje liste u board
  saveList() {
    if (this.newListName.trim()) {
      const newTaskList: Omit<TaskList, 'id' | 'cards'> = {
        name: this.newListName,
        boardId: this.boardId,
        position: this.taskLists.length + 1,
      };

      this.http.post<TaskList>(this.apiUrl, newTaskList).subscribe(
        () => {
          this.newListName = '';
          this.showInputField = false;
          
          //pozivanje funkcije za refresh
          this.loadBoardData(this.boardId);
        },
        (error) => {
          console.error('Error creating board:', error);
          alert('Failed to create board. Please try again.');
        }
      );
    } else {
      alert('TaskList name cannot be empty!');
    }
  }


  //funkcija za refreshanje taskliste unutar boarda nakon post requesta
  loadBoardData(boardId: number) {
    const apiUrl = `http://localhost:8080/tasklists/board/${boardId}`;
    this.http.get<TaskList[]>(apiUrl).subscribe(
      (data: TaskList[]) => {
        this.taskLists = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
