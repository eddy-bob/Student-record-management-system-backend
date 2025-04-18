# Student Management System - Backend

This is the backend service for the Student Management System built with [NestJS](https://nestjs.com/) and TypeORM. It manages authentication, user roles, student records, and more.

## 🛠️ Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** MySQL (via TypeORM)
- **Authentication:** JWT + Passport
- **ORM:** TypeORM
- **Validation:** class-validator & class-transformer
- **Cache:** cache-manager
- **Testing:** Jest + Supertest
- **Linting & Formatting:** ESLint + Prettier

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/student-management-system-be.git
cd student-management-system-be
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=
# Admin
SUPER_ADMIN_PASSWORD=
SUPER_ADMIN_EMAIL=

# Database Configuration
MYSQL_HOST=
MYSQL_PORT=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
SYNCHRONIZE=

# Cache Configuration
CACHE_TTL=300000
# Rate Limiter
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW_MS=120000

# JWT
JWT_SECRET=
JWT_EXPIRE=
```

### 4. Run the App

- **Development Mode**

```bash
npm run start:dev
```

- **Production Mode**

```bash
npm run build
npm run start:prod
```

---

## 📦 NPM Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `start`              | Start app in production mode       |
| `start:dev`          | Start app with live reload         |
| `start:debug`        | Start app in debug mode            |
| `build`              | Compile the TypeScript code        |
| `format`             | Format code using Prettier         |
| `lint`               | Lint and fix code with ESLint      |
| `test`               | Run unit tests with Jest           |
| `test:watch`         | Run tests in watch mode            |
| `test:cov`           | Run tests with coverage report     |
| `test:e2e`           | Run end-to-end tests               |
| `migration:generate` | Generate a new database migration  |
| `migration:create`   | Create a blank migration file      |
| `migration:run`      | Apply pending migrations to the DB |
| `migration:revert`   | Revert the last executed migration |
| `seed`               | Run the database seeder script     |

---

## 🗃️ Migrations

### Generate a New Migration

```bash
npm run migration:generate -- src/migrations/CreateUsersTable
```

### Run Migrations

```bash
npm run migration:run
```

### Revert Last Migration

```bash
npm run migration:revert
```

---

## 📂 Project Structure

```
src/
├── auth/              # Authentication modules
├── users/             # User management
├── students/          # Student modules
├── config/            # App configuration (DB, ENV, etc.)
├── scripts/           # Seed data scripts
├── main.ts            # App entry point
└── app.module.ts      # Root module
```

---

## 🧪 Testing

Use Jest for unit and e2e testing:

```bash
npm run test
npm run test:e2e
```

---

## 📄 License

This project is **UNLICENSED** and intended for internal or educational use.

---

## 👨‍💻 Author

Developed by [Your Name]. Contributions are welcome!
