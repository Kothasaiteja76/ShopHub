# Product Requirements Document (PRD)

## ShopHub API Backend V1

---

### 1. Product Overview

**Product Name:** ShopHub API Backend
**Version:** 1.0.0
**Product Type:** RESTful API Service for E-Commerce Platform

The E-Commerce API Backend is a secure and scalable RESTful API service that powers a full-featured online shopping platform. It enables users to **browse products, manage carts, place orders, and make payments**, while providing administrators with complete control over the platform.

The system implements **secure JWT-based authentication, role-based access control**, and **modular APIs** that allow customers and admins to interact with the platform seamlessly and efficiently.

---

### 2. Target Users

* **Guest Users:**
  Visitors who can browse and search products without an account.

* **Registered Customers:**
  Authenticated users who can manage their profile, add items to cart, place orders, and make payments.

* **Administrators:**
  Platform managers who have full control over products, inventory, pricing, orders, and user management.

---

### 3. Core Features

#### 3.1 User Authentication & Authorization

* **User Registration:**
  Account creation with email and password. Passwords are securely hashed using bcryptjs.

* **User Login:**
  Secure JWT-based authentication with configurable token expiry.

* **Get Current User:**
  Retrieve authenticated user info from JWT token.

* **Role-Based Access Control (RBAC):**
  Two-tier permission system — *Customer* and *Admin*.

* **Default Admin Seeding:**
  A default admin account is automatically created on first startup.

---

#### 3.2 User Profile Management

* **Profile Viewing:**
  Authenticated users can view their full profile details.

* **Profile Updates:**
  Users can update personal information.

* **Password Management:**
  Change password with current password verification.

* **Order History:**
  Users can view their complete personal order history.

* **Admin User Controls:**
  Admins can view all users and toggle user active/inactive status.

---

#### 3.3 Product Management

* **Product Listing:**
  Public endpoint to list all available products with pagination support.

* **Product Search:**
  Search products by name or description keyword.

* **Advanced Filtering:**
  Filter by category, price range (minPrice/maxPrice), and availability status.

* **Sorting:**
  Sort products by price, name, or creation date in ascending or descending order.

* **Product CRUD (Admin only):**
  Admins can create, update, and delete products.

* **Inventory Management (Admin only):**
  Update stock levels, pricing, and availability status per product.

---

#### 3.4 Shopping Cart

* **Add to Cart:**
  Add products to cart with a specified quantity.

* **Update Cart:**
  Modify item quantity for any product currently in the cart.

* **Remove Items:**
  Remove individual items or clear the entire cart at once.

* **View Cart:**
  Fetch full cart with calculated totals per item and overall.

---

#### 3.5 Order Management

* **Checkout:**
  Convert cart contents into a confirmed order with a shipping address.

* **Order History:**
  View all past orders with full details for the logged-in user.

* **Order Details:**
  Fetch a single order by ID including items, totals, and current status.

* **Cancel Order:**
  Customers can cancel orders that are still in pending status.

* **Admin Order Controls:**
  Admins can view all orders platform-wide and update order status.

---

#### 3.6 Payment Processing (Stripe)

* **Payment Intent:**
  Create a Stripe payment intent linked to a specific order.

* **Payment Confirmation:**
  Confirm payment and update the order payment status.

* **Payment Status:**
  Check real-time payment status for any specific order by ID.

* **Webhook Handler:**
  Public Stripe webhook endpoint to handle payment events automatically.

---

#### 3.7 Admin Dashboard

* **Dashboard Stats:**
  Overview of total users, products, orders, and platform revenue.

* **Order Management:**
  View and update the status of all orders on the platform.

* **Product Controls:**
  Update inventory stock, pricing, and availability per product.

* **User Management:**
  View all registered users and toggle their active status.

---

#### 3.8 System Health

* **Health Check Endpoint:**
  Provides API uptime and server status at `/healthz`.

