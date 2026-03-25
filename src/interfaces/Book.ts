import { BookType } from './BookType.js';
import { BookSeries } from './BookSeries.js';
import { Lending } from './Lending.js';

// boek: titel, auteur, isbn, kleur/zwartwit
export interface Book {
  id?: number,
  title: string,
  author: string,
  isbn: string,
  bookType: BookType,
  bookTypeId?: number,
  bookSeries: BookSeries,
  bookSeriesId?: number,
  color: boolean,
  lendings?: Lending[]
}

