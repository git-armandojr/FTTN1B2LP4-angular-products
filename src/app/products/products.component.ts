import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { PRODUCTS } from '../mock-products';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products = PRODUCTS;
  selectedProduct: Product;

  constructor() { }

  ngOnInit() {
  }

  onSelect(product: Product): void {
    this.selectedProduct = product;
  }

}
