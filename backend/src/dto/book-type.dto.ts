import { Book } from './book.dto.js';

// soort: leesboek, stripboek, encyclopedie
export interface BookType {
  id?: string;
  name: string;
  books?: Book[];
}
