import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IEmail, IThread } from '../../shared/models/message';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import md5 from 'blueimp-md5';
import planer from 'planer';
import {
  ISearchQuery,
  ISearchResult,
  ISearchResponse,
  IParticipant,
  IThreadSearchResult
} from '../../shared/models/search';

const MAX_DATE = new Date(8640000000000000);
const MIN_DATE = new Date(-8640000000000000);

const THREAD_SUBJECT_RE = /(RE|FW|Re|Fw):\s/;

const MESSAGE_QUOTATION_RE = /-{5}Original\ Message-{5}/;

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
   * Get search results
   */
  public searchThreads(
    params: ISearchQuery,
    page: number = 1,
    limit: number = 10
  ): Observable<ISearchResponse<IEmail>> {
    const source = this.getEmails().pipe(
      map(this.extractOriginal<IEmail>()),
      map(this.groupToThreads()),
      map(this.convertToResults<IEmail>()),
      map(this.filterByFrom<IEmail>(params)),
      map(this.filterByTo<IEmail>(params)),
      map(this.filterByDate<IEmail>(params)),
      map(this.filterByQuery<IEmail>(params))
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

  private extractOriginal<T extends IEmail>(): (value: T[]) => T[] {
    return (messages: T[]): T[] => {
      return messages.map<T>((message: T) => {
        message.bodyParts = message.body.split(MESSAGE_QUOTATION_RE);

        return message;
      });
    };
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
        const threadParticipants = [message.from, ...message.to].sort();
        const threadId = threadSubject + threadParticipants.join('|');

        if (!threadsMap.has(threadId)) {
          threadsMap.set(threadId, {
            id: threadId,
            messages: [message],
            subject: threadSubject,
            participants: threadParticipants
          } as IThread<T>);
        } else {
          const messages = threadsMap.get(threadId).messages;
          messages.push(message);
          messages.sort(
            (message1, message2) => +new Date(message1.date) - +new Date(message2.date)
          );
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
              highlights: {
                body: [],
                subject: []
              }
            })),
            highlights: {}
          } as IThreadSearchResult<T>)
      );
    };
  }

  private filterByDate<T extends IEmail>(
    params: Partial<ISearchQuery>
  ): (value: IThreadSearchResult<T>[]) => IThreadSearchResult<T>[] {
    const date_to = params.date_to || MAX_DATE;
    const date_from = params.date_from || MIN_DATE;

    return (threadsToFilter = []) => {
      if (!params.date_from && !params.date_to) {
        return threadsToFilter;
      }

      return threadsToFilter.filter((thread) => {
        let result = false;
        thread.performedMessages.forEach((message) => {
          const { date } = message.originalItem;
          if (date >= date_from && date <= date_to) {
            message.filteredBy['date'] = true;
            result = true;
          }
        });

        return result;
      });
    };
  }

  private filterByTo<T extends IEmail>(
    params: Partial<ISearchQuery>
  ): (value: IThreadSearchResult<T>[]) => IThreadSearchResult<T>[] {
    return (threadsToFilter = []) => {
      if (!params.to || params.to.length === 0) {
        return threadsToFilter;
      }

      return threadsToFilter.filter((thread) => {
        let result = false;
        thread.performedMessages.forEach((message) => {
          if (message.originalItem.to.find((value) => -1 !== params.to.indexOf(value))) {
            message.filteredBy['to'] = true;
            result = true;
          }
        });

        return result;
      });
    };
  }

  private filterByFrom<T extends IEmail>(
    params: Partial<ISearchQuery>
  ): (value: IThreadSearchResult<T>[]) => IThreadSearchResult<T>[] {
    return (threadsToFilter = []) => {
      if (!params.from) {
        return threadsToFilter;
      }

      return threadsToFilter.filter((thread: IThreadSearchResult<T>) => {
        let result = false;
        thread.performedMessages.forEach((message) => {
          if (message.originalItem.from === params.from) {
            message.filteredBy['from'] = true;
            result = true;
          }
        });

        return result;
      });
    };
  }

  private filterByQuery<T extends IEmail>(
    params: Partial<ISearchQuery>
  ): (value: IThreadSearchResult<T>[]) => IThreadSearchResult<T>[] {
    return (threadsToFilter = []) => {
      if (!params.query) {
        return threadsToFilter;
      }

      return threadsToFilter.filter((thread) => {
        const subjRes = this.performQueryString<T>(params.query, 'subject', thread);
        const bodyRes = this.performQueryString<T>(params.query, 'body', thread);

        return subjRes || bodyRes;
      });
    };
  }

  private performQueryString<T>(
    query: string,
    field: string,
    thread: IThreadSearchResult<T>
  ): boolean {
    const searchStr = query.toLocaleLowerCase();
    let result = false;

    thread.performedMessages.forEach((message) => {
      let index = 0;
      let startIndex = 0;
      let str: string = message.originalItem[field];

      while ((index = str.toLocaleLowerCase().indexOf(searchStr, startIndex)) > -1) {
        startIndex = index + searchStr.length;
        message.highlights[field] = message.highlights[field] || [];
        message.highlights[field].push([index, startIndex]);
      }

      if (message.highlights[field].length !== 0) {
        result = true;
      }
    });

    return result;
  }

  private _getBaseUrl() {
    return environment.emailServiceUrl;
  }
}
