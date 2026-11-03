# AgriTrack — Spring Boot Backend (Phase 13 Foundation)

Welcome to the backend service of **AgriTrack – Smart Farm Management System**. This backend is implemented as a clean, modular REST API using **Java 21 LTS** and **Spring Boot 4.1.x**, backed by **MySQL 8.0**.

---

## 1. Backend Overview

AgriTrack employs a three-tier architecture:
1. **Presentation Layer**: React 19 + Vite frontend (`/frontend`).
2. **Application Layer**: Java Spring Boot REST API (`/backend`), serving endpoints at `/api/v1/*`.
3. **Data Layer**: MySQL 8.0 relational database (`/database`), accessed via Spring Data JPA and Hibernate.

Phase 13 establishes the foundational backend infrastructure:
- Structured package hierarchy ready for future business domains.
- Standardized, consistent API response envelope (`ApiResponse<T>`).
- Centralized exception handling (`@RestControllerAdvice`).
- CORS policies allowing local Vite frontend origin access (`http://localhost:5173`).
- MySQL datasource configuration with environment variable abstraction and dedicated least-privilege user security.
- Verification probe via `GET /api/v1/health`.
- Test suite with opt-in live database verification.

---

## 2. Technology Stack

- **Language**: Java 21 LTS (Oracle JDK / OpenJDK)
- **Framework**: Spring Boot 4.1.2 (Current Stable GA Release)
- **Framework Core**: Spring Framework 7.0.x
- **Build Tool**: Apache Maven 3.9.16 (bundled with Maven Wrapper `mvnw`)
- **Persistence**: Spring Data JPA & Hibernate 7.4 / 6.6
- **Database Driver**: MySQL Connector/J 8.3+
- **Validation**: Jakarta Validation / Hibernate Validator (Spring Boot Starter Validation)
- **Testing**: JUnit 5 Jupiter, MockMvc, Spring Boot Test

---

## 3. Project Package Structure

```
backend/
├── .mvn/wrapper/                                  # Maven Wrapper runtime binaries & properties
│   ├── maven-wrapper.jar
│   └── maven-wrapper.properties
├── src/
│   ├── main/
│   │   ├── java/com/agritrack/
│   │   │   ├── AgriTrackApplication.java          # Spring Boot main entrypoint
│   │   │   ├── config/
│   │   │   │   └── CorsConfig.java                # CORS registry (WebMvcConfigurer)
│   │   │   ├── controller/
│   │   │   │   └── HealthController.java          # GET /api/v1/health probe
│   │   │   ├── dto/
│   │   │   │   ├── ApiResponse.java               # Standard API response JSON envelope
│   │   │   │   └── ApiError.java                  # Field-level validation error DTO
│   │   │   ├── entity/
│   │   │   │   └── package-info.java              # [Phase 14+] Future JPA domain entities
│   │   │   ├── exception/
│   │   │   │   ├── GlobalExceptionHandler.java    # Centralized @RestControllerAdvice
│   │   │   │   └── ResourceNotFoundException.java # Reusable HTTP 404 domain exception
│   │   │   ├── repository/
│   │   │   │   └── package-info.java              # [Phase 14+] Future Spring Data JPA repos
│   │   │   ├── service/
│   │   │   │   └── package-info.java              # [Phase 14+] Future business services
│   │   │   └── util/
│   │   │       └── package-info.java              # Future utility & formatting helpers
│   │   └── resources/
│   │       └── application.properties             # Context-path, datasource, and JPA config
│   └── test/
│       └── java/com/agritrack/
│           ├── AgriTrackApplicationTests.java     # Spring context bootstrap verification
│           ├── DatabaseConnectionTest.java        # Live MySQL connectivity (opt-in)
│           ├── HealthControllerTest.java          # MockMvc GET /api/v1/health test
│           └── GlobalExceptionHandlerTest.java    # Exception handling unit tests
├── .env.example                                   # Environment variable reference template
├── mvnw                                           # Linux/macOS Maven wrapper script
├── mvnw.cmd                                       # Windows PowerShell/CMD Maven wrapper
├── pom.xml                                        # Maven dependency manifest
└── README.md                                      # Comprehensive backend documentation
```

