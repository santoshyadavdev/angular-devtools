import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { type Product, MOCK_PRODUCTS } from './product';

type ProductState = {
  products: Product[];
  selectedProductId: number | null;
  filter: { query: string; category: string };
  isLoading: boolean;
};

const initialState: ProductState = {
  products: [],
  selectedProductId: null,
  filter: { query: '', category: '' },
  isLoading: false,
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ products, filter, selectedProductId }) => ({
    filteredProducts: computed(() => {
      let items = products();
      const query = filter.query().toLowerCase();
      const category = filter.category();

      if (query) {
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query),
        );
      }
      if (category) {
        items = items.filter((p) => p.category === category);
      }
      return items;
    }),
    selectedProduct: computed(() => {
      const id = selectedProductId();
      return id ? (products().find((p) => p.id === id) ?? null) : null;
    }),
    categories: computed(() => [...new Set(products().map((p) => p.category))]),
    totalProducts: computed(() => products().length),
    inStockCount: computed(() => products().filter((p) => p.inStock).length),
  })),
  withMethods((store) => ({
    loadProducts(): void {
      if (store.isLoading()) return;
      patchState(store, { isLoading: true });
      setTimeout(() => {
        patchState(store, { products: MOCK_PRODUCTS, isLoading: false });
      }, 300);
    },
    selectProduct(id: number | null): void {
      patchState(store, { selectedProductId: id });
    },
    updateFilter(query: string): void {
      patchState(store, (state) => ({
        filter: { ...state.filter, query },
      }));
    },
    filterByCategory(category: string): void {
      patchState(store, (state) => ({
        filter: { ...state.filter, category },
      }));
    },
    toggleStock(productId: number): void {
      patchState(store, (state) => ({
        products: state.products.map((p) =>
          p.id === productId ? { ...p, inStock: !p.inStock } : p,
        ),
      }));
    },
  })),
);
