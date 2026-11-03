# AgriTrack — Smart Farm Management System

AgriTrack is a modern, modular agricultural management web application designed to empower Indian farmers, farm managers, and agricultural enterprises with data-driven decision-making tools.

---

## 1. Project Introduction

AgriTrack delivers a comprehensive digital platform that streamlines farm operations, field parcel monitoring, crop lifecycle planning, weather forecasting, agronomic recommendations, harvests, agricultural trade, and financial ledgering. Built using a robust three-tier architecture, AgriTrack connects a modern React frontend with a secure Spring Boot REST API and MySQL database.

---

## 2. Project Features

AgriTrack is structured into core operational modules:

1. **Executive Dashboard**: Key performance indicators, acreage summaries, financial balances, weather snapshot, and recent activities.
2. **Farm Management**: Farm entities, geographic locations, total land area, and operational status.
3. **Field & Soil Management**: Parcel zoning, soil testing history (pH, N-P-K, organic carbon, moisture), and soil health indices.
4. **Crop Management & Lifecycle**: Sowing logs, variety tracking, stage-based lifecycle progress, and yield forecasting.
5. **Crop Calendar & Milestones**: Interactive schedule of agronomic milestones from land preparation to harvest.
6. **Weather & Irrigation Insights**: Real-time conditions, 7-day agricultural forecast, rainfall tracking, and smart irrigation advisories.
7. **Rule-Based Agronomic Advisory**: Rule engine providing localized recommendations for fertilization, pest control, and soil treatment.
8. **Harvest Management**: Batch collection, storage locations, quality grading, and yield metrics.
9. **Sales & APMC Market Prices**: Mandi price benchmarks across Indian agricultural markets and commercial sales transactions.
10. **Financial Management (Expenses, Revenue, Profit & Loss)**: Farm expense categorization, revenue receipts, and automated profit/loss calculation.
11. **Activities & Task Management**: Work scheduling, equipment tracking, chemical application logs, and status tracking.
12. **Notification Center**: Operational alerts, weather advisories, harvest reminders, and priority sorting.
13. **User Profile & Preferences**: Farmer credentials, land holdings, measurement unit standards (acres/hectares, quintals/kg), and UI preferences.
14. **12-Language Multilingual Localization**: Full UI translation across 12 major Indian languages without page reloads or route mutation.

---

## 3. Technologies Used

### Frontend (Presentation Layer)
- **Framework**: React 19 + Vite
- **Routing**: React Router 7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Internationalization**: i18next + react-i18next + i18next-browser-languagedetector
- **Code Quality**: ESLint

### Backend (Application Layer)
- **Language**: Java 21 LTS
- **Framework**: Spring Boot 4.1.2
- **Framework Core**: Spring Framework 7.0.x
- **Build Tool**: Apache Maven 3.9.16 (with Maven Wrapper `mvnw`)
- **Persistence**: Spring Data JPA & Hibernate ORM 7.4 / 6.6
- **Database Driver**: MySQL Connector/J 8.3+
- **Validation**: Jakarta Validation / Hibernate Validator
- **Testing**: JUnit 5 Jupiter, MockMvc, Spring Boot Test

