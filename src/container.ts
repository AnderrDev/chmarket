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
import { FunctionsAdminProductsDataSource } from './data/datasources/AdminProductsDataSource'
import { AdminProductRepositoryImpl } from './data/repositories/AdminProductRepositoryImpl'
import { ListAdminProductsUseCase } from './domain/usecases/admin/ListAdminProducts'
import { UpsertAdminProductUseCase } from './domain/usecases/admin/UpsertAdminProduct'
import { DeleteAdminProductUseCase } from './domain/usecases/admin/DeleteAdminProduct'
import { FunctionsAdminMediaDataSource } from './data/datasources/AdminMediaDataSource'
import { UploadProductImageUseCase } from './domain/usecases/admin/UploadProductImage'
import { SupabaseAdminValidationDataSource } from './data/datasources/AdminValidationDataSource'
import { ValidateUniquenessUseCase } from './domain/usecases/admin/ValidateUniqueness'

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

// Admin - Products
const adminProductsDs = new FunctionsAdminProductsDataSource()
const adminProductsRepo = new AdminProductRepositoryImpl(adminProductsDs)
export const listAdminProductsUseCase = new ListAdminProductsUseCase(adminProductsRepo)
export const upsertAdminProductUseCase = new UpsertAdminProductUseCase(adminProductsRepo)
export const deleteAdminProductUseCase = new DeleteAdminProductUseCase(adminProductsRepo)
const adminMediaDs = new FunctionsAdminMediaDataSource()
export const uploadProductImageUseCase = new UploadProductImageUseCase(adminMediaDs)
const adminValidationDs = new SupabaseAdminValidationDataSource()
export const validateUniquenessUseCase = new ValidateUniquenessUseCase(adminValidationDs)


