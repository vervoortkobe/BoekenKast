import { Book } from './book.dto.js';

// soort: leesboek, stripboek, encyclopedie
export interface BookType {
  id?: number;
  name: string;
  books?: Book[];
}