* **API Info Endpoint:**
  Returns API name, version, description, and available endpoint groups at `/api`.

---

### 4. Technical Specifications

#### 4.1 Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js (v18+) |
| Framework | Express.js |
| Database | MongoDB with Mongoose ODM |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcryptjs |
| Payments | Stripe API |
| Security Middleware | Helmet, CORS |
| Environment Config | dotenv |

---

#### 4.2 Project Structure

```
ShopHub
|
├──packages-api/
├── backend
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── adminController.js    # Admin management logic
│   ├── authController.js     # Authentication logic
│   ├── cartController.js     # Shopping cart logic
│   ├── orderController.js    # Order processing logic
│   ├── paymentController.js  # Stripe payment logic
│   ├── productController.js  # Product CRUD logic
│   └── userController.js     # User profile logic
├──middlewares
│   ├── auth.js               # JWT auth & admin middleware
│   └── errorHandler.js       # Global error handler
├── models/
│   ├── Cart.js
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── utils/
│   └── seedAdmin.js          # Auto-create default admin
├── .env.example
├── package.json
└── server.js                 # Application entry point
```

---

#### 4.3 API Endpoints Structure

**Authentication Routes** (`/api/auth`)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |

**User Routes** (`/api/users`)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/users/profile` | Private | Get user profile |
| PUT | `/api/users/profile` | Private | Update user profile |
| PUT | `/api/users/change-password` | Private | Change password |
| GET | `/api/users/orders` | Private | Get user order history |

**Product Routes** (`/api/products`)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/products` | Public | List all products |
| GET | `/api/products/search?q=` | Public | Search products |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

**Cart Routes** (`/api/cart`)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/cart` | Private | View cart |
| POST | `/api/cart` | Private | Add item to cart |
| PUT | `/api/cart/:productId` | Private | Update item quantity |
| DELETE | `/api/cart/:productId` | Private | Remove item from cart |
| DELETE | `/api/cart` | Private | Clear entire cart |

**Order Routes** (`/api/orders`)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/orders/checkout` | Private | Checkout from cart |
| GET | `/api/orders` | Private | Get order history |
| GET | `/api/orders/:id` | Private | Get single order |
| PUT | `/api/orders/:id/cancel` | Private | Cancel order |

