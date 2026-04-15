import { BookType } from './book-type.dto.js';
import { BookSeries } from './book-series.dto.js';
import { Lending } from './lending.dto.js';

// boek: titel, auteur, isbn, kleur/zwartwit
export interface Book {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  bookType: BookType;
  bookTypeId?: string;
  bookSeries: BookSeries;
  bookSeriesId?: string;
  color: boolean;
  lendings?: Lending[];
}
