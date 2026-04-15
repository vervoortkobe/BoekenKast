import { BookDTO } from './book.dto.js';

// soort: leesboek, stripboek, encyclopedie
export interface BookTypeDTO {
  id?: string;
  name: string;
  books?: BookDTO[];
}
