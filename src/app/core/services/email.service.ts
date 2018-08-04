import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { IEmail } from '../../shared/models/message';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IListResult } from '../../shared/models/listresult';
import md5 from 'blueimp-md5';

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
      map((emails) => {
        const items = emails.slice(firstIndex, lastIndex);

        console.log('firstIndex', firstIndex);
        console.log('lastIndex', lastIndex);
        console.log('length', items.length);
        return {
          total: emails.length,
          items
        };
      })
    );
  }

  private _getBaseUrl() {
    return environment.emailServiceUrl;
  }
}
