import { IListResult } from './listresult';
import { IThread } from './message';

export interface ISearchQuery {
  date_from: Date;
  date_to: Date;
  query: string;
  from: string;
  to: string[];
}

export interface ISearchResult<T> {
  originalItem: T;
  filteredBy: {
    [field: string]: boolean;
  };
  highlights: {
    [field: string]: THighlightRange[];
  };
}

export interface IThreadSearchResult<T> extends IThread<T> {
  performedMessages: ISearchResult<T>[];
  highlights: {
    [field: string]: THighlightRange[];
  };
}

export interface ISearchResponse<T> {
  items: IThreadSearchResult<T>[];
  page: number;
  limit: number;
  total: number;
  context: ISearchQuery;
  participants: IParticipant[];
}

export type THighlightRange = [number, number];

export interface IParticipant {
  id?: string;
  email: string;
  to: IParticipant[];
  toEntities: {
    [key: string]: IParticipant;
  };
}
