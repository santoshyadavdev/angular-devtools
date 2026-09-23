import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductStore } from './product.store';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <section>
      <h1>Products ({{ store.totalProducts() }})</h1>

      <div class="toolbar">
        <input
          type="text"
          placeholder="Search products…"
          aria-label="Search products"
          [value]="store.filter.query()"
          (input)="store.updateFilter($any($event.target).value)"
        />
        <select
          aria-label="Filter by category"
          [value]="store.filter.category()"
          (change)="store.filterByCategory($any($event.target).value)"
        >
          <option value="">All Categories</option>
          @for (cat of store.categories(); track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
        <span class="stock-info">{{ store.inStockCount() }} in stock</span>
      </div>

      @if (store.isLoading()) {
        <p class="loading">Loading products…</p>
      } @else {
        <div class="grid">
          @for (product of store.filteredProducts(); track product.id) {
            <a class="card" [routerLink]="['/products', product.id]">
              <h3>{{ product.name }}</h3>
              <p class="price">{{ product.price | currency }}</p>
              <p class="category">{{ product.category }}</p>
              <span class="stock" [class.out]="!product.inStock">
                {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
            </a>
          } @empty {
            <p class="empty">No products match your filters.</p>
          }
        </div>
      }
    </section>
  `,
  styles: `
    section {
      padding: 24px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 16px;
    }
    .toolbar {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    input,
    select {
      background: var(--surface);
      color: var(--ink);
      padding: 8px 12px;
      border: 1px solid var(--line-strong);
      border-radius: 6px;
      font-size: 14px;
    }
    input {
      flex: 1;
      min-width: 200px;
    }
    .stock-info {
      font-size: 13px;
      color: var(--muted);
    }
    .loading {
      color: var(--muted);
      text-align: center;
      padding: 40px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }
    .card {
      display: block;
      padding: 20px;
      border: 1px solid var(--line);
      border-radius: 10px;
      text-decoration: none;
      color: inherit;
      transition:
        border-color 0.15s,
        box-shadow 0.15s;
    }
    .card:hover {
      border-color: var(--brand);
      box-shadow: 0 2px 8px var(--shadow);
    }
    h3 {
      font-size: 16px;
      margin-bottom: 8px;
    }
    .price {
      font-size: 20px;
      font-weight: 700;
      color: var(--brand);
      margin-bottom: 4px;
    }
    .category {
      font-size: 13px;
      color: var(--muted);
      margin-bottom: 8px;
    }
    .stock {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 99px;
      background: var(--ok-soft);
      color: var(--ok-ink);
    }
    .stock.out {
      background: var(--danger-soft);
      color: var(--danger-ink);
    }
    .empty {
      color: var(--muted);
      text-align: center;
      grid-column: 1 / -1;
      padding: 40px;
    }
  `,
})
export class ProductList implements OnInit {
  readonly store = inject(ProductStore);

  ngOnInit() {
    if (this.store.totalProducts() === 0) {
      this.store.loadProducts();
    }
  }
}