### Database (Data Layer)
- **RDBMS**: MySQL Server 8.0+
- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`

---

## 4. Project Folder Structure

```
AgriTrack/
├── .gitignore                      # Git exclusion rules for node_modules, build outputs, and secrets
├── README.md                       # Root project documentation
├── backend/                        # Spring Boot REST API
│   ├── .env.example                # Example environment variable template (for reference only)
│   ├── mvnw                        # Maven wrapper script (Unix/macOS)
│   ├── mvnw.cmd                    # Maven wrapper script (Windows)
│   ├── pom.xml                     # Maven build configuration and dependencies
│   ├── README.md                   # Comprehensive backend documentation
│   └── src/
│       ├── main/
│       │   ├── java/com/agritrack/
│       │   │   ├── AgriTrackApplication.java       # Spring Boot main class
│       │   │   ├── config/CorsConfig.java          # Cross-Origin Resource Sharing configuration
│       │   │   ├── controller/HealthController.java# GET /api/v1/health probe
│       │   │   ├── dto/ApiResponse.java            # Standardized API response envelope
│       │   │   ├── dto/ApiError.java               # Validation error item DTO
│       │   │   ├── entity/package-info.java        # Future JPA entities (Phase 14+)
│       │   │   ├── exception/GlobalExceptionHandler.java # @RestControllerAdvice
│       │   │   ├── exception/ResourceNotFoundException.java # Domain 404 exception
│       │   │   ├── repository/package-info.java    # Future JPA repositories (Phase 14+)
│       │   │   ├── service/package-info.java       # Future business services (Phase 14+)
│       │   │   └── util/package-info.java          # Utility classes
│       │   └── resources/application.properties    # Context path, MySQL, and HikariCP settings
│       └── test/
│           └── java/com/agritrack/
│               ├── AgriTrackApplicationTests.java  # Application context verification
│               ├── DatabaseConnectionTest.java     # Opt-in live MySQL connection test
│               ├── HealthControllerTest.java       # Health endpoint mock tests
│               └── exception/GlobalExceptionHandlerTest.java # Exception handling tests
├── database/                       # Database initialization and migration scripts
│   └── 01_create_database.sql      # Database & dedicated runtime user creation script
└── frontend/                       # React 19 + Vite frontend
    ├── .env.example                # Example frontend environment variables
    ├── eslint.config.js            # ESLint rules and configuration
    ├── index.html                  # HTML entrypoint
    ├── package.json                # Frontend dependencies and npm scripts
    ├── README.md                   # Frontend documentation
    ├── vite.config.js              # Vite bundler configuration
    ├── public/                     # Static public assets
    └── src/
        ├── App.css                 # Global styling
        ├── App.jsx                 # Application layout and routing
        ├── main.jsx                # React DOM mount point
        ├── components/             # Reusable UI components across all modules
        ├── data/                   # Interactive demo dataset for frontend modules
        ├── i18n/                   # i18next configuration and 12-language JSON locales
        ├── pages/                  # Top-level view pages for all 15 routes
        ├── services/api.js         # Central Axios client configured for http://localhost:8080/api/v1
        └── utils/                  # Formatting, math, and display label helpers
```

---

## 5. Prerequisites

Before running AgriTrack locally, ensure you have the following installed:
- **Node.js**: v18.0.0 or higher & **npm** (`node -v`, `npm -v`)
- **Java**: Java 21 LTS (`java -version`)
- **MySQL Server**: 8.0 or higher running on port 3306 (`Get-Service MySQL80`)
- **Git**: (`git --version`)

---

## 6. How to Configure MySQL

### 1. Initialize the Database
Ensure your MySQL service is running. From the project root in Windows PowerShell, execute:
```powershell
Get-Content .\database\01_create_database.sql | mysql -u root -p
```
*(Enter your MySQL root password when prompted)*

This creates the `agritrack_db` database with `utf8mb4` encoding and `utf8mb4_unicode_ci` collation.

### 2. Create the Dedicated Application Runtime User
For database security (Principle of Least Privilege), the application runtime user should only have data manipulation rights (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) and no schema modification or administrative privileges.

Log into MySQL as root:
```powershell
mysql -u root -p
```
Execute:
```sql
CREATE USER IF NOT EXISTS 'agritrack_user'@'localhost' IDENTIFIED BY 'YourSecurePasswordHere';
GRANT SELECT, INSERT, UPDATE, DELETE ON `agritrack_db`.* TO 'agritrack_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 7. How to Configure Backend Environment Variables

> [!IMPORTANT]
> Spring Boot does **not** automatically load `.env` files. The file `backend/.env.example` is provided strictly as a reference guide.
> Configure environment variables in Windows PowerShell before running the backend:

```powershell
# MySQL JDBC Connection URL
$env:DB_URL="jdbc:mysql://localhost:3306/agritrack_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8"

# Dedicated MySQL Username
$env:DB_USERNAME="agritrack_user"

# Dedicated MySQL Password
$env:DB_PASSWORD="YourSecurePasswordHere"

# Server Port (defaults to 8080 if omitted)
$env:SERVER_PORT="8080"

# Allowed CORS Origin for Frontend
$env:FRONTEND_ORIGIN="http://localhost:5173"
```

---

## 8. How to Start the Spring Boot Backend

From the `backend/` directory in PowerShell:

```powershell
cd backend
$env:DB_USERNAME="agritrack_user"
$env:DB_PASSWORD="YourSecurePasswordHere"
.\mvnw.cmd spring-boot:run
```

