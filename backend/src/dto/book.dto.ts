import { BookTypeDTO } from './book-type.dto.js';
import { BookSeriesDTO } from './book-series.dto.js';
import { LendingDTO } from './lending.dto.js';

// boek: titel, auteur, isbn, kleur/zwartwit
export interface BookDTO {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  bookType: BookTypeDTO;
  bookTypeId?: string;
  bookSeries: BookSeriesDTO;
  bookSeriesId?: string;
  color: boolean;
  imageUrl?: string;
  lendings?: LendingDTO[];
}