**Payment Routes** (`/api/payments`)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/payments/create-payment-intent` | Private | Create Stripe payment intent |
| POST | `/api/payments/confirm` | Private | Confirm payment |
| GET | `/api/payments/status/:orderId` | Private | Get payment status |
| POST | `/api/payments/webhook` | Public | Stripe webhook handler |

**Admin Routes** (`/api/admin`)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET | `/api/admin/orders` | Admin | Get all orders |
| PUT | `/api/admin/orders/:id/status` | Admin | Update order status |
| PUT | `/api/admin/products/:id/inventory` | Admin | Update product stock |
| PUT | `/api/admin/products/:id/price` | Admin | Update product price |
| PUT | `/api/admin/products/:id/availability` | Admin | Toggle availability |
| GET | `/api/admin/users` | Admin | Get all users |
| PUT | `/api/admin/users/:id/toggle-active` | Admin | Toggle user status |

---

#### 4.4 Permission Matrix

| Feature | Admin | Customer |
| --- | --- | --- |
| Register / Login | ✓ | ✓ |
| View & Search Products | ✓ | ✓ |
| Manage Cart | ✓ | ✓ |
| Place & Cancel Orders | ✓ | ✓ |
| Make Payments | ✓ | ✓ |
| Create / Edit / Delete Products | ✓ | ✗ |
| Update Inventory & Pricing | ✓ | ✗ |
| View All Orders & Update Status | ✓ | ✗ |
| View All Users & Toggle Status | ✓ | ✗ |
| View Dashboard Stats | ✓ | ✗ |

---

#### 4.5 Data Models

**User**

```json
{
  "id":         "ObjectId",
  "username":   "String",
  "fullName":   "String",
  "email":      "String",
  "password":   "String (bcrypt hashed)",
  "role":       "customer | admin",
  "isActive":   "Boolean",
  "createdAt":  "Date"
}
```

**Product**

```json
{
  "id":           "ObjectId",
  "name":         "String",
  "description":  "String",
  "price":        "Number",
  "stock":        "Number",
  "category":     "String",
  "isAvailable":  "Boolean",
  "createdAt":    "Date"
}
```

**Cart**

```json
{
  "id":          "ObjectId",
  "userId":      "ObjectId",
  "items": [
    {
      "productId":  "ObjectId",
      "quantity":   "Number",
      "price":      "Number"
    }
  ],
  "totalAmount": "Number"
}
```

**Order**

```json
{
  "id":            "ObjectId",
  "userId":        "ObjectId",
  "items":         ["ObjectId"],
  "totalAmount":   "Number",
  "status":        "pending | processing | shipped | delivered | cancelled",
  "paymentStatus": "pending | paid | failed",
  "shippingAddress": {
    "street":  "String",
    "city":    "String",
    "state":   "String",
    "zipCode": "String",
    "country": "String"
  },
  "createdAt": "Date"
}
```

---

#### 4.6 Environment Variables

| Variable | Description | Example Value |
| --- | --- | --- |
| `PORT` | Server port number | `5000` |
| `NODE_ENV` | Environment mode | `production` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/ecommerce` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `random_long_secret_key` |
| `JWT_EXPIRE` | JWT token expiry duration | `30d` |
| `STRIPE_SECRET_KEY` | Stripe secret API key | `sk_test_xxxxx` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_xxxxx` |

---

### 5. Security Features

* **JWT Authentication** with configurable token expiry and authorization header validation on all private routes.
* **Role-Based Authorization Middleware** enforcing admin-only access on sensitive product, order, and user management endpoints.
* **Password Hashing** using bcryptjs with salt rounds for all stored user passwords. Plain text passwords are never stored.
* **Helmet Middleware** for setting secure HTTP response headers to protect against common web vulnerabilities.
* **CORS Configuration** to control and restrict which origins are permitted to access the API.
* **Input Validation** across all request bodies and route parameters to prevent malformed data.
* **Global Error Handler** providing consistent, structured error responses without leaking internal stack traces.
* **Stripe Webhook Verification** using signing secrets to validate all incoming Stripe payment events.
* **Environment Variables** for all secrets and credentials. No hardcoded values anywhere in source code.

---

### 6. File Management

* Environment configuration stored in `.env` file located in the backend root directory.
* `.env.example` template file provided for easy developer onboarding without exposing real credentials.
* `.gitignore` configured to exclude `.env`, `node_modules`, and all sensitive files from version control.
* Admin seed utility (`utils/seedAdmin.js`) runs automatically on server startup to create the default admin account if one does not exist.
* All static or uploaded assets should be stored under `/uploads/` directory and served via secure URLs.
* Default admin credentials (`admin@ecommerce.com` / `admin123`) must be changed immediately in any production deployment.

---

### 7. Success Criteria

* Secure user registration, login, and JWT-based session management functioning correctly end-to-end.
* All product endpoints (listing, search, filtering, sorting, CRUD) working with proper role enforcement.
* Shopping cart persisting correctly per user with accurate item and total calculations.
* Order placement from cart working end-to-end with correct status tracking and shipping address storage.
* Stripe payment integration creating, confirming, and tracking payment intents successfully.
* Admin dashboard returning accurate real-time stats for users, products, orders, and revenue.
* Role-based authorization enforced strictly on all private and admin-only endpoints.
* All environment variables loaded correctly with no hardcoded secrets in the codebase.
* API response time under 500ms for all standard CRUD operations.
* System uptime above 99% in production deployment.

---

**Document Owner:** Kothasaiteja76, Backend Developer — 
ShopHub API
**Version:** 1.0.0
**Last Updated:** March 2026