# AgriTrack — Spring Boot Backend (Phase 18: Harvest, Sales & APMC Market Price Management Backend APIs)

Welcome to the backend service of **AgriTrack – Smart Farm Management System**. This backend is implemented as a clean, modular REST API using **Java 21 LTS** and **Spring Boot 4.1.x**, backed by **MySQL 8.0** with **Spring Security** and **JWT Bearer token authentication**.

---

## 1. Backend Overview

AgriTrack employs a three-tier architecture:
1. **Presentation Layer**: React 19 + Vite frontend (`/frontend`).
2. **Application Layer**: Java Spring Boot REST API (`/backend`), serving endpoints at `/api/v1/*`.
3. **Data Layer**: MySQL 8.0 relational database (`/database`), accessed via Spring Data JPA and Hibernate.

### Completed Milestones:
- **Phase 13 (Foundation):** Clean layered architecture, standardized `ApiResponse<T>` envelope, `@RestControllerAdvice` error handling, CORS policies, MySQL connectivity, and health probe `/api/v1/health`.
- **Phase 14 (Authentication & User Management):**
  - Secure user database model (`users` table).
  - User registration (`POST /api/v1/auth/register`) with default `FARMER` role.
  - User authentication (`POST /api/v1/auth/login`) with BCrypt password verification.
  - Stateless HMAC-SHA256 JWT access-token generation and validation.
  - Spring Security stateless filter chain with `JwtAuthenticationFilter` and `JwtAuthenticationEntryPoint`.
  - Protected endpoints requiring Bearer tokens (`GET /api/v1/users/me`).
- **Phase 15 (Farm, Field & Soil Backend APIs):**
  - Relational schema tables (`farms`, `fields`, `soil_records`) with ON DELETE CASCADE foreign keys and index optimization.
  - Strict server-side ownership isolation: User -> Farm -> Field -> Soil Record.
  - Farm REST APIs (`/api/v1/farms/**`).
  - Field REST APIs (`/api/v1/farms/{farmId}/fields`, `/api/v1/fields/{id}`).
  - Soil Record REST APIs (`/api/v1/fields/{fieldId}/soil-records`, `/api/v1/soil-records/{id}`).
- **Phase 16 (Crop Management & Lifecycle Backend APIs):**
  - Relational schema table (`crop_cycles`) with foreign key `fk_crop_cycles_field` to `fields` and `ON DELETE CASCADE`.
  - Strict server-side ownership isolation: User -> Farm -> Field -> CropCycle.
  - Crop Cycle REST APIs (`/api/v1/fields/{fieldId}/crop-cycles`, `/api/v1/crop-cycles/**`).
- **Phase 17 (Activity & Irrigation Management Backend APIs):**
  - Relational schema tables (`activities`, `irrigation_schedules`) with ON DELETE CASCADE to `fields` and ON DELETE SET NULL to `crop_cycles`.
  - Strict server-side ownership isolation: User -> Farm -> Field -> Activity / IrrigationSchedule.
  - Cross-field and cross-user validation for optional crop cycle association.
  - Activity REST APIs (`/api/v1/fields/{fieldId}/activities`, `/api/v1/activities/**`).
  - Irrigation REST APIs (`/api/v1/fields/{fieldId}/irrigation`, `/api/v1/irrigation/**`).
