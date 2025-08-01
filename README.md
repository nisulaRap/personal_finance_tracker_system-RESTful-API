[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xIbq4TFL)

# Personal Finance Tracker System - RESTful API

## Overview
This is a secure RESTful API for managing a Personal Finance Tracker System developed using **Express.js (Node.js)**

## Features
### User Roles and Authentication
- **Admin:**  
  - Manage all user accounts, oversee transactions, configure system settings.  
- **Regular User:**  
  - Add, edit, delete personal transactions, set budgets, generate reports.  
- **Security:**  
  - JWT-based Authentication and Session Management.

## Setup Instructions
### 1. Clone the Repository
```sh
git clone https://github.com/SE1020-IT2070-OOP-DSA-25/project-nisulaRap.git
```

### 2. Install Dependencies
```sh
cd backend
npm install
```

### 3. Start the Server
```sh
npm start
```

---

## API Endpoints
### 1. **User Authentication API**
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `http://localhost:8000/auth/register` | Register a new user (Admin/User). |
| **POST** | `http://localhost:8000/auth/register/auth/login` | Login (Admin/User). |
| **GET**  | `http://localhost:8000/auth/register/users/:id` | Get a user by ID (Admin/User). |
| **GET**  | `http://localhost:8000/users` | Admin can retrieve all users. |
| **PUT**  | `http://localhost:8000/users/:id` | Update user account details (Admin/User). |
| **DELETE** | `http://localhost:8000/users/:id` | Admin can delete a user. |

### 2. **Transaction Management API**
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `http://localhost:8000/transactions` | Add a new transaction (Admin/User). |
| **GET**  | `http://localhost:8000/transactions` | Admin can view all transactions, user's see their transaction. |
| **PUT**  | `http://localhost:8000/transactions/:id` | Update a transaction (Admin/User). |
| **DELETE** | `http://localhost:8000/transactions/:id` | Delete a transaction (Admin/User). |

### 3. **Budget Management API**
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `http://localhost:8000/budgets` | Add a new budget (Admin/User). |
| **GET**  | `http://localhost:8000/budgets` | Admin can retrieve all budgets, user's see their budget. |
| **PUT**  | `http://localhost:8000/budgets/:id` | Update a budget(Admin/User). |
| **DELETE** | `http://localhost:8000/budgets/:id` | Delete a budget(Admin/User). |

### 4. **Goal Management API**
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `http://localhost:8000/goals` | Add a new goal (Admin/User). |
| **GET**  | `http://localhost:8000/goals` | Admin can retrieve all goals, user's see their goal. |
| **PUT**  | `http://localhost:8000/goals/:id` | Update a goal(Admin/User). |
| **DELETE** | `http://localhost:8000/goals/:id` | Delete a goal(Admin/User). |

### 5. **Report Management API**
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `http://localhost:8000/reports/generate-reports` | Generate financial reports. |
| **GET**  | `http://localhost:8000/reports/get-reports` | Retrieve generated reports. |

### 6. **Dashboard API**
| Method | Endpoint | Description |
|--------|---------|-------------|
| **GET**  | `http://localhost:8000/dashboards/admins` | Admin dashboard. |
| **GET**  | `http://localhost:8000/dashboards/users` | User dashboard. |

---

## How to Run Tests
### **Unit Testing**
```sh
npx jest authController.test.js --detectOpenHandles
npx jest userController.test.js --detectOpenHandles
npx jest transactionController.test.js --detectOpenHandles
npx jest authMiddleware.test.js --detectOpenHandles
```

### **Integration Testing**
```sh
npx jest auth.integration.test.js --detectOpenHandles
npx jest transaction.integration.test.js --detectOpenHandles
```

### **Security Testing**
```sh
npx jest auth.security.test.js --detectOpenHandles
```

