export interface IEmail {
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  date: Date;
  id?: string;
}

export interface IEmailSearchResult extends IEmail {
  filteredBy: string[];
  highlights: {
    [field: string]: IHighlightRange[];
  };
}

export type IHighlightRange = Array<[number, number]>;
