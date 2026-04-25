import { BookDTO } from './book.dto.js';

// reeks: rode ridder, suske wiske
export interface BookSeriesDTO {
  id?: string;
  name: string;
  defaultAuthor?: string;
  defaultBookTypeId?: string;
  books?: BookDTO[];
}
