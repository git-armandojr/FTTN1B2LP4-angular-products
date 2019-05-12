import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Product } from './product';
// import { PRODUCTS } from './mock-products';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({ providedIn: 'root' })
export class ProductService {

  private productsUrl = 'http://localhost:3000/products';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET products from the server */
  getProducts (): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(_ => this.log('fetched products')),
        catchError(this.handleError<Product[]>('getProducts', []))
      );
  }

  /** GET product by id. Return `undefined` when id not found */
  getProductNo404<Data>(id: string): Observable<Product> {
    const url = `${this.productsUrl}/?id=${id}`;
    return this.http.get<Product[]>(url)
      .pipe(
        map(products => products[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} product id=${id}`);
        }),
        catchError(this.handleError<Product>(`getProduct id=${id}`))
      );
  }

  /** GET product by id. Will 404 if id not found */
  getProduct(id: string): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      tap(_ => this.log(`fetched product id=${id}`)),
      catchError(this.handleError<Product>(`getProduct id=${id}`))
    );
  }

  /* GET products whose type contains search term */
  searchProducts(term: string): Observable<Product[]> {
    if (!term.trim()) {
      // if not search term, return empty product array.
      return of([]);
    }
    return this.http.get<Product[]>(`${this.productsUrl}/?type=${term}`).pipe(
      tap(_ => this.log(`found productes matching "${term}"`)),
      catchError(this.handleError<Product[]>('searchProducts', []))
    );
  }

  //////// Save methods //////////
 
  /** POST: add a new product to the server */
  addProduct (product: Product): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, product, httpOptions).pipe(
      tap((newProduct: Product) => this.log(`added product id=${newProduct._id}`)),
      catchError(this.handleError<Product>('addProduct'))
    );
  }

  /** DELETE: delete the product from the server */
  deleteProduct (product: Product | string): Observable<Product> {
    const id = typeof product === 'string' ? product : product._id;
    const url = `${this.productsUrl}/${id}`;
 
    return this.http.delete<Product>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted product id=${id}`)),
      catchError(this.handleError<Product>('deleteProduct'))
    );
  }

  /** PUT: update the product on the server */
  updateProduct (product: Product | string): Observable<Product> {
    const id = typeof product === 'string' ? product : product._id;
    const url = `${this.productsUrl}/${id}`;

    return this.http.put(url, product, httpOptions).pipe(
      tap(_ => this.log(`updated product id=${id}`)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - type of the operation that failed
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

  /** Log a ProductService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ProductService: ${message}`);
  }

  // Sem Observable
  // getProducts(): Product[] {
  //   return PRODUCTS;
  // }

  // // Com Observable
  // getProducts(): Observable<Product[]> {
  //   this.messageService.add('ProductService: produtos carregados');
  //   return of(PRODUCTS);
  // }

  // getProduct(id: string): Observable<Product> {
  //   this.messageService.add(`ProductService: produto carregado id=${id}`);
  //   return of(PRODUCTS.find(product => product.id === id));
  // }
}
