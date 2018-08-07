import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, filter, find } from 'rxjs/operators';
import { IEmail, IThread } from '../../shared/models/message';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IListResult } from '../../shared/models/listresult';
import md5 from 'blueimp-md5';
import {
  ISearchQuery,
  ISearchResult,
  ISearchResponse,
  IParticipant,
  IThreadSearchResult
} from '../../shared/models/search';
import { until } from 'protractor';

const MAX_DATE = new Date(8640000000000000);
const MIN_DATE = new Date(-8640000000000000);

const THREAD_SUBJECT_RE = /(RE|FW):\s/;

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

  // /**
  //  * Get search results
  //  */
  // public search(
  //   params: ISearchQuery,
  //   page: number = 1,
  //   limit: number = 10
  // ): Observable<ISearchResponse<IEmail>> {
  //   const source: Observable<ISearchResult<IEmail>[]> = this.getEmails().pipe(
  //     map(this.convertToResults<IEmail>()),
  //     map(this.filterByFrom<IEmail>(params)),
  //     map(this.filterByTo<IEmail>(params)),
  //     map(this.filterByDate<IEmail>(params)),
  //     map(this.filterByQuery<IEmail>(params))
  //   );

  //   return this.getPaginatedSearchResults(source, params, page, limit);
  // }

  /**
   * Get search results
   */
  public searchThreads(
    params: ISearchQuery,
    page: number = 1,
    limit: number = 10
  ): Observable<ISearchResponse<IEmail>> {
    const source = this.getEmails().pipe(
      map(this.groupToThreads()),
      map(this.convertToResults<IEmail>())
      // map(this.filterByFrom<IEmail>(params)),
    );

    return this.getPaginatedSearchResults(source, params, page, limit);
  }

  private getPaginatedSearchResults<T extends IEmail>(
    source: Observable<IThreadSearchResult<T>[]>,
    context: ISearchQuery,
    page: number = 1,
    limit: number = 10
  ): Observable<ISearchResponse<T>> {
    const firstIndex = (page - 1) * limit;
    const lastIndex = limit * page;

    return source.pipe(
      map((results) => ({
        page,
        limit,
        context,
        total: results.length,
        items: results.slice(firstIndex, lastIndex),
        participants: this.extractParticipants<IEmail>(results)
      }))
    );
  }

  private extractParticipants<T extends IEmail>(threads: IThread<T>[]): IParticipant[] {
    const temp: Map<string, IParticipant> = new Map();

    function getParticipant(address: string): IParticipant {
      const id = md5(address);
      return {
        id,
        email: address,
        to: [],
        toEntities: {}
      };
    }

    function performMessage(message: T) {
      // create all participants
      let fromParticipant = getParticipant(message.from);
      const fromParticipantId = fromParticipant.id;
      if (!temp.has(fromParticipantId)) {
        temp.set(fromParticipantId, fromParticipant);
      }
      fromParticipant = temp.get(fromParticipantId);

      message.to.map((toEmail) => {
        const toParticipant = getParticipant(toEmail);
        const toParticipantId = toParticipant.id;

        if (!fromParticipant.toEntities[toParticipantId]) {
          fromParticipant.toEntities[toParticipantId] = toParticipant;
          fromParticipant.to.push(toParticipant);
        }
      });
    }

    threads.forEach((thread) => {
      thread.messages.forEach(performMessage);
    });

    return Array.from(temp.values());
  }

  private groupToThreads<T extends IEmail>(): (value: T[]) => IThread<T>[] {
    return (messages: T[]): IThread<T>[] => {
      const threadsMap: Map<string, IThread<T>> = new Map();

      messages.forEach((message: T) => {
        const threadSubject = message.subject.replace(THREAD_SUBJECT_RE, '');
        const threadParticipants = [message.from, ...message.to];
        const threadId = md5(threadSubject + threadParticipants);

        if (!threadsMap.has(threadId)) {
          threadsMap.set(threadId, {
            id: threadId,
            messages: [message],
            subject: threadSubject,
            participants: threadParticipants
          } as IThread<T>);
        } else {
          threadsMap.get(threadId).messages.push(message);
        }
      });

      return Array.from(threadsMap.values());
    };
  }

  private convertToResults<T extends IEmail>(): (value: IThread<T>[]) => IThreadSearchResult<T>[] {
    return (originalThreads: IThread<T>[]): IThreadSearchResult<T>[] => {
      return originalThreads.map<IThreadSearchResult<T>>(
        (originalThread: IThread<T>) =>
          ({
            ...originalThread,
            performedMessages: originalThread.messages.map<ISearchResult<T>>((originalItem: T) => ({
              originalItem,
              filteredBy: {},
              highlights: {}
            })),
            highlights: {}
          } as IThreadSearchResult<T>)
      );
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
      if (!params.to || params.to.length === 0) {
        return itemsToFilter;
      }

      return itemsToFilter.filter((item) => {
        if (item.originalItem.to.find((value) => -1 !== params.to.indexOf(value))) {
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
