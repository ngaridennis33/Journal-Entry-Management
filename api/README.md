# Jornal Management App API

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🕸️ [Snippets](#snippets)

# Introduction
Welcome to the DayNote API! This API provides a robust backend for the DayNote journaling platform, built with Express and TypeScript for strong type safety and scalable architecture. We use PostgreSQL for reliable data storage and Redis for efficient caching. Security is a top priority, with JWT securing routes and authenticating users.

Prisma ORM enables seamless, type-safe database interactions, and NodeMailer handles essential email functions like account verification and password recovery.

# Tech-stack
* Typescript
* PostgreSQL
* Redis Cache
* JWT
* Prisma ORM
* NodeMailer
* Zod
* cookie-parser
* bcryptjs

# Features
- Express & TypeScript: Robust backend framework with strong type safety.
- PostgreSQL: Reliable and scalable relational database.
- Redis Cache: Efficient caching to improve performance.
- JWT Authentication: Secure routes and authenticate users.
- Prisma ORM: Type-safe database interactions.
- NodeMailer: Email sending capabilities for user notifications.
- Zod: Type-safe schema validation.
- cookie-parser: Parses cookies attached to the client request object.
- bcryptjs: Secure password hashing.

## Routes
#### Authentication Routes
* POST /register - Register a new user.
* POST /login - Login an existing user.
* POST /refresh - Refresh the access token.
* GET /logout - Logout the current user.
* GET /verifyemail/:verificationCode - Verify user's email address.
* POST /forgotpassword - Initiate password reset process.
* PATCH /resetpassword/:resetToken - Reset the user's password.

#### Journal Routes
* POST / - Create a new journal entry.
* GET / - Retrieve all journal entries.
* GET /:id - Retrieve a specific journal entry by ID.
* PUT /:id - Update a specific journal entry by ID.
* GET /category/:category - Retrieve journal entries by category.
* DELETE /delete/:id - Delete a specific journal entry by ID.

#### User Routes
* GET /me - Retrieve the current user's information.

# Quick start
### 1. Clone the Repository
Use git clone to clone the repository to your local machine.
```bash
git clone mobile
```
#### 2. Change to the Project Directory
Navigate into the cloned project directory.
```bash
    cd mobile
```
### 3. Install Dependencies
Install all the project dependencies listed in the package.json file.
```bash
    npm install
```

#### Run project
```bash
    npm run start
```

## Start Project from scratch:
###  1. Initialize the project
Create a new directory for your project and initialize it with npm:
```bash
mkdir my-typescript-app
cd my-typescript-app
npm init -y
```

### 2. Initialize Typescript and node
TypeScript is the language we will use, and ts-node allows us to run TypeScript directly.
```bash
npm install typescript ts-node @types/node --save-dev
```

### 3. Create a `tsconfig.json` file
The tsconfig.json file specifies the root files and the compiler options required to compile the project. Create this file in the root directory with the following content:
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

### 4. Create the project structure
Create the necessary directories and files:
```bash
mkdir src
touch src/index.ts
```

## Setting Up Prisma with PostgreSQL
#### 1. Start by installing the Prisma CLI with the following command:

```bash![micro](https://github.com/ngaridennis33/Journal-Entry-Management/blob/main/images/Week.png)
    npm install prisma --save-dev
```
#### 2. Defining Your Data Model and Creating Database Tables
```bash 
    npx prisma init --datasource-provider postgresql
```
#### 3. DeFine the Data model 
* Navigate to the prisma/schema.prisma file in your project directory and define your database schema using Prisma's intuitive schema language

#### 4. Generate a Prisma client
```bash
npx prisma generate
```

#### 5.Run Migrations
With your data model defined, apply the changes to your postgres database.
```bash
npx prisma migrate dev --name init
```
* Apply the changes by running,
```bash
npx prisma migrate dev
```

#### 6. Exploring Prisma Client Queries in a Plain Script

* Install Prisma Client as development dependencies in your project:

```bash
npm install @prisma/client --save-dev
```

#### 7. View Data in the database
This will pull up your browser with a look into your database.
Port: 5555
```bash
npx prisma studio
```
#### 8. Install other pproject dependancies
> Install the dependacies in the teck stack

## Start application with docker
```bash
    docker compose up -d
```

### Running Migrations after Updating the prisma schema 
```bash
npx prisma migrate dev --name add-user-relation-to-journal
```

# Running the app
```npm run start```

# Database Design
Below are the images of the design for the database.
* [Screenshots](#camera-screenshots)

![micro](https://github.com/ngaridennis33/Journal-Entry-Management/blob/main/images/journal.png)
