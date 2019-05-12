import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { PRODUCTS } from '../mock-products';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[];
  selectedProduct: Product;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getProducts();
  }

  onSelect(product: Product): void {
    this.selectedProduct = product;
  }

  // Sem Observable
  // getProducts(): void {
  //   this.products = this.productService.getProducts();
  // }

  getProducts(): void {
    this.productService.getProducts().subscribe(products => this.products = products);
  }

}