Alternatively, run the pre-built packaged JAR:
```powershell
cd backend
$env:DB_USERNAME="agritrack_user"
$env:DB_PASSWORD="YourSecurePasswordHere"
java -jar target/agritrack-backend-0.0.1-SNAPSHOT.jar
```

The backend starts at: `http://localhost:8080/api/v1`

### Verify Health Check:
Open in browser or test in PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/health" -Method Get | ConvertTo-Json
```
Expected response:
```json
{
  "success": true,
  "message": "AgriTrack API is operational",
  "data": {
    "status": "UP",
    "timestamp": "...",
    "application": "AgriTrack Backend",
    "version": "1.0.0"
  },
  "errors": null,
  "meta": null
}
```

---

## 9. How to Start the React Frontend

From the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

The development server starts at: `http://localhost:5173`

---

## 10. How to Run Frontend Lint and Build

Inside the `frontend/` directory:

### Run ESLint:
```bash
npm run lint
```

### Run Production Build:
```bash
npm run build
```
Build output is generated cleanly into `frontend/dist/`.

---

## 11. How to Run Backend Tests

From the `backend/` directory:

### Standard Maven Test Suite (Portable / No Local MySQL required):
```powershell
cd backend
.\mvnw.cmd clean test
```
*Executes all unit and WebMvc mock tests (8 tests: 7 run, 1 opt-in DB test skipped).*

### Live MySQL Database Integration Test (Explicitly Opt-In):
To execute the live database connectivity test against your local running MySQL instance:
```powershell
cd backend
.\mvnw.cmd test -DrunDbTests=true
# Or using the Maven profile:
.\mvnw.cmd test -P live-db
```
*All 8 tests run and pass, verifying live SQL queries against `agritrack_db` using `agritrack_user`.*

### Package the Backend JAR:
```powershell
cd backend
.\mvnw.cmd clean package
```

---

## 12. Multilingual Localization (12 Indian Regional Languages)

AgriTrack supports 12 Indian regional languages with 100% complete translation dictionaries across all components:

| Language | Code | Native Script | English Display Name |
| :--- | :--- | :--- | :--- |
| **English** *(Default)* | `en` | English | English |
| **Hindi** | `hi` | हिन्दी | Hindi |
| **Kannada** | `kn` | ಕನ್ನಡ | Kannada |
| **Telugu** | `te` | తెలుగు | Telugu |
| **Tamil** | `ta` | தமிழ் | Tamil |
| **Marathi** | `mr` | मराठी | Marathi |
| **Bengali** | `bn` | বাংলা | Bengali |
| **Gujarati** | `gu` | ગુજરાતી | Gujarati |
| **Malayalam** | `ml` | മലയാളം | Malayalam |
| **Punjabi** | `pa` | ਪੰਜਾਬੀ | Punjabi |
| **Odia** | `or` | ଓଡ଼ିଆ | Odia |
| **Assamese** | `as` | অসমীয়া | Assamese |

Language preference is persisted in browser `localStorage` under `agritrack-language` and selectable at any time via the top navigation bar or user profile settings.

---

## 13. Current Project Implementation Status

- **Phases 1–12 (Frontend & UI Foundation)**: **COMPLETE**.
  All 14 frontend functional modules and the 12-language localization architecture are fully built, styled, interactive, and responsive.
  > [!NOTE]
  > Frontend modules currently operate using rich, realistic local demo state (`frontend/src/data/`) to enable comprehensive UI/UX evaluation and demonstration prior to backend endpoint integration.
- **Phase 13 (Backend Foundation & MySQL)**: **COMPLETE**.
  Java 21 LTS, Spring Boot 4.1.2 foundation, Spring Data JPA, HikariCP, MySQL 8.0 connectivity, global error handling, CORS policies, health check probe `/api/v1/health`, and least-privilege runtime user configuration are fully implemented and verified.
- **Phase 14+ (Future Implementation — Not Yet Implemented)**:
  - User authentication, registration, login, and password hashing.
  - Spring Security filter chains and JWT Bearer tokens.
  - JPA domain entities, relational mappings, and Spring Data repositories.
  - Business REST controllers and CRUD service implementations.
  - Live API integration connecting the frontend Axios client to backend database endpoints.