### Intended Future Package Responsibilities

| Package | Responsibility |
| :--- | :--- |
| `config` | Spring configuration beans (Security, CORS, WebMvc, Auditing). |
| `controller` | REST API controllers exposing HTTP endpoints under `/api/v1/*`. |
| `dto` | Request and response Data Transfer Objects (Payloads, Projections). |
| `entity` | Relational database entity models annotated with JPA `@Entity`. |
| `exception` | Custom application exceptions and global exception interceptors. |
| `repository` | Data access layer using Spring Data `JpaRepository<T, ID>`. |
| `service` | Business logic, transaction boundaries, validations, and calculations. |
| `util` | Reusable utilities (date calculators, math helpers, text formatters). |

---

## 4. Prerequisites

Before running the backend, ensure you have:
1. **Java 21 LTS** installed (`java -version`).
2. **MySQL Server 8.0** installed and running on port 3306 (`Get-Service MySQL80`).
3. Apache Maven 3.9+ or the included `.\mvnw.cmd` wrapper.

---

## 5. MySQL Database & Dedicated Runtime User Setup

To follow security best practices, **do not use the MySQL `root` superuser** for regular application operation. The runtime application user should possess only data manipulation privileges (DML) and **no administrative or schema modification rights**.

### Step 1: Initialize Database (PowerShell Compatible)
In Windows PowerShell from the project root:
```powershell
Get-Content .\database\01_create_database.sql | mysql -u root -p
```
*(Enter your MySQL root password when prompted)*

### Step 2: Create the Dedicated Application Runtime User
Open MySQL CLI as `root`:
```powershell
mysql -u root -p
```
Run the following SQL commands (replace `YourSecurePasswordHere` with your chosen password):
```sql
CREATE USER IF NOT EXISTS 'agritrack_user'@'localhost' IDENTIFIED BY 'YourSecurePasswordHere';
-- Grant ONLY runtime data manipulation privileges (Least Privilege Principle)
GRANT SELECT, INSERT, UPDATE, DELETE ON `agritrack_db`.* TO 'agritrack_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Verify that the dedicated user can connect:
```powershell
mysql -u agritrack_user -p -e "USE agritrack_db; SELECT DATABASE();"
```

### Future Schema Migrations (Migration-User Approach)
If automated schema migrations (e.g. Flyway / Liquibase) or structural DDL updates are introduced in future phases, a separate administrative migration user (e.g., `agritrack_migrator`) with DDL privileges (`CREATE`, `ALTER`, `DROP`, `INDEX`, `REFERENCES`) should be used strictly during deployment/migration runs, keeping `agritrack_user` restricted to DML operations.

---

## 6. Environment Variable Setup on Windows PowerShell

### Critical Distinction: Environment Variables vs. `.env` Files
> [!IMPORTANT]
> **Spring Boot does NOT automatically load `.env` files.**
> The included `backend/.env.example` file is provided solely as a reference template and documentation aid. 
> To configure Spring Boot locally, configure PowerShell environment variables (`$env:VARIABLE_NAME = "value"`).

In Windows PowerShell, set the following configuration variables prior to starting the application:

```powershell
# 1. Database Connection URL
$env:DB_URL="jdbc:mysql://localhost:3306/agritrack_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8"

# 2. Database Dedicated Username (do not use root)
$env:DB_USERNAME="agritrack_user"

# 3. Database Password (the password you created for agritrack_user)
$env:DB_PASSWORD="YourSecurePasswordHere"

# 4. Server Port (Default is 8080)
$env:SERVER_PORT="8080"

