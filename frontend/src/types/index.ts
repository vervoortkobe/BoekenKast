export interface BookTypeDTO {
  id?: string;
  name: string;
  books?: BookDTO[];
}

export interface BookSeriesDTO {
  id?: string;
  name: string;
  defaultAuthor?: string;
  defaultBookTypeId?: string;
  books?: BookDTO[];
}

export interface LendingDTO {
  id?: string;
  name: string;
  date: string | Date;
  returnDate: string | Date;
  returnedAt?: string | Date | null;
  book?: BookDTO;
  bookId?: string;
}

export interface BookDTO {
  id?: string;
  title: string;
  author?: string | null;
  isbn?: string | null;
  bookType?: BookTypeDTO;
  bookTypeId?: string;
  bookSeries?: BookSeriesDTO;
  bookSeriesId?: string | null;
  color: boolean;
  imageUrl?: string | null;
  lendings?: LendingDTO[];
}
