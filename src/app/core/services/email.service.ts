import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { IEmail } from '../../shared/models/email';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IListResult } from '../../shared/models/listresult';

@Injectable()
export class EmailService {
    constructor(private httpClient: HttpClient) { }

    /**
     * Get all emails from the server side
     */
    public getEmais(limit = 1, offset = 0) {
        return this.httpClient.get<IEmail[]>(`${this._getBaseUrl()}/${environment.emailsPath}`);
    }

    /**
     * Get paginated results
     */
    public getPaginatedEmails(page: number = 1, limit: number = 10): Observable<IListResult<IEmail>> {
        const firstIndex = (page - 1) * limit;
        const lastIndex = limit * page + 1;

        return this.getEmais().pipe(
            map(emails => ({
                total: emails.length,
                items: emails.slice(firstIndex, lastIndex)
            }))
        );
    }

    private _getBaseUrl() {
        return environment.emailServiceUrl;
    }
    
}