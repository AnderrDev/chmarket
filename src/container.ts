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
import { FunctionsAdminOrdersDataSource } from './data/datasources/AdminOrdersDataSource'
import { AdminOrderRepositoryImpl } from './data/repositories/AdminOrderRepositoryImpl'
import { ListAdminOrdersUseCase } from './domain/usecases/orders/ListAdminOrders'
import { GetAdminOrderUseCase } from './domain/usecases/orders/GetAdminOrder'
import { UpdateAdminOrderStatusUseCase } from './domain/usecases/orders/UpdateAdminOrderStatus'
import { FunctionsAdminCustomersDataSource } from './data/datasources/AdminCustomersDataSource'
import { AdminCustomerRepositoryImpl } from './data/repositories/AdminCustomerRepositoryImpl'
import { ListAdminCustomersUseCase } from './domain/usecases/orders/ListAdminCustomers'
import { GetAdminCustomerUseCase } from './domain/usecases/orders/GetAdminCustomer'
import { FunctionsAdminContentDataSource } from './data/datasources/AdminContentDataSource'
import { AdminContentRepositoryImpl } from './data/repositories/AdminContentRepositoryImpl'
import { GetContentBlockUseCase } from './domain/usecases/admin/GetContentBlock'
import { SetContentBlockUseCase } from './domain/usecases/admin/SetContentBlock'
import { FunctionsAdminSettingsDataSource } from './data/datasources/AdminSettingsDataSource'
import { AdminSettingsRepositoryImpl } from './data/repositories/AdminSettingsRepositoryImpl'
import { GetSettingUseCase } from './domain/usecases/admin/GetSetting'
import { SetSettingUseCase } from './domain/usecases/admin/SetSetting'

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

// Admin - Orders
const adminOrdersDs = new FunctionsAdminOrdersDataSource()
const adminOrdersRepo = new AdminOrderRepositoryImpl(adminOrdersDs)
export const listAdminOrdersUseCase = new ListAdminOrdersUseCase(adminOrdersRepo)
export const getAdminOrderUseCase = new GetAdminOrderUseCase(adminOrdersRepo)
export const updateAdminOrderStatusUseCase = new UpdateAdminOrderStatusUseCase(adminOrdersRepo)

// Admin - Customers
const adminCustomersDs = new FunctionsAdminCustomersDataSource()
const adminCustomersRepo = new AdminCustomerRepositoryImpl(adminCustomersDs)
export const listAdminCustomersUseCase = new ListAdminCustomersUseCase(adminCustomersRepo)
export const getAdminCustomerUseCase = new GetAdminCustomerUseCase(adminCustomersRepo)

// Admin - Content
const adminContentDs = new FunctionsAdminContentDataSource()
const adminContentRepo = new AdminContentRepositoryImpl(adminContentDs)
export const getContentBlockUseCase = new GetContentBlockUseCase(adminContentRepo)
export const setContentBlockUseCase = new SetContentBlockUseCase(adminContentRepo)

// Admin - Settings
const adminSettingsDs = new FunctionsAdminSettingsDataSource()
const adminSettingsRepo = new AdminSettingsRepositoryImpl(adminSettingsDs)
export const getSettingUseCase = new GetSettingUseCase(adminSettingsRepo)
export const setSettingUseCase = new SetSettingUseCase(adminSettingsRepo)


