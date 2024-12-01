import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { Board } from '../../models/board.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() boards: Board[] = []; // prihvaca boarde sa app component

  @Output() refreshBoards = new EventEmitter<void>(); //salje okidac za funkciju getBoards da se refresha stanje na sidebaru
  showInputField = false;
  newBoardName = '';
  currentSelection: number | null = null;
  private apiUrl = 'http://localhost:8080/boards';

  http = inject(HttpClient);
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    //prihvaca odabrani item i postavlja ga na sideboard
    this.sharedService.selectedItem$.subscribe((selectedId) => {
      this.currentSelection = selectedId;
    });
  }

  onSelect(itemId: number): void {
    //pozivanje funkcije za promjenu itema na sidebaru
    this.sharedService.updateSelectedItem(itemId);
  }

  //otvara input za dodavanje novog boarda
  toggleInputField() {
    this.showInputField = !this.showInputField;
    this.newBoardName = '';
  }

  //spremanje boarda na bazu
  saveBoard() {
    if (this.newBoardName.trim()) {

      //pravi novu instancu boarda bez id i tasklists, id je auto increment a tasklists ce biti inicijalno prazan
      const newBoard: Omit<Board, 'id' | 'taskLists'> = {
        name: this.newBoardName,
      };

      this.http.post<Board>(this.apiUrl, newBoard).subscribe(
        (createdBoard) => {
          this.newBoardName = '';
          this.showInputField = false;
          console.log('New board saved:', createdBoard);
          //refreshanje boarda na side baru
          this.refreshBoards.emit();
        },
        (error) => {
          console.error('Error creating board:', error);
          alert('Failed to create board. Please try again.');
        }
      );
    } else {
      alert('Board name cannot be empty!');
    }
  }
}
