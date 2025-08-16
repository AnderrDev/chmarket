import { ProductRepositoryImpl } from './data/repositories/ProductRepositoryImpl'
import { SupabaseCatalogDataSource } from './data/datasources/CatalogDataSource'
import { GetProductBySlugUseCase } from './domain/usecases/catalog/GetProductBySlug'
import { ListProductsUseCase } from './domain/usecases/catalog/ListProducts'
import { GetProductByVariantIdUseCase } from './domain/usecases/catalog/GetProductByVariantId'
import { GetOrderSummaryUseCase } from './domain/usecases/orders/GetOrderSummary'
import { CreatePreferenceUseCase } from './domain/usecases/payments/CreatePreference'
import { FunctionsOrdersDataSource } from './data/datasources/OrdersDataSource'
import { OrderRepositoryImpl } from './data/repositories/OrderRepositoryImpl'
import { FunctionsPaymentsDataSource } from './data/datasources/PaymentsDataSource'
import { PaymentRepositoryImpl } from './data/repositories/PaymentRepositoryImpl'

// Contenedor simple para inyectar dependencias (puede evolucionar a DI lib)
const catalogDs = new SupabaseCatalogDataSource()
const productRepository = new ProductRepositoryImpl(catalogDs)

export const listProductsUseCase = new ListProductsUseCase(productRepository)
export const getProductBySlugUseCase = new GetProductBySlugUseCase(productRepository)
export const getProductByVariantIdUseCase = new GetProductByVariantIdUseCase(productRepository)

// Orders
const ordersDs = new FunctionsOrdersDataSource()
const orderRepository = new OrderRepositoryImpl(ordersDs)
export const getOrderSummaryUseCase = new GetOrderSummaryUseCase(orderRepository)

// Payments
const paymentsDs = new FunctionsPaymentsDataSource()
const paymentRepository = new PaymentRepositoryImpl(paymentsDs)
export const createPreferenceUseCase = new CreatePreferenceUseCase(paymentRepository)


