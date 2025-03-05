import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class BaseHttpClient {
  constructor(protected http: HttpClient) {}

  protected get<T>(
    url: string,
    params?: any,
    headers?: HttpHeaders,
  ): Observable<T> {
    return this.http.get<T>(url, {
      params,
      headers,
    });
  }

  protected post<T>(
    url: string,
    body: any,
    headers?: HttpHeaders,
  ): Observable<T> {
    return this.http.post<T>(url, body, {
      headers,
    });
  }

  protected put<T>(
    url: string,
    body: any,
    headers?: HttpHeaders,
  ): Observable<T> {
    return this.http.put<T>(url, body, {
      headers,
    });
  }

  protected patch<T>(
    url: string,
    body: any,
    headers?: HttpHeaders,
  ): Observable<T> {
    return this.http.patch<T>(url, body, {
      headers,
    });
  }

  protected delete<T>(
    url: string,
    headers?: HttpHeaders,
  ): Observable<T> {
    return this.http.put<T>(url, {
      headers,
    });
  }
}
