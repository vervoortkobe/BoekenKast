import { BookDTO } from './book.dto.js';

// uitgeleend: aan wie, wanneer, teruggebracht wanneer?
export interface LendingDTO {
  id?: string;
  name: string;
  date: Date | string;
  returnDate: Date | string;
  returnedAt?: Date | string | null;
  book?: BookDTO;
  bookId?: string;
}