- **Phase 18 (Harvest, Sales & APMC Market Price Management Backend APIs):**
  - Relational schema tables (`harvests`, `sales`, `market_prices`).
  - Strict server-side ownership isolation: User -> Farm -> Field -> CropCycle -> Harvest -> Sale.
  - Referential integrity strategy: `ON DELETE RESTRICT` for `CropCycle -> Harvest` and `Harvest -> Sale` to safeguard historical financial transactions and audit history.
  - Harvest REST APIs (`/api/v1/crop-cycles/{cropCycleId}/harvests`, `/api/v1/harvests/**`, `/api/v1/fields/{fieldId}/harvests`, `/api/v1/farms/{farmId}/harvests`).
  - Sales REST APIs (`/api/v1/harvests/{harvestId}/sales`, `/api/v1/sales/**`).
  - APMC Market Price REST APIs (`/api/v1/market-prices/**`) with multi-criteria filtering and ADMIN-only write protection (`@PreAuthorize("hasRole('ADMIN')")`).
  - Transactional inventory reconciliation with row-level pessimistic locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`).
  - Authoritative backend financial calculations (total revenue, quintal pricing, balance due, payment status derivation).
  - 166 automated unit, mock, and integration tests passing with 100% success.

---

## 2. Technology Stack

- **Language**: Java 21 LTS (Amazon Corretto / OpenJDK)
- **Framework**: Spring Boot 4.1.2 (Current Stable GA Release)
- **Framework Core**: Spring Framework 7.0.x
- **Security**: Spring Security 7.0.x & BCrypt Password Hashing
- **Authentication**: JJWT (Java JWT) 0.12.6 (HMAC-SHA256)
- **Build Tool**: Apache Maven 3.9.16 (bundled with Maven Wrapper `mvnw`)
- **Persistence**: Spring Data JPA & Hibernate 7.4
- **Database Driver**: MySQL Connector/J 8.3+
- **Validation**: Jakarta Validation / Hibernate Validator (Spring Boot Starter Validation)
- **Testing**: JUnit 5 Jupiter, Mockito, MockMvc, Spring Boot Test, Spring Security Test

---

## 3. Project Package Structure

```
backend/
├── .mvn/wrapper/                                  # Maven Wrapper runtime binaries & properties
│   └── maven-wrapper.properties
├── src/
│   ├── main/
│   │   ├── java/com/agritrack/
│   │   │   ├── AgriTrackApplication.java          # Spring Boot main entrypoint
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java                # CORS registry (WebMvcConfigurer)
│   │   │   │   ├── JwtAuthenticationEntryPoint.java # 401 Unauthorized JSON entry point
│   │   │   │   ├── JwtAuthenticationFilter.java   # Bearer token interceptor filter
│   │   │   │   └── SecurityConfig.java            # Spring Security configuration
│   │   │   ├── controller/
│   │   │   │   ├── ActivityController.java        # /activities and /fields/{fieldId}/activities CRUD
│   │   │   │   ├── AuthController.java            # POST /auth/register, POST /auth/login
│   │   │   │   ├── CropCycleController.java       # /crop-cycles and /fields/{fieldId}/crop-cycles CRUD
│   │   │   │   ├── FarmController.java            # /farms CRUD endpoints
│   │   │   │   ├── FieldController.java           # /farms/{farmId}/fields, /fields/{id} CRUD
│   │   │   │   ├── HarvestController.java         # /harvests and /crop-cycles/{cropCycleId}/harvests CRUD
│   │   │   │   ├── HealthController.java          # GET /health probe
│   │   │   │   ├── IrrigationController.java      # /irrigation and /fields/{fieldId}/irrigation CRUD
│   │   │   │   ├── MarketPriceController.java     # /market-prices (Read: All; Write: ADMIN)
│   │   │   │   ├── SaleController.java            # /sales and /harvests/{harvestId}/sales CRUD
│   │   │   │   ├── SoilRecordController.java      # /fields/{fieldId}/soil-records, /soil-records/{id} CRUD
│   │   │   │   └── UserController.java            # GET /users/me (protected)
│   │   │   ├── dto/
│   │   │   │   ├── ActivityRequest.java           # Activity creation & update payload DTO
│   │   │   │   ├── ActivityResponse.java          # Activity response payload DTO
│   │   │   │   ├── ApiError.java                  # Field-level validation error DTO
│   │   │   │   ├── ApiResponse.java               # Standard API response JSON envelope
│   │   │   │   ├── AuthResponse.java              # JWT authentication response DTO
│   │   │   │   ├── CropCycleRequest.java          # Crop cycle payload DTO
│   │   │   │   ├── CropCycleResponse.java         # Crop cycle response DTO
│   │   │   │   ├── FarmRequest.java               # Farm creation & update payload DTO
│   │   │   │   ├── FarmResponse.java              # Farm response payload DTO
│   │   │   │   ├── FieldRequest.java              # Field creation & update payload DTO
│   │   │   │   ├── FieldResponse.java             # Field response payload DTO
│   │   │   │   ├── HarvestRequest.java            # Harvest payload DTO
│   │   │   │   ├── HarvestResponse.java           # Harvest response DTO
│   │   │   │   ├── IrrigationRequest.java         # Irrigation schedule payload DTO
│   │   │   │   ├── IrrigationResponse.java        # Irrigation schedule response DTO
│   │   │   │   ├── LoginRequest.java              # User login payload DTO
│   │   │   │   ├── MarketPriceRequest.java        # Market price benchmark payload DTO
│   │   │   │   ├── MarketPriceResponse.java       # Market price response DTO
│   │   │   │   ├── RegisterRequest.java           # User registration payload DTO
│   │   │   │   ├── SaleRequest.java               # Sales transaction payload DTO
│   │   │   │   ├── SaleResponse.java              # Sales transaction response DTO
│   │   │   │   ├── SoilRecordRequest.java         # Soil record payload DTO
│   │   │   │   ├── SoilRecordResponse.java        # Soil record response DTO
│   │   │   │   └── UserResponse.java              # Safe user profile DTO
│   │   │   ├── entity/
│   │   │   │   ├── Activity.java                  # JPA entity mapping to 'activities' table
│   │   │   │   ├── CropCycle.java                 # JPA entity mapping to 'crop_cycles' table
│   │   │   │   ├── Farm.java                      # JPA entity mapping to 'farms' table
│   │   │   │   ├── Field.java                     # JPA entity mapping to 'fields' table
│   │   │   │   ├── Harvest.java                   # JPA entity mapping to 'harvests' table
│   │   │   │   ├── IrrigationSchedule.java        # JPA entity mapping to 'irrigation_schedules' table
│   │   │   │   ├── MarketPrice.java               # JPA entity mapping to 'market_prices' table
│   │   │   │   ├── Role.java                      # User roles enum (FARMER, ADMIN)
│   │   │   │   ├── Sale.java                      # JPA entity mapping to 'sales' table
│   │   │   │   ├── SoilRecord.java                # JPA entity mapping to 'soil_records' table
│   │   │   │   └── User.java                      # JPA entity mapping to 'users' table
│   │   │   ├── exception/
│   │   │   │   ├── EmailAlreadyExistsException.java # HTTP 409 Conflict
│   │   │   │   ├── GlobalExceptionHandler.java    # Centralized @RestControllerAdvice
│   │   │   │   ├── InvalidCredentialsException.java # HTTP 401 Unauthorized
│   │   │   │   ├── JwtAuthenticationException.java # HTTP 401 Unauthorized
│   │   │   │   ├── ResourceNotFoundException.java # HTTP 404 Not Found
│   │   │   │   └── UserInactiveException.java     # HTTP 403 Forbidden
│   │   │   ├── repository/
│   │   │   │   ├── ActivityRepository.java        # Spring Data JPA repository for Activity
│   │   │   │   ├── CropCycleRepository.java       # Spring Data JPA repository for CropCycle
│   │   │   │   ├── FarmRepository.java            # Spring Data JPA repository for Farm
│   │   │   │   ├── FieldRepository.java           # Spring Data JPA repository for Field
│   │   │   │   ├── HarvestRepository.java         # Spring Data JPA repository for Harvest
│   │   │   │   ├── IrrigationScheduleRepository.java # Spring Data JPA repository for IrrigationSchedule
│   │   │   │   ├── MarketPriceRepository.java     # Spring Data JPA repository for MarketPrice
│   │   │   │   ├── SaleRepository.java            # Spring Data JPA repository for Sale
│   │   │   │   ├── SoilRecordRepository.java      # Spring Data JPA repository for SoilRecord
│   │   │   │   └── UserRepository.java            # Spring Data JPA repository for User
│   │   │   ├── service/
│   │   │   │   ├── ActivityService.java           # Activity business logic with user isolation
│   │   │   │   ├── AuthService.java               # Registration & login workflows
│   │   │   │   ├── CropCycleService.java          # Crop cycle business logic with user isolation
│   │   │   │   ├── FarmService.java               # Farm business logic with user isolation
│   │   │   │   ├── FieldService.java              # Field business logic with user isolation
│   │   │   │   ├── HarvestService.java            # Harvest business logic with inventory invariants
│   │   │   │   ├── IrrigationService.java         # Irrigation business logic with user isolation
│   │   │   │   ├── MarketPriceService.java        # Market price reference data logic
│   │   │   │   ├── SaleService.java               # Sales business logic with inventory reconciliation
│   │   │   │   ├── SoilRecordService.java         # Soil record business logic with user isolation
│   │   │   │   └── UserService.java               # Profile retrieval workflows
│   │   │   └── util/
│   │   │       └── JwtUtil.java                   # HMAC-SHA256 JWT utility
│   │   └── resources/
│   │       └── application.properties             # Context-path, datasource, and JWT config
│   └── test/
│       └── java/com/agritrack/
│           ├── ActivityControllerTest.java        # Activity endpoint tests with Bearer tokens
│           ├── ActivityServiceTest.java           # Activity business logic & ownership isolation tests
│           ├── AgriTrackApplicationTests.java     # Spring context bootstrap verification
│           ├── AuthControllerTest.java            # Registration & login endpoint tests
│           ├── AuthServiceTest.java               # Authentication business logic tests
│           ├── CropCycleControllerTest.java       # CropCycle endpoint tests with Bearer tokens
│           ├── CropCycleServiceTest.java          # CropCycle business logic & ownership isolation tests
│           ├── DatabaseConnectionTest.java        # Live MySQL connectivity (opt-in)
│           ├── FarmControllerTest.java            # Farm endpoint tests with Bearer tokens
│           ├── FarmServiceTest.java               # Farm business logic & ownership isolation tests
│           ├── FieldControllerTest.java           # Field endpoint tests with Bearer tokens
│           ├── FieldServiceTest.java              # Field business logic & ownership isolation tests
│           ├── GlobalExceptionHandlerTest.java    # Exception handling unit tests
│           ├── HarvestControllerTest.java         # Harvest endpoint tests with Bearer tokens
│           ├── HarvestServiceTest.java            # Harvest business logic & inventory invariant tests
│           ├── HealthControllerTest.java          # MockMvc GET /api/v1/health test
│           ├── IrrigationControllerTest.java      # Irrigation endpoint tests with Bearer tokens
│           ├── IrrigationServiceTest.java         # Irrigation business logic & ownership isolation tests
│           ├── JwtUtilTest.java                   # JWT generation, expiration & validation tests
│           ├── MarketPriceControllerTest.java     # Market price endpoint & ADMIN authorization tests
│           ├── MarketPriceServiceTest.java        # Market price business logic & calculation tests
│           ├── SaleControllerTest.java            # Sale endpoint tests with Bearer tokens
│           ├── SaleServiceTest.java               # Sale financial calculations & inventory reconciliation tests
│           ├── SoilRecordControllerTest.java      # Soil record endpoint tests with Bearer tokens
│           ├── SoilRecordServiceTest.java         # Soil record business logic tests
│           └── UserControllerTest.java            # Protected GET /api/v1/users/me tests
├── .env.example                                   # Environment variable reference template
├── mvnw                                           # Linux/macOS Maven wrapper script
├── mvnw.cmd                                       # Windows PowerShell/CMD Maven wrapper
├── pom.xml                                        # Maven project descriptor
└── README.md                                      # Backend reference documentation
```

---

## 4. REST API Reference (Phase 18 Endpoints)

All endpoints require standard Bearer token authentication:
`Authorization: Bearer <access_token>`

### 4.1 Harvest Endpoints
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/crop-cycles/{cropCycleId}/harvests` | Log a new harvest for an owned crop cycle | `201 Created` |
| `GET` | `/api/v1/crop-cycles/{cropCycleId}/harvests` | List all harvests for a specific crop cycle | `200 OK` |
| `GET` | `/api/v1/harvests` | List all harvests belonging to the authenticated user | `200 OK` |
| `GET` | `/api/v1/harvests/{id}` | Get harvest by ID (returns 404 if owned by another user) | `200 OK` / `404 Not Found` |
| `PUT` | `/api/v1/harvests/{id}` | Update harvest details and inventory figures | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/v1/harvests/{id}` | Delete harvest (blocked if sales exist) | `204 No Content` / `400 Bad Request` |
| `GET` | `/api/v1/fields/{fieldId}/harvests` | List all harvests within a field | `200 OK` |
| `GET` | `/api/v1/farms/{farmId}/harvests` | List all harvests within a farm | `200 OK` |

### 4.2 Sales Endpoints
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/harvests/{harvestId}/sales` | Log a sale transaction with automatic stock decrement | `201 Created` |
| `GET` | `/api/v1/harvests/{harvestId}/sales` | List all sales recorded against a harvest | `200 OK` |
| `GET` | `/api/v1/sales` | List all sales belonging to the authenticated user | `200 OK` |
| `GET` | `/api/v1/sales/{id}` | Get sale by ID (returns 404 if owned by another user) | `200 OK` / `404 Not Found` |
| `PUT` | `/api/v1/sales/{id}` | Update sale record with inventory delta adjustments | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/v1/sales/{id}` | Delete sale and refund sold stock back to available inventory | `204 No Content` / `404 Not Found` |

### 4.3 APMC / Market Prices Endpoints
| Method | Endpoint | Required Role | Description | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/market-prices` | `FARMER`, `ADMIN` | Query market prices with filters (`crop`, `market`, `trend`, `date`, `dateFrom`, `dateTo`) | `200 OK` |
| `GET` | `/api/v1/market-prices/{id}` | `FARMER`, `ADMIN` | Get market price detail by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/v1/market-prices` | `ADMIN` | Create a new benchmark market price record | `201 Created` / `403 Forbidden` |
| `PUT` | `/api/v1/market-prices/{id}` | `ADMIN` | Update benchmark market price record | `200 OK` / `403 Forbidden` |
| `DELETE` | `/api/v1/market-prices/{id}` | `ADMIN` | Delete benchmark market price record | `204 No Content` / `403 Forbidden` |

---

## 5. Domain Rules & Architectural Decisions

### 5.1 Ownership Hierarchy & Multi-Tenant Security
```text
User (id)
  └── Farm (user_id FK)
        └── Field (farm_id FK)
              └── CropCycle (field_id FK)
                    └── Harvest (crop_cycle_id FK)
                          └── Sale (harvest_id FK)

