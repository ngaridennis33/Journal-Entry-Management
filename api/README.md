# Jornal Management App API

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🕸️ [Snippets](#snippets)
6. 🔗 [Links](#links)

# introduction

# Tech-stack

# Features

# Quick start


# Setting Up Prisma with PostgreSQL
#### 1. Start by installing the Prisma CLI with the following command:

```bash
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

## Start application with docker
```bash
docker compose up -d
```

# Running the app
```tsc



