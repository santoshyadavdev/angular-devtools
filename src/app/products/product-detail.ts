import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductStore } from './product.store';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <section>
      <a routerLink="/products" class="back">&larr; Back to Products</a>

      @if (store.selectedProduct(); as product) {
        <div class="detail">
          <h1>{{ product.name }}</h1>
          <p class="price">{{ product.price | currency }}</p>
          <span class="category">{{ product.category }}</span>
          <span class="stock" [class.out]="!product.inStock">
            {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
          </span>
          <p class="description">{{ product.description }}</p>
          <button (click)="store.toggleStock(product.id)">
            {{ product.inStock ? 'Mark Out of Stock' : 'Mark In Stock' }}
          </button>
        </div>
      } @else {
        <p class="not-found">Product not found.</p>
      }
    </section>
  `,
  styles: `
    section {
      padding: 24px;
      max-width: 600px;
    }
    .back {
      font-size: 14px;
      color: #7c3aed;
      text-decoration: none;
    }
    .back:hover {
      text-decoration: underline;
    }
    .detail {
      margin-top: 20px;
    }
    h1 {
      font-size: 28px;
      margin-bottom: 8px;
    }
    .price {
      font-size: 24px;
      font-weight: 700;
      color: #7c3aed;
      margin-bottom: 12px;
    }
    .category {
      font-size: 13px;
      color: #6b7280;
      margin-right: 12px;
    }
    .stock {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 99px;
      background: #d1fae5;
      color: #065f46;
    }
    .stock.out {
      background: #fee2e2;
      color: #991b1b;
    }
    .description {
      margin-top: 16px;
      font-size: 15px;
      color: #374151;
      line-height: 1.6;
    }
    button {
      margin-top: 20px;
      padding: 10px 20px;
      border: 1px solid #7c3aed;
      background: #7c3aed;
      color: #fff;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
    button:hover {
      background: #6d28d9;
    }
    .not-found {
      color: #6b7280;
      padding: 40px 0;
    }
  `,
})
export class ProductDetail implements OnInit {
  readonly store = inject(ProductStore);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    if (this.store.totalProducts() === 0) {
      this.store.loadProducts();
    }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.store.selectProduct(id);
  }
}
