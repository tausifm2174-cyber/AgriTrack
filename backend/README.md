# AgriTrack — Spring Boot Backend (Phase 14: Authentication & User Management)

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
  - Robust exception handling for auth errors (401, 403, 409).
  - 27 automated unit and integration tests passing with 100% success.

---

## 2. Technology Stack

- **Language**: Java 21 LTS (Amazon Corretto / OpenJDK)
- **Framework**: Spring Boot 4.1.2 (Current Stable GA Release)
- **Framework Core**: Spring Framework 7.0.x
- **Security**: Spring Security 7.0.x & BCrypt Password Hashing
- **Authentication**: JJWT (Java JWT) 0.12.6 (HMAC-SHA256)
- **Build Tool**: Apache Maven 3.9.16 (bundled with Maven Wrapper `mvnw`)
- **Persistence**: Spring Data JPA & Hibernate 7.4 / 6.6
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
│   │   │   │   ├── HealthController.java          # GET /health probe
│   │   │   │   └── UserController.java            # GET /users/me (protected)
│   │   │   ├── dto/
│   │   │   │   ├── ApiError.java                  # Field-level validation error DTO
│   │   │   │   ├── ApiResponse.java               # Standard API response JSON envelope
│   │   │   │   ├── AuthResponse.java              # JWT authentication response DTO
│   │   │   │   ├── LoginRequest.java              # User login payload DTO
│   │   │   │   ├── RegisterRequest.java           # User registration payload DTO
│   │   │   │   └── UserResponse.java              # Safe user profile DTO
│   │   │   ├── entity/
│   │   │   │   ├── Role.java                      # User roles enum (FARMER, ADMIN)
│   │   │   │   └── User.java                      # JPA entity mapping to 'users' table
│   │   │   ├── exception/
│   │   │   │   ├── EmailAlreadyExistsException.java # HTTP 409 Conflict
│   │   │   │   ├── GlobalExceptionHandler.java    # Centralized @RestControllerAdvice
│   │   │   │   ├── InvalidCredentialsException.java # HTTP 401 Unauthorized
│   │   │   │   ├── JwtAuthenticationException.java # HTTP 401 Unauthorized
│   │   │   │   ├── ResourceNotFoundException.java # HTTP 404 Not Found
│   │   │   │   └── UserInactiveException.java     # HTTP 403 Forbidden
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.java            # Spring Data JPA repository for User
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java               # Registration & login workflows
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
│           ├── GlobalExceptionHandlerTest.java    # Exception handling unit tests
│           ├── HealthControllerTest.java          # MockMvc GET /api/v1/health test
│           ├── JwtUtilTest.java                   # JWT generation, expiration & validation tests
│           └── UserControllerTest.java            # Protected GET /api/v1/users/me tests
├── .env.example                                   # Environment variable reference template
├── mvnw                                           # Linux/macOS Maven wrapper script
├── mvnw.cmd                                       # Windows PowerShell/CMD Maven wrapper
├── pom.xml                                        # Maven dependency manifest
└── README.md                                      # Comprehensive backend documentation
```

---

## 4. Environment Variables Configuration

Set these variables in Windows PowerShell prior to starting the backend:

```powershell
# 1. Database Connection URL
$env:DB_URL="jdbc:mysql://localhost:3306/agritrack_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8"

# 2. Database Dedicated Username (do not use root)
$env:DB_USERNAME="agritrack_user"

# 3. Database Password (the password you created for agritrack_user)
$env:DB_PASSWORD="your_mysql_password_here"

# 4. Server Port (Default is 8080)
$env:SERVER_PORT="8080"

# 5. Frontend Origin for CORS (Vite default is http://localhost:5173)
$env:FRONTEND_ORIGIN="http://localhost:5173"

# 6. JWT Secret Key (minimum 256-bit / 32 characters)
$env:JWT_SECRET="YourCryptographicallyStrongSecretKeyMinimum32CharsLong!"

