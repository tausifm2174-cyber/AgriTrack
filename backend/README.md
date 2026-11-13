# AgriTrack — Spring Boot Backend (Phase 15: Farm, Field & Soil Backend APIs)

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
  - Farm REST APIs:
    - `POST /api/v1/farms` (HTTP 201 Created)
    - `GET /api/v1/farms` (HTTP 200 OK)
    - `GET /api/v1/farms/{id}` (HTTP 200 OK / 404 Not Found)
    - `PUT /api/v1/farms/{id}` (HTTP 200 OK / 404 Not Found)
    - `DELETE /api/v1/farms/{id}` (HTTP 200 OK / 404 Not Found)
  - Field REST APIs:
    - `POST /api/v1/farms/{farmId}/fields` (HTTP 201 Created)
    - `GET /api/v1/farms/{farmId}/fields` (HTTP 200 OK)
    - `GET /api/v1/fields/{id}` (HTTP 200 OK / 404 Not Found)
    - `PUT /api/v1/fields/{id}` (HTTP 200 OK / 404 Not Found)
    - `DELETE /api/v1/fields/{id}` (HTTP 200 OK / 404 Not Found)
  - Soil Record REST APIs:
    - `POST /api/v1/fields/{fieldId}/soil-records` (HTTP 201 Created)
    - `GET /api/v1/fields/{fieldId}/soil-records` (HTTP 200 OK)
    - `GET /api/v1/soil-records/{id}` (HTTP 200 OK / 404 Not Found)
    - `PUT /api/v1/soil-records/{id}` (HTTP 200 OK / 404 Not Found)
    - `DELETE /api/v1/soil-records/{id}` (HTTP 200 OK / 404 Not Found)
  - 57 automated unit, mock, and integration tests passing with 100% success.

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
│   │   │   │   ├── AuthController.java            # POST /auth/register, POST /auth/login
│   │   │   │   ├── FarmController.java            # /farms CRUD endpoints
│   │   │   │   ├── FieldController.java           # /farms/{farmId}/fields, /fields/{id} CRUD
│   │   │   │   ├── HealthController.java          # GET /health probe
│   │   │   │   ├── SoilRecordController.java      # /fields/{fieldId}/soil-records, /soil-records/{id} CRUD
│   │   │   │   └── UserController.java            # GET /users/me (protected)
│   │   │   ├── dto/
│   │   │   │   ├── ApiError.java                  # Field-level validation error DTO
│   │   │   │   ├── ApiResponse.java               # Standard API response JSON envelope
│   │   │   │   ├── AuthResponse.java              # JWT authentication response DTO
│   │   │   │   ├── FarmRequest.java               # Farm creation & update payload DTO
│   │   │   │   ├── FarmResponse.java              # Farm response payload DTO
│   │   │   │   ├── FieldRequest.java              # Field creation & update payload DTO
│   │   │   │   ├── FieldResponse.java             # Field response payload DTO
│   │   │   │   ├── LoginRequest.java              # User login payload DTO
│   │   │   │   ├── RegisterRequest.java           # User registration payload DTO
│   │   │   │   ├── SoilRecordRequest.java         # Soil record payload DTO
│   │   │   │   ├── SoilRecordResponse.java        # Soil record response DTO
│   │   │   │   └── UserResponse.java              # Safe user profile DTO
│   │   │   ├── entity/
│   │   │   │   ├── Farm.java                      # JPA entity mapping to 'farms' table
│   │   │   │   ├── Field.java                     # JPA entity mapping to 'fields' table
│   │   │   │   ├── Role.java                      # User roles enum (FARMER, ADMIN)
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
│   │   │   │   ├── FarmRepository.java            # Spring Data JPA repository for Farm
│   │   │   │   ├── FieldRepository.java           # Spring Data JPA repository for Field
│   │   │   │   ├── SoilRecordRepository.java      # Spring Data JPA repository for SoilRecord
│   │   │   │   └── UserRepository.java            # Spring Data JPA repository for User
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java               # Registration & login workflows
│   │   │   │   ├── FarmService.java               # Farm business logic with user isolation
│   │   │   │   ├── FieldService.java              # Field business logic with user isolation
│   │   │   │   ├── SoilRecordService.java         # Soil record business logic with user isolation
│   │   │   │   └── UserService.java               # Profile retrieval workflows
│   │   │   └── util/
│   │   │       └── JwtUtil.java                   # HMAC-SHA256 JWT utility
│   │   └── resources/
│   │       └── application.properties             # Context-path, datasource, and JWT config
│   └── test/
│       └── java/com/agritrack/
│           ├── AgriTrackApplicationTests.java     # Spring context bootstrap verification
│           ├── AuthControllerTest.java            # Registration & login endpoint tests
│           ├── AuthServiceTest.java               # Authentication business logic tests
│           ├── DatabaseConnectionTest.java        # Live MySQL connectivity (opt-in)
│           ├── FarmControllerTest.java            # Farm endpoint tests with Bearer tokens
│           ├── FarmServiceTest.java               # Farm business logic & ownership isolation tests
│           ├── FieldControllerTest.java           # Field endpoint tests with Bearer tokens
│           ├── FieldServiceTest.java              # Field business logic & ownership isolation tests
│           ├── GlobalExceptionHandlerTest.java    # Exception handling unit tests
│           ├── HealthControllerTest.java          # MockMvc GET /api/v1/health test
│           ├── JwtUtilTest.java                   # JWT generation, expiration & validation tests
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

