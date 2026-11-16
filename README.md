# 🥬 Frescor · Supermercado online

E-commerce completo con **Spring Boot 4 (Java 17)** + **Spring Security** en el backend y
**React 18 + TypeScript + Vite** en el frontend.

## Funcionalidades
- Catálogo con categorías, búsqueda (sin tildes y tolerante a plurales), ofertas, orden y paginación
- Ficha de producto, cesta lateral con barra de envío gratis, control de stock
- **Cuentas de usuario**: registro, inicio de sesión y cierre de sesión
- **Mis pedidos**: historial de compras de cada usuario
- Checkout con datos rellenados desde la cuenta; pedidos guardados en base de datos
- Precios siempre recalculados en el servidor; cada pedido solo lo ve su dueño

## Arranque
```bash
# 1. Backend (puerto 8080) — Java 17+ y Maven
cd backend
mvn spring-boot:run

# 2. Frontend (puerto 5173) — Node 18+
cd frontend
npm install
npm run dev
```
Abre http://localhost:5173

## Dónde se guardan los datos
Por defecto en **H2 en archivo**: `backend/data/frescor.mv.db`. Usuarios, sesiones y pedidos
**sobreviven a los reinicios**. (Borra la carpeta `backend/data/` para empezar de cero.)

Tablas principales: `users`, `auth_tokens`, `orders`, `order_items`, `products`, `categories`.

### PostgreSQL (recomendado para producción)
```bash
docker compose up -d
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=postgres
```
Conecta DBeaver a `localhost:5432` (base, usuario y contraseña: `frescor`) y consulta
`SELECT * FROM users;` o `SELECT * FROM orders;`.

## Seguridad
- Contraseñas guardadas con **BCrypt** (nunca en claro)
- Sesión = token aleatorio; en la base de datos solo se guarda su **hash SHA-256**
- Cerrar sesión **invalida el token en el servidor**; las sesiones caducan a los 30 días
- `POST /api/orders`, `GET /api/orders/**` y `/api/auth/me` exigen sesión
- Un pedido ajeno devuelve 404, igual que uno inexistente

## API REST
| Método | Ruta | Acceso | Descripción |
|-------|------|--------|-------------|
| POST | `/api/auth/register` | público | Crea la cuenta y devuelve `{token, user}` |
| POST | `/api/auth/login` | público | Inicia sesión y devuelve `{token, user}` |
| POST | `/api/auth/logout` | sesión | Invalida el token actual |
| GET | `/api/auth/me` | sesión | Cuenta del token actual |
| GET | `/api/categories` | público | Categorías |
| GET | `/api/products?categoryId=&q=&onSale=&sort=&page=&size=` | público | Catálogo paginado |
| GET | `/api/products/{id}` | público | Detalle de producto |
| POST | `/api/orders` | sesión | Crea un pedido (valida stock y calcula totales) |
| GET | `/api/orders` | sesión | Mis pedidos |
| GET | `/api/orders/{id}` | sesión | Un pedido mío |

Las peticiones con sesión llevan la cabecera `Authorization: Bearer <token>`.

## Tests
```bash
cd backend && mvn test
```
Usan una base de datos en memoria y no tocan `backend/data/`.

## Estructura
```
backend/src/main/java/com/frescor
 ├─ config/       CORS y datos de ejemplo
 ├─ security/     SecurityConfig, TokenAuthFilter
 ├─ controller/   AuthController, ProductController, OrderController
 ├─ service/      AuthService, ProductService, OrderService
 ├─ repository/   Spring Data JPA
 ├─ model/        AppUser, AuthToken, Product, CustomerOrder...
 ├─ dto/          records de entrada/salida
 └─ exception/    errores y @RestControllerAdvice
frontend/src
 ├─ components/   una carpeta por componente (.tsx + .css)
 ├─ pages/        Home, ProductDetail, Checkout, OrderConfirmation, Auth, Account
 ├─ hooks/        useCart, useAuth, useCatalog...
 ├─ context/      CartProvider, AuthProvider
 ├─ services/     api.ts, tokenStorage.ts
 ├─ types/ utils/ styles/
```

## Siguientes pasos sugeridos
Panel de administración, pasarela de pago (Stripe), imágenes reales, migraciones con Flyway,
emails de confirmación y estados de pedido gestionables.
