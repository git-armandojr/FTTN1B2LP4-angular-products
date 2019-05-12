import { Injectable } from '@angular/core';
import { Product } from './product';
import { PRODUCTS } from './mock-products';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  // Sem Observable
  // getProducts(): Product[] {
  //   return PRODUCTS;
  // }

  // Com Observable
  getProducts(): Observable<Product[]> {
    return of(PRODUCTS);
  }
}
