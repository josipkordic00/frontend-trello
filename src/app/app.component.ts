import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './components/content/content.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HttpClient } from '@angular/common/http';
import { Board } from './models/board.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ContentComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'trellofront';
  boards: Board[] = [];  //prosljeđuje se u children komponente

  private apiUrl = 'http://localhost:8080/boards';
  http = inject(HttpClient);

  ngOnInit(): void {
    this.getBoards();
  }


  //inicijalni get request za prikaz svih boardova u sidebaru
  getBoards() {
    this.http.get<Board[]>(this.apiUrl).subscribe(
      (data: Board[]) => {
        this.boards = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
