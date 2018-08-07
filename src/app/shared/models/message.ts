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

export interface IThread {
  messages: IEmail[];
  subject: string;
  participants: string[];
  id: string;
}
