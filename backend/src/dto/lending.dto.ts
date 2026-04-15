import { BookDTO } from './book.dto.js';

// uitgeleend: aan wie, wanneer, teruggebracht wanneer?
export interface LendingDTO {
  id?: string;
  name: string;
  date: Date;
  returnDate: Date;
  book: BookDTO;
  bookId?: string;
}
