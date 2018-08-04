export interface IMessage {
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  date: string;
}

export interface IEmail extends IMessage {
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  date: string;
  id?: string;
}
