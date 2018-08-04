import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, filter } from 'rxjs/operators';
import { IEmail, IEmailSearchResult } from '../../shared/models/message';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IListResult } from '../../shared/models/listresult';
import md5 from 'blueimp-md5';
import { ISearchQuery } from '../../shared/models/search';

const MAX_DATE = new Date(8640000000000000);
const MIN_DATE = new Date(-8640000000000000);

@Injectable()
export class EmailService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get all emails from the server side
   */
  public getEmais(limit = 1, offset = 0) {
    return this.httpClient.get<IEmail[]>(`${this._getBaseUrl()}/${environment.emailsPath}`).pipe(
      map((emails: IEmail[]) =>
        emails.map((email: IEmail) => ({
          ...email,
          date: new Date(email.date),
          id: md5(JSON.stringify(email))
        }))
      )
    );
  }

  /**
   * Get paginated results
   */
  public getPaginatedEmails(page: number = 1, limit: number = 10): Observable<IListResult<IEmail>> {
    const firstIndex = (page - 1) * limit;
    const lastIndex = limit * page;

    return this.getEmais().pipe(
      map((emails) => ({
        page,
        limit,
        total: emails.length,
        items: emails.slice(firstIndex, lastIndex)
      }))
    );
  }

  /**
   * Get search resulst
   */
  public search(
    params: Partial<ISearchQuery>,
    page: number = 1,
    limit: number = 10
  ): Observable<IListResult<IEmail>> {
    return this.getEmais().pipe(
      map(this.filterByFrom(params)),
      map(this.filterByTo(params)),
      map(this.filterByDate(params))
    );
  }

  private filterByDate(
    params: Partial<ISearchQuery>
  ): (value: IEmail[], index: number) => IEmail[] {
    const date_to = params.date_to || MAX_DATE;
    const date_from = params.date_from || MIN_DATE;

    return (emails: IEmail[] = []) => {
      return emails.filter((email) => {
        const { date } = email;
        return date >= date_from && date <= date_to;
      });
    };
  }

  private filterByTo(params: Partial<ISearchQuery>): (value: IEmail[], index: number) => IEmail[] {
    return (emails: IEmail[] = []) => {
      return emails.filter((email) => email.to.filter((value) => -1 !== params.to.indexOf(value)));
    };
  }

  private filterByFrom(
    params: Partial<ISearchQuery>
  ): (value: IEmail[], index: number) => IEmail[] {
    return (emails: IEmail[] = []) => {
      return emails.filter((email) => email.from === params.from);
    };
  }

  private _getBaseUrl() {
    return environment.emailServiceUrl;
  }
}
