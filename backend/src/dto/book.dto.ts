import { BookTypeDTO } from './book-type.dto.js';
import { BookSeriesDTO } from './book-series.dto.js';
import { LendingDTO } from './lending.dto.js';

// boek: titel, auteur, isbn, kleur/zwartwit
export interface BookDTO {
  id?: string;
  title: string;
  author?: string | null;
  isbn?: string | null;
  bookType: BookTypeDTO;
  bookTypeId?: string;
  bookSeries: BookSeriesDTO;
  bookSeriesId?: string | null;
  color: boolean;
  imageUrl?: string | null;
  lendings?: LendingDTO[];
}
