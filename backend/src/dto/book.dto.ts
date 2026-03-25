import { BookType } from './book-type.dto.js';
import { BookSeries } from './book-series.dto.js';
import { Lending } from './lending.dto.js';

// boek: titel, auteur, isbn, kleur/zwartwit
export interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  bookType: BookType;
  bookTypeId?: number;
  bookSeries: BookSeries;
  bookSeriesId?: number;
  color: boolean;
  lendings?: Lending[];
}
