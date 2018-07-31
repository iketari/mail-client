import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { IEmail } from '../../shared/models/email';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class EmailService {
    constructor(private httpClient: HttpClient) { }

    /**
     * getEmais
     */
    public getEmais() {
        return this.httpClient.get<IEmail[]>(`${this._getBaseUrl()}/emails`);
    }

    private _getBaseUrl() {
        return environment.emailServiceUrl;
    }
    
}