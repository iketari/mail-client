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

export interface IThread<T> {
  messages: T[];
  subject: string;
  participants: string[];
  id: string;
}
