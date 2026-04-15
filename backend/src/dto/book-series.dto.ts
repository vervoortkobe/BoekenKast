import { Book } from './book.dto.js';

// reeks: rode ridder, suske wiske
export interface BookSeries {
  id?: string;
  name: string;
  books?: Book[];
}
