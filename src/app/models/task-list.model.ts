import { Card } from './cards.model';

export interface TaskList {
  id: number;
  name: string;
  boardId: number;
  position: number;
  cards: Card[];
}
