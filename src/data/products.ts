// =============================================
// src/data/products.ts
// =============================================
import { Product } from "../types/product"

// ⤵️ Usa tu array actual completo. Por brevedad, dejo 2 items ejemplo.
const products: Product[] = [
  {
    id: 1,
    name: 'CH+ Pure Creatine Monohydrate',
    type: 'creatine',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.pexels.com/photos/4397845/pexels-photo-4397845.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/4397845/pexels-photo-4397845.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4397832/pexels-photo-4397832.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4397844/pexels-photo-4397844.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Premium micronized creatine monohydrate for enhanced strength, power, and muscle growth.',
    longDescription: 'Micronized creatine monohydrate 5g per serving. Dissolves easily and absorbs quickly to maximize training.',
    features: ['5g per serving','Unflavored','200 servings','Third-party tested','Micronized'],
    ingredients: ['Creatine Monohydrate'],
    nutritionFacts: { 'Serving Size': '1 scoop (5g)', 'Servings Per Container': '200', 'Creatine Monohydrate': '5g', 'Calories': '0' },
    rating: 4.8,
    reviews: 1247,
    inStock: 15,
    servings: 200
  },
  {
    id: 2,
    name: 'CH+ Whey Protein Isolate',
    type: 'protein',
    price: 49.99,
    originalPrice: 59.99,
    image: 'https://images.pexels.com/photos/4397844/pexels-photo-4397844.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/4397844/pexels-photo-4397844.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4397845/pexels-photo-4397845.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Fast-absorbing whey protein isolate with 25g protein per serving.',
    longDescription: 'Premium WPI, low lactose, 25g per serving to support muscle recovery and growth.',
    features: ['25g protein','Chocolate','30 servings','Low lactose','Fast absorption'],
    ingredients: ['Whey Protein Isolate','Natural Chocolate Flavor','Cocoa Powder','Stevia Extract','Sunflower Lecithin'],
    nutritionFacts: { 'Serving Size': '1 scoop (32g)', 'Servings Per Container': '30', 'Protein': '25g', 'Calories': '110'},
    rating: 4.9,
    reviews: 892,
    inStock: 8,
    servings: 30,
    flavor: 'Chocolate'
  }
]

export default products
