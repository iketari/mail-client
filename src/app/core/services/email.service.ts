import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, filter, find } from 'rxjs/operators';
import { IEmail } from '../../shared/models/message';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IListResult } from '../../shared/models/listresult';
import md5 from 'blueimp-md5';
import { ISearchQuery, ISearchResult } from '../../shared/models/search';
import { until } from 'protractor';

const MAX_DATE = new Date(8640000000000000);
const MIN_DATE = new Date(-8640000000000000);

@Injectable()
export class EmailService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get all emails from the server side
   */
  public getEmails(): Observable<IEmail[]> {
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
   * Get all an email from the server side
   */
  public getEmail(id: string): Observable<IEmail> {
    return this.getEmails().pipe(
      map((emails: IEmail[]) => emails.find((email: IEmail) => email.id === id))
    );
  }

  /**
   * Get paginated results
   */
  public getPaginatedEmails(page: number = 1, limit: number = 10): Observable<IListResult<IEmail>> {
    const firstIndex = (page - 1) * limit;
    const lastIndex = limit * page;

    return this.getEmails().pipe(
      map((emails) => ({
        page,
        limit,
        total: emails.length,
        items: emails.slice(firstIndex, lastIndex)
      }))
    );
  }

  /**
   * Get search results
   */
  public search(
    params: Partial<ISearchQuery>,
    page: number = 1,
    limit: number = 10
  ): Observable<IListResult<ISearchResult<IEmail>>> {
    const source = this.getEmails().pipe(
      map(this.covertToResults()),
      map(this.filterByFrom<IEmail>(params)),
      map(this.filterByTo<IEmail>(params)),
      map(this.filterByDate<IEmail>(params)),
      map(this.filterByQuery<IEmail>(params))
    );

    return this.getPaginatedSearchResults<ISearchResult<IEmail>>(source, page, limit);
  }

  private getPaginatedSearchResults<T>(
    source: Observable<T[]>,
    page: number = 1,
    limit: number = 10
  ): Observable<IListResult<T>> {
    const firstIndex = (page - 1) * limit;
    const lastIndex = limit * page;

    return source.pipe(
      map((results) => ({
        page,
        limit,
        total: results.length,
        items: results.slice(firstIndex, lastIndex)
      }))
    );
  }

  private covertToResults<T extends IEmail>(): (value: T[]) => ISearchResult<T>[] {
    return (originalItems: T[]) => {
      return originalItems.map<ISearchResult<T>>((originalItem) => ({
        originalItem,
        highlights: {},
        filteredBy: {}
      }));
    };
  }

  private filterByDate<T extends IEmail>(
    params: Partial<ISearchQuery>
  ): (value: ISearchResult<T>[]) => ISearchResult<T>[] {
    const date_to = params.date_to || MAX_DATE;
    const date_from = params.date_from || MIN_DATE;

    return (itemsToFilter = []) => {
      if (!params.date_from && !params.date_to) {
        return itemsToFilter;
      }

      return itemsToFilter.filter((item) => {
        const { date } = item.originalItem;
        if (date >= date_from && date <= date_to) {
          item.filteredBy['date'] = true;
          return true;
        }
      });
    };
  }

  private filterByTo<T extends IEmail>(
    params: Partial<ISearchQuery>
  ): (value: ISearchResult<T>[]) => ISearchResult<T>[] {
    return (itemsToFilter = []) => {
      if (!params.to) {
        return itemsToFilter;
      }

      return itemsToFilter.filter((item) => {
        if (item.originalItem.to.filter((value) => -1 !== params.to.indexOf(value))) {
          item.filteredBy['to'] = true;
          return true;
        }
      });
    };
  }

  private filterByFrom<T extends IEmail>(
    params: Partial<ISearchQuery>
  ): (value: ISearchResult<T>[]) => ISearchResult<T>[] {
    return (itemsToFilter = []) => {
      if (!params.from) {
        return itemsToFilter;
      }

      return itemsToFilter.filter((item) => {
        if (item.originalItem.from === params.from) {
          item.filteredBy['from'] = true;
          return true;
        }
      });
    };
  }

  private filterByQuery<T extends IEmail>(
    params: Partial<ISearchQuery>
  ): (value: ISearchResult<T>[]) => ISearchResult<T>[] {
    return (itemsToFilter = []) => {
      if (!params.query) {
        return itemsToFilter;
      }

      return itemsToFilter.filter((item) => {
        const subjRes = this.performQueryString<IEmail>(params.query, 'subject', item);
        const bodyRes = this.performQueryString<IEmail>(params.query, 'body', item);

        return subjRes || bodyRes;
      });
    };
  }

  private performQueryString<T>(query: string, field: string, item: ISearchResult<T>): boolean {
    const searchStr = query.toLocaleLowerCase();
    let index = 0;
    let startIndex = 0;
    let str: string = item.originalItem[field];

    while ((index = str.toLocaleLowerCase().indexOf(searchStr, startIndex)) > -1) {
      startIndex = index + searchStr.length;
      item.highlights[field] = item.highlights[field] || [];
      item.highlights[field].push([index, startIndex]);
    }

    return item.highlights[field] != null;
  }

  private _getBaseUrl() {
    return environment.emailServiceUrl;
  }
}