# 7. JWT Expiration in Milliseconds (Default: 86400000 ms = 24 hours)
$env:JWT_EXPIRATION_MS="86400000"
```

---

## 5. Database Schema & Tables

### Database Initialization:
```powershell
Get-Content .\database\01_create_database.sql | mysql -u root -p
Get-Content .\database\02_create_users_table.sql | mysql -u root -p
```

### Table: `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `full_name` | `VARCHAR(100)` | NOT NULL | Farmer / user display name |
| `email` | `VARCHAR(150)` | NOT NULL, UNIQUE, INDEX | Unique login email |
| `phone` | `VARCHAR(20)` | NULL | Optional contact phone number |
| `password_hash`| `VARCHAR(255)` | NOT NULL | BCrypt hashed password |
| `role` | `VARCHAR(20)` | NOT NULL, DEFAULT 'FARMER' | Access role (`FARMER`, `ADMIN`) |
| `is_active` | `BOOLEAN` | NOT NULL, DEFAULT TRUE | Account activation flag |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last modification timestamp |

---

## 6. Authentication API Endpoints

All endpoints are prefixed with `/api/v1`.

### 1. Register User
* **Method & URL:** `POST /api/v1/auth/register`
* **Access:** Public
* **Request Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "fullName": "Ramesh Kumar",
    "email": "ramesh.farmer@example.com",
    "phone": "9876543210",
    "password": "SecurePassword123"
  }
  ```
* **Success Response (HTTP 201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": 1,
      "fullName": "Ramesh Kumar",
      "email": "ramesh.farmer@example.com",
      "phone": "9876543210",
      "role": "FARMER",
      "active": true,
      "createdAt": "2026-11-13T20:30:25",
      "updatedAt": "2026-11-13T20:30:25"
    },
    "timestamp": "2026-11-13T20:30:25"
  }
  ```

### 2. Login User
* **Method & URL:** `POST /api/v1/auth/login`
* **Access:** Public
* **Request Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "email": "ramesh.farmer@example.com",
    "password": "SecurePassword123"
  }
  ```
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
      "tokenType": "Bearer",
      "expiresIn": 86400000,
      "user": {
        "id": 1,
        "fullName": "Ramesh Kumar",
        "email": "ramesh.farmer@example.com",
        "phone": "9876543210",
        "role": "FARMER",
        "active": true
      }
    },
    "timestamp": "2026-11-13T20:31:11"
  }
  ```

### 3. Get Authenticated User Profile
* **Method & URL:** `GET /api/v1/users/me`
* **Access:** Protected (Requires valid Bearer Token)
* **Request Headers:**
  - `Authorization: Bearer <accessToken>`
* **Success Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "message": "User profile retrieved successfully",
    "data": {
      "id": 1,
      "fullName": "Ramesh Kumar",
      "email": "ramesh.farmer@example.com",
      "phone": "9876543210",
      "role": "FARMER",
      "active": true,
      "createdAt": "2026-11-13T20:30:25",
      "updatedAt": "2026-11-13T20:30:25"
    },
    "timestamp": "2026-11-13T20:31:42"
  }
  ```
* **Unauthorized Response (HTTP 401 Unauthorized):**
  ```json
  {
    "success": false,
    "message": "Full authentication is required to access this resource: Unauthorized",
    "data": null,
    "timestamp": "2026-11-13T20:31:25"
  }
  ```

---

## 7. How to Run and Test the Backend

### Run Automated Tests (No local MySQL required):
```powershell
cd backend
.\mvnw.cmd test
```
*Executes all 27 unit, MockMvc, and JWT security tests.*

### Run Live Database Integration Test (Opt-In):
```powershell
cd backend
.\mvnw.cmd test -DrunDbTests=true
```

### Package Application:
```powershell
cd backend
.\mvnw.cmd package
```

### Start Backend Application:
```powershell
cd backend
$env:DB_USERNAME="agritrack_user"
$env:DB_PASSWORD="your_password"
java -jar target/agritrack-backend-0.0.1-SNAPSHOT.jar
```
*The application starts at `http://localhost:8080/api/v1`.*