Global Commodity Benchmark:
MarketPrice (Independent reference data — readable by all authenticated users)
```
- **Harvest Ownership**: Derived via `harvest.cropCycle.field.farm.user.id == currentUser.id`.
- **Sale Ownership**: Derived via `sale.harvest.cropCycle.field.farm.user.id == currentUser.id`.
- **Anti-Enumeration Protection**: Attempting to access or modify a harvest or sale owned by another farmer returns `404 Not Found` with generic resource masking to eliminate resource ID scanning.
- **Market Prices**: Global reference benchmark data. All authenticated users have read access. Write operations are strictly secured with `@PreAuthorize("hasRole('ADMIN')")`.

### 5.2 Referential Integrity & Deletion Strategy (Financial Protection)
To protect financial and accounting records against accidental destruction:
- `fk_harvests_crop_cycle`: Uses `ON DELETE RESTRICT`. A `CropCycle` cannot be deleted if associated `Harvest` records exist.
- `fk_sales_harvest`: Uses `ON DELETE RESTRICT`. A `Harvest` cannot be deleted if associated `Sale` records exist. Attempting to delete a harvest with sales raises an `IllegalArgumentException` explaining that sales must be handled first.

### 5.3 Authoritative Financial Calculations
The backend is the sole authority for financial calculations and will not trust client-supplied totals:
- `pricePerQuintal = pricePerKg * 100`
- `totalAmount = quantityKg * pricePerKg`
- `balanceDue = max(0, totalAmount - paidAmount)`
- `paymentStatus`:
  - `paidAmount == 0` → `PENDING`
  - `paidAmount > 0 and paidAmount < totalAmount` → `PARTIAL`
  - `paidAmount >= totalAmount` → `PAID`

### 5.4 Transactional Inventory Reconciliation
- **Concurrency Safety**: `HarvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock` employs row-level pessimistic write locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) to ensure concurrent sales cannot oversell the same harvest.
- **Creation**: Decrements `availableQuantityKg` and increments `soldQuantityKg`. Rejects with `400 Bad Request` if `quantityKg > availableQuantityKg`.
- **Deletion**: Refunds `quantityKg` back into `availableQuantityKg` and decrements `soldQuantityKg`.
- **Update**: Computes delta (`newQuantity - oldQuantity`) and adjusts available and sold quantities accordingly.
- **Lifecycle Status**: Automatically updates harvest status to `SOLD_OUT` when `availableQuantityKg == 0 && soldQuantityKg > 0`, `PARTIALLY_SOLD` when `soldQuantityKg > 0`, and `HARVESTED` when `soldQuantityKg == 0`.

---

## 6. Database Setup & Seed Data

### 1. Database Creation & Migrations
Execute the migrations in order:
```powershell
mysql -u root -p < database/01_create_database.sql
mysql -u root -p < database/02_create_users_table.sql
mysql -u root -p < database/03_create_farms_fields_soil_tables.sql
mysql -u root -p < database/04_create_crop_cycles_table.sql
mysql -u root -p < database/05_create_activities_and_irrigation_tables.sql
mysql -u root -p < database/06_create_harvest_sales_market_tables.sql
```

### 2. Market Price Seed Data
Load the initial APMC commodity market benchmark prices:
```powershell
mysql -u root -p < database/07_seed_market_prices.sql
```

---

## 7. Running Tests

Execute all 166 automated unit and MockMvc tests:
```powershell
cd backend
.\mvnw.cmd test
```

Execute tests including live MySQL database connectivity:
```powershell
cd backend
$env:DB_PASSWORD="your_password"
.\mvnw.cmd test -DrunDbTests=true
```

Build executable production JAR:
```powershell
cd backend
.\mvnw.cmd package -DskipTests
```
