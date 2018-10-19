import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { sale } from './sale';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class saleService {

  // private salesUrl = 'api/sales';  // URL to web api
  private salesUrl = 'http://127.0.0.1:3000/sales';
  private addsalesUrl = 'http://127.0.0.1:3000/sales'
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET sales from the server */
  getsales (): Observable<sale[]> {
    return this.http.get<sale[]>(this.salesUrl)
      .pipe(
        tap(sales => this.log('fetched sales')),
        catchError(this.handleError('getsales', []))
      );
  }

  /** GET sale by id. Return `undefined` when id not found */
  getsaleNo404<Data>(id: number): Observable<sale> {
    const url = `${this.salesUrl}/?id=${id}`;
    return this.http.get<sale[]>(url)
      .pipe(
        map(sales => sales[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} sale id=${id}`);
        }),
        catchError(this.handleError<sale>(`getsale id=${id}`))
      );
  }

  /** GET sale by id. Will 404 if id not found */
  getsale(id: number): Observable<sale> {
    const url = `${this.salesUrl}/${id}`;
    return this.http.get<sale>(url).pipe(
      tap(_ => this.log(`fetched sale id=${id}`)),
      catchError(this.handleError<sale>(`getsale id=${id}`))
    );
  }

  /* GET sales whose name contains search term */
  searchsales(term: string): Observable<sale[]> {
    if (!term.trim()) {
      // if not search term, return empty sale array.
      return of([]);
    }
    return this.http.get<sale[]>(`${this.salesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found sales matching "${term}"`)),
      catchError(this.handleError<sale[]>('searchsales', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new sale to the server */
  addsale (sale: sale): Observable<sale> {
    const url = `${this.salesUrl}`;
    return this.http.post<sale>(url, sale, httpOptions).pipe(
      tap((sale: sale) => this.log(`added sale w/ id=${sale.id}`)),
      catchError(this.handleError<sale>('addsale'))
    );
  }

  /** DELETE: delete the sale from the server */
  deletesale (sale: sale | number): Observable<sale> {
    const id = typeof sale === 'number' ? sale : sale.id;
    const url = `${this.salesUrl}/${id}`;

    return this.http.delete<sale>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted sale id=${id}`)),
      catchError(this.handleError<sale>('deletesale'))
    );
  }

  /** PUT: update the sale on the server */
  updatesale (sale: sale): Observable<any> {
    const url = `${this.salesUrl}/${sale.id}`;
    return this.http.patch(url, sale, httpOptions).pipe(
      tap(_ => this.log(`updated sale id=${sale.id}`)),
      catchError(this.handleError<any>('updatesale'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a saleService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`saleService: ${message}`);
  }

  Date 
}
