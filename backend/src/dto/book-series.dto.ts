import { Book } from './book.dto.js';

// reeks: rode ridder, suske wiske
export interface BookSeries {
  id?: number;
  name: string;
  books?: Book[];
}
