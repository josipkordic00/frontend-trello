// src/app/models/board.model.ts
import { TaskList } from './task-list.model';

export interface Board {
  id: number;
  name: string;
  taskLists: TaskList[];
}
