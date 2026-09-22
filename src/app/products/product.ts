export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'Noise-cancelling over-ear headphones with 30h battery life.',
    category: 'Electronics',
    inStock: true,
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    price: 129.99,
    description: 'RGB backlit mechanical keyboard with Cherry MX switches.',
    category: 'Electronics',
    inStock: true,
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 99.99,
    description: 'Lightweight running shoes with responsive cushioning.',
    category: 'Sports',
    inStock: false,
  },
  {
    id: 4,
    name: 'Coffee Maker',
    price: 49.99,
    description: '12-cup programmable drip coffee maker.',
    category: 'Home',
    inStock: true,
  },
  {
    id: 5,
    name: 'Backpack',
    price: 59.99,
    description: 'Water-resistant laptop backpack with USB charging port.',
    category: 'Accessories',
    inStock: true,
  },
  {
    id: 6,
    name: 'Yoga Mat',
    price: 29.99,
    description: 'Non-slip exercise mat with carrying strap.',
    category: 'Sports',
    inStock: true,
  },
];
