import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question, AnswerPayload, ApiResponse } from '../models/types';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GoogleSheetsService {
    private http = inject(HttpClient);
    private apiUrl = environment.gasApiUrl;

    getQuestions(): Observable<Question[]> {
        return this.http.get<Question[]>(this.apiUrl);
    }

    submitAnswers(data: AnswerPayload): Observable<ApiResponse> {
        // GAS often requires 'text/plain' or weird encoding to bypass CORS preflight issues effectively,
        // or we just accept opaque response if we use no-cors (fetch).
        // Angular HttpClient enforces standard CORS.
        // If we simply POST JSON, GAS Web App needs to handle options request or we use text/plain.

        // We will try sending as text/plain which usually works for simple GAS endpoints without preflight.
        const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });

        return this.http.post<ApiResponse>(this.apiUrl, JSON.stringify(data), { headers });
    }
}
