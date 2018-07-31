export interface IEmail {
    from: string;
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string;
    date: string;
    id?: string;
}