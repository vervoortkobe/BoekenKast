import { Book } from './Book.js';

// uitgeleend: aan wie, wanneer, teruggebracht wanneer?
export interface Lending {
  id: number,
  name: string,
  date: Date,
  returnDate: Date,
  book: Book,
  bookId: number
}