# 5. Frontend Origin for CORS (Vite default is http://localhost:5173)
$env:FRONTEND_ORIGIN="http://localhost:5173"
```

---

## 7. How to Test the Backend

From the `backend/` directory:

### Normal Test Suite (Can run on any machine without local MySQL)
```powershell
.\mvnw.cmd test
```
*Runs all unit and controller tests. The live database integration test is automatically skipped so builds never fail on machines without MySQL.*

### Live Database Integration Test (Explicitly Opt-In)
When you want to verify that the application establishes a real connection to your live MySQL database, opt-in using any of these methods:

**Method 1 (System Property):**
```powershell
.\mvnw.cmd test -DrunDbTests=true
```

**Method 2 (Maven Profile):**
```powershell
.\mvnw.cmd test -P live-db
```

**Method 3 (Environment Variable):**
```powershell
$env:RUN_DB_TESTS="true"
.\mvnw.cmd test
```

### Compile and Package into Executable JAR:
```powershell
.\mvnw.cmd package
```

The resulting executable JAR will be located at:
`backend/target/agritrack-backend-0.0.1-SNAPSHOT.jar`

---

## 8. How to Run the Backend

You can run the backend using either of the following methods:

### Method A: Using Maven Wrapper (Development mode)
```powershell
cd backend
$env:DB_USERNAME="agritrack_user"
$env:DB_PASSWORD="YourSecurePasswordHere"
.\mvnw.cmd spring-boot:run
```

### Method B: Using the packaged JAR
```powershell
cd backend
$env:DB_USERNAME="agritrack_user"
$env:DB_PASSWORD="YourSecurePasswordHere"
java -jar target/agritrack-backend-0.0.1-SNAPSHOT.jar
```

When started, you should see:
```
Tomcat started on port 8080 (http) with context path '/api/v1'
Started AgriTrackApplication in X.XXX seconds
```

---

## 9. How to Test the Health Endpoint

Verify that the backend is responding:

### Via Browser:
Navigate to:
[http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health)

### Via Windows PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/health" -Method Get | ConvertTo-Json -Depth 5
```

### Expected Output:
```json
{
  "success": true,
  "message": "AgriTrack API is operational",
  "data": {
    "application": "AgriTrack Backend",
    "status": "UP",
    "serverTime": "2026-11-03T21:34:48"
  },
  "timestamp": "2026-11-03T21:34:48"
}
```

---

## 10. Common Startup & MySQL Errors Troubleshooting

### 1. `Access denied for user 'agritrack_user'@'localhost'`
- **Cause**: The password specified in `$env:DB_PASSWORD` does not match the password granted to `agritrack_user`.
- **Fix**: Reset the password in MySQL:
  ```powershell
  mysql -u root -p -e "ALTER USER 'agritrack_user'@'localhost' IDENTIFIED BY 'NewPassword'; FLUSH PRIVILEGES;"
  $env:DB_PASSWORD="NewPassword"
  ```

### 2. `Unknown database 'agritrack_db'`
- **Cause**: The database has not been initialized yet.
- **Fix**: Run the initialization SQL script:
  ```powershell
  Get-Content .\database\01_create_database.sql | mysql -u root -p
  ```

### 3. `Communications link failure / Connection refused`
- **Cause**: The MySQL service is stopped.
- **Fix**: Start the MySQL Windows service:
  ```powershell
  Start-Service MySQL80
  ```

### 4. `Port 8080 already in use`
- **Cause**: Another process or previous Spring Boot instance is holding port 8080.
- **Fix**: Find and kill the process holding port 8080:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process -Force
  ```
  Or change the port:
  ```powershell
  $env:SERVER_PORT="8081"
  ```

---

## 11. Current API Response Format

All AgriTrack REST APIs follow a standardized JSON envelope:

### Success Response Envelope:
```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": { ... },
  "timestamp": "2026-11-03T12:00:00"
}
```

### Error Response Envelope:
```json
{
  "success": false,
  "message": "Descriptive error message",
  "data": null,
  "timestamp": "2026-11-03T12:00:00"
}
```

---

## 12. Intentionally Deferred to Later Phases

To maintain a disciplined, testable foundation, the following features are intentionally **not** included in Phase 13 and will be introduced in subsequent phases:
- User authentication, registration, login, and password hashing (Phase 14).
- JWT token issuance, filter chains, and Spring Security (Phase 14).
- Entity mappings and JPA repositories for Farms, Fields, Crops, Soil, Activities, etc.
- Business REST controllers and CRUD service implementations.
- Mandi / APMC and weather integrations.
- Replacing frontend demo mock data with live API calls.
