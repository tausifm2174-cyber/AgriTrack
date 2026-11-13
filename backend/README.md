# AgriTrack — Spring Boot Backend (Phase 17: Activity & Irrigation Management Backend APIs)

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
  - 113 automated unit, mock, and integration tests passing with 100% success.

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
│   │   │   │   ├── HealthController.java          # GET /health probe
│   │   │   │   ├── IrrigationController.java      # /irrigation and /fields/{fieldId}/irrigation CRUD
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
│   │   │   │   ├── IrrigationRequest.java         # Irrigation schedule payload DTO
│   │   │   │   ├── IrrigationResponse.java        # Irrigation schedule response DTO
│   │   │   │   ├── LoginRequest.java              # User login payload DTO
│   │   │   │   ├── RegisterRequest.java           # User registration payload DTO
│   │   │   │   ├── SoilRecordRequest.java         # Soil record payload DTO
│   │   │   │   ├── SoilRecordResponse.java        # Soil record response DTO
│   │   │   │   └── UserResponse.java              # Safe user profile DTO
│   │   │   ├── entity/
│   │   │   │   ├── Activity.java                  # JPA entity mapping to 'activities' table
│   │   │   │   ├── CropCycle.java                 # JPA entity mapping to 'crop_cycles' table
│   │   │   │   ├── Farm.java                      # JPA entity mapping to 'farms' table
│   │   │   │   ├── Field.java                     # JPA entity mapping to 'fields' table
│   │   │   │   ├── IrrigationSchedule.java        # JPA entity mapping to 'irrigation_schedules' table
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
│   │   │   │   ├── ActivityRepository.java        # Spring Data JPA repository for Activity
│   │   │   │   ├── CropCycleRepository.java       # Spring Data JPA repository for CropCycle
│   │   │   │   ├── FarmRepository.java            # Spring Data JPA repository for Farm
│   │   │   │   ├── FieldRepository.java           # Spring Data JPA repository for Field
│   │   │   │   ├── IrrigationScheduleRepository.java # Spring Data JPA repository for IrrigationSchedule
│   │   │   │   ├── SoilRecordRepository.java      # Spring Data JPA repository for SoilRecord
│   │   │   │   └── UserRepository.java            # Spring Data JPA repository for User
│   │   │   ├── service/
│   │   │   │   ├── ActivityService.java           # Activity business logic with user isolation
│   │   │   │   ├── AuthService.java               # Registration & login workflows
│   │   │   │   ├── CropCycleService.java          # Crop cycle business logic with user isolation
│   │   │   │   ├── FarmService.java               # Farm business logic with user isolation
│   │   │   │   ├── FieldService.java              # Field business logic with user isolation
│   │   │   │   ├── IrrigationService.java         # Irrigation business logic with user isolation
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
│           ├── HealthControllerTest.java          # MockMvc GET /api/v1/health test
│           ├── IrrigationControllerTest.java      # Irrigation endpoint tests with Bearer tokens
│           ├── IrrigationServiceTest.java         # Irrigation business logic & ownership isolation tests
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

## 4. REST API Reference (Phase 17 Endpoints)

All endpoints require standard Bearer token authentication:
`Authorization: Bearer <access_token>`

### Activity Endpoints
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/fields/{fieldId}/activities` | Log a new field activity | `201 Created` |
| `GET` | `/api/v1/fields/{fieldId}/activities` | List all activities for a specific field | `200 OK` |
| `GET` | `/api/v1/activities` | List all activities belonging to the authenticated user | `200 OK` |
| `GET` | `/api/v1/activities/{id}` | Get activity by ID (returns 404 if owned by another user) | `200 OK` / `404 Not Found` |
| `PUT` | `/api/v1/activities/{id}` | Update activity details | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/v1/activities/{id}` | Delete activity | `200 OK` / `404 Not Found` |

### Irrigation Endpoints
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/fields/{fieldId}/irrigation` | Schedule a precision irrigation run | `201 Created` |
| `GET` | `/api/v1/fields/{fieldId}/irrigation` | List all irrigation schedules for a specific field | `200 OK` |
| `GET` | `/api/v1/irrigation` | List all irrigation schedules belonging to the authenticated user | `200 OK` |
| `GET` | `/api/v1/irrigation/{id}` | Get irrigation schedule by ID (returns 404 if owned by another user) | `200 OK` / `404 Not Found` |
| `PUT` | `/api/v1/irrigation/{id}` | Update irrigation schedule details | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/v1/irrigation/{id}` | Delete irrigation schedule | `200 OK` / `404 Not Found` |

---

## 5. Security & Multi-Tenant Data Isolation

AgriTrack enforces strict multi-tenant ownership resolution:
1. **Farms**: Queried by `userId` resolved directly from the authenticated JWT token subject (`user.id`).
2. **Fields**: Queried by `farm.userId == currentUser.id`.
3. **Soil Records**: Queried by `field.farm.userId == currentUser.id`.
4. **Crop Cycles**: Queried by `field.farm.userId == currentUser.id`.
5. **Activities**: Queried by `field.farm.userId == currentUser.id`.
6. **Irrigation Schedules**: Queried by `field.farm.userId == currentUser.id`.
7. **Cross-Field Validation**: If an activity or irrigation schedule request supplies a `cropCycleId`, the service confirms that `cropCycle.getField().getId().equals(field.getId())` and belongs to the current user; mismatches are rejected immediately with 400 Bad Request or 404 Not Found.

---

## 6. Running Tests

Execute all unit and MockMvc tests:
```powershell
cd backend
.\mvnw.cmd test
```

Execute tests including live MySQL database connectivity:
```powershell
cd backend
.\mvnw.cmd test -DrunDbTests=true
```

Build executable production JAR:
```powershell
cd backend
.\mvnw.cmd package -DskipTests
```
