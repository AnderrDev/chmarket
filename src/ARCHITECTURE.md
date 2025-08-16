# Arquitectura (Domain/Data)

Este proyecto adopta una arquitectura con 2 capas principales para escalar y mantener bajo acoplamiento entre UI y fuentes de datos.

- Domain
  - Define el lenguaje del negocio mediante contratos e invariantes.
  - Contiene sólo:
    - Repositorios (interfaces): qué datos se requieren y cómo se solicitan (no cómo se obtienen).
    - Use cases: orquestan acciones de negocio consumiendo repositorios.
- Data
  - Implementa los detalles de obtención/entrega de datos.
  - Contiene:
    - Datasources: adaptadores concretos (HTTP, Supabase, Functions, etc.).
    - Repositorios (implementaciones): adaptan datasources a los contratos de Domain.

## Estructura

```text
src/
  application/
    container.ts               # Inyección de dependencias (wiring)
  data/
    datasources/
      CatalogDataSource.ts     # interface + SupabaseCatalogDataSource
      OrdersDataSource.ts      # interface + FunctionsOrdersDataSource
      PaymentsDataSource.ts    # interface + FunctionsPaymentsDataSource
    repositories/
      ProductRepositoryImpl.ts # implementa repositorio de Domain usando CatalogDataSource
      OrderRepositoryImpl.ts
      PaymentRepositoryImpl.ts
  domain/
    repositories/
      catalog/ProductRepository.ts
      orders/OrderRepository.ts
      payments/PaymentRepository.ts
    usecases/
      catalog/{ListProducts, GetProductBySlug, GetProductByVariantId}.ts
      orders/GetOrderSummary.ts
      payments/CreatePreference.ts
  hooks/
  pages/
  types/
```

## Flujo

1) UI/hooks usan Use Cases del Domain (expuestos por el `application/container`).
2) Los Use Cases dependen de interfaces de repositorio (Domain).
3) El contenedor crea implementaciones concretas del repositorio usando datasources (Data) y las inyecta en los Use Cases.

Ventajas: UI desacoplada de transporte/persistencia; fácil testeo mediante repos/mock.

## Cómo agregar un nuevo caso de uso

1) Domain
   - Crear interfaz en `domain/repositories/<feature>/<X>Repository.ts`.
   - Crear caso de uso en `domain/usecases/<feature>/<Action>.ts`:
     - Constructor recibe `<X>Repository`.
     - `execute(...)` realiza la acción necesaria.
2) Data
   - Crear interfaz y/o implementación en `data/datasources/` (p.ej. `<X>DataSource`).
   - Crear implementación de repositorio `data/repositories/<X>RepositoryImpl.ts` que dependa del datasource.
3) Wiring
   - En `application/container.ts`, instanciar datasource → repo impl → use case; exportar la instancia del use case.
4) UI/hooks
   - Importar el use case desde `application/container.ts`.

## Ejemplo (Catálogo)

- Use Cases
  - `ListProductsUseCase.execute(limit)`
  - `GetProductBySlugUseCase.execute(slug)`
- Repositorio (Domain): `ProductRepository`
- Datasource (Data): `SupabaseCatalogDataSource`
- Implementación (Data): `ProductRepositoryImpl`
- Wiring (application/container):

```ts
const catalogDs = new SupabaseCatalogDataSource()
const productRepository = new ProductRepositoryImpl(catalogDs)
export const listProductsUseCase = new ListProductsUseCase(productRepository)
```

## Sustituir datasource (p.ej., mock para tests)

- Crear `MockCatalogDataSource` que implemente `CatalogDataSource`.
- En tests, construir `new ProductRepositoryImpl(new MockCatalogDataSource())` y pasar al caso de uso.

## Principios aplicados

- SRP: cada unidad (use case, repo, datasource) tiene una responsabilidad.
- DIP: la UI depende de abstracciones (use cases/repos), no de detalles.
- OCP: nuevas fuentes de datos se agregan implementando interfaces sin tocar Domain.

## Notas de migración

- Archivos `infra/*` y `services/*` han sido marcados como deprecados donde corresponde.
- Preferir siempre acceder a datos desde Use Cases expuestos por `application/container.ts`.
