import { Book } from './book.dto.js';

// uitgeleend: aan wie, wanneer, teruggebracht wanneer?
export interface Lending {
  id?: string;
  name: string;
  date: Date;
  returnDate: Date;
  book: Book;
  bookId?: string;
}
