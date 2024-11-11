export interface BaseItem {
  id: number;
  name: string;
  type: 'note' | 'flashcard';
  isEditing: boolean;
}

export interface Note extends BaseItem {
  type: 'note';
  title: string; // Add this line
  content: string;
}

export interface Flashcard extends BaseItem {
  type: 'flashcard';
  items: Array<Note | Flashcard>;
}