## 4. REST API Reference (Phase 15 Endpoints)

All endpoints below require standard Bearer token authentication:
`Authorization: Bearer <access_token>`

### Farm Endpoints (`/api/v1/farms`)
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/farms` | Create a new farm under the authenticated user | `201 Created` |
| `GET` | `/api/v1/farms` | List all farms belonging to the authenticated user | `200 OK` |
| `GET` | `/api/v1/farms/{id}` | Get farm by ID (returns 404 if owned by another user) | `200 OK` / `404 Not Found` |
| `PUT` | `/api/v1/farms/{id}` | Update existing farm details | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/v1/farms/{id}` | Delete farm (cascades to all child fields and soil records) | `200 OK` / `404 Not Found` |

### Field Endpoints
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/farms/{farmId}/fields` | Create a new field parcel under a specific farm | `201 Created` |
| `GET` | `/api/v1/farms/{farmId}/fields` | List all fields belonging to a farm | `200 OK` |
| `GET` | `/api/v1/fields/{id}` | Get field by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/api/v1/fields/{id}` | Update field details | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/v1/fields/{id}` | Delete field (cascades to all child soil records) | `200 OK` / `404 Not Found` |

### Soil Record Endpoints
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/fields/{fieldId}/soil-records` | Add a lab test record to a specific field | `201 Created` |
| `GET` | `/api/v1/fields/{fieldId}/soil-records` | List all soil records for a specific field | `200 OK` |
| `GET` | `/api/v1/soil-records/{id}` | Get soil record by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/api/v1/soil-records/{id}` | Update soil record details | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/v1/soil-records/{id}` | Delete soil record | `200 OK` / `404 Not Found` |

---

## 5. Security & Multi-Tenant Data Isolation

AgriTrack enforces strict multi-tenant ownership resolution:
1. **Farms**: Queried by `userId` resolved directly from the authenticated JWT token subject (`user.id`).
2. **Fields**: Queried by `farm.userId == currentUser.id`. If a user attempts to access a field belonging to another farmer, a `ResourceNotFoundException` is raised (`HTTP 404 Not Found`), completely hiding resource existence.
3. **Soil Records**: Queried by `field.farm.userId == currentUser.id`. Unauthorized access requests identically yield `HTTP 404 Not Found`.

---

## 6. Running Tests

Execute all unit and MockMvc tests:
```powershell
.\mvnw.cmd test
```

Execute tests including live MySQL database connectivity:
```powershell
.\mvnw.cmd test -DrunDbTests=true
```

Build executable production JAR:
```powershell
.\mvnw.cmd clean package -DskipTests
```
