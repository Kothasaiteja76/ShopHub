# Product Requirements Document (PRD)

## Shophub App Frontend V1

---

### 1. Product Overview

**Product Name:** ShopHub Web Application
**Version:** 1.0.0
**Product Type:** React.js Single Page Application (SPA)

The E-Commerce Frontend is a responsive, single-page React.js web application that provides a complete online shopping experience. It connects to the E-Commerce REST API backend to deliver product browsing, cart management, order placement, and Stripe payment processing through a clean and intuitive user interface.

The application supports two user roles — **Customer** and **Admin** — with dedicated interfaces for each. Customers can browse, search, and purchase products. Admins get access to a full dashboard to manage products, orders, inventory, and users.

---

### 2. Target Users

* **Guest Visitors:**
  Users who browse and search the product catalogue without logging in.

* **Registered Customers:**
  Logged-in users who can add to cart, checkout, pay, and track their orders.

* **Administrators:**
  Logged-in admin users who access the admin dashboard to manage the entire platform.

---

### 3. Core Features

#### 3.1 Authentication Pages

* **Register Page:**
  Form for new users to create an account with username, email, and password.

* **Login Page:**
  Email and password login form with JWT token stored in localStorage.

* **Logout:**
  Clear token and redirect the user back to the login page.

* **Protected Routes:**
  Pages like Cart, Checkout, Orders, and Profile are only accessible when logged in.

* **Admin Guard:**
  Admin dashboard pages are only accessible to users with the admin role.

---

#### 3.2 Home & Navigation

* **Header / Navbar:**
  Logo, navigation links, cart icon with item count badge, and login/logout button.

* **Home Page:**
  Featured products section and entry point to the full product catalogue.

* **Responsive Layout:**
  Fully responsive design that works across desktop, tablet, and mobile screens.

---

#### 3.3 Product Pages

* **Product Listing Page:**
  Display all available products in a grid layout with pagination controls.

* **Product Search:**
  Search bar to filter products by name or description in real time.

* **Product Filters:**
  Filter products by category, price range, and availability status.

* **Product Sorting:**
  Sort by price (low to high / high to low), name, or newest first.

* **Product Detail Page:**
  Full product view with name, description, price, stock status, and Add to Cart button.

---

#### 3.4 Shopping Cart

* **Cart Page:**
  View all items in cart with quantity, unit price, and line total per item.

* **Update Quantity:**
  Increase or decrease item quantity directly from the cart page.

* **Remove Item:**
  Remove individual items from the cart.

* **Clear Cart:**
  Remove all items from the cart in one click.

* **Cart Summary:**
  Display subtotal and total amount with a Proceed to Checkout button.

* **Cart Badge:**
  Navbar icon shows the current number of items in the cart.

---

#### 3.5 Checkout & Orders

* **Checkout Page:**
  Form to enter shipping address — street, city, state, zip code, and country.

* **Order Summary:**
  Review cart items and total before placing the order.

* **Place Order:**
  Submit order to the backend and proceed to the payment page.

* **Order History Page:**
  List of all past orders with date, status, and total amount.

* **Order Detail Page:**
  Full breakdown of a single order including items, shipping address, payment status, and order status.

* **Cancel Order:**
  Button to cancel a pending order from the order detail page.

---

#### 3.6 Payment (Stripe)

* **Payment Page:**
  Stripe-powered card payment form integrated using Stripe.js / Stripe Elements.

* **Create Payment Intent:**
  Call backend to create a Stripe payment intent before rendering the payment form.

* **Confirm Payment:**
  Submit card details to Stripe and confirm the payment.

* **Payment Success Page:**
  Confirmation screen shown after successful payment with order ID and summary.

* **Payment Failure Handling:**
  Display clear error messages if payment fails, with a retry option.

---

#### 3.7 User Profile

* **Profile Page:**
  View personal details including username, email, and account role.

* **Edit Profile:**
  Update personal information via an editable form.

* **Change Password:**
  Form to update password with current password verification.

* **My Orders:**
  Shortcut from profile page to the full order history.

---

#### 3.8 Admin Dashboard

* **Dashboard Overview:**
  Stats cards showing total users, products, orders, and revenue.

* **Product Management:**
  List all products with options to add, edit, delete, and toggle availability.

* **Inventory Management:**
  Update stock quantity and pricing per product.

* **Order Management:**
  View all orders platform-wide and update order status.

* **User Management:**
  View all registered users and toggle their active/inactive status.

---

### 4. Technical Specifications

#### 4.1 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React.js (v18+) |
| Routing | React Router DOM (v6) |
| HTTP Client | Axios |
| State Management | React Context API / useState / useEffect |
| Payment UI | Stripe.js / Stripe Elements |
| Styling | CSS Modules / Tailwind CSS |
| Build Tool | Create React App (CRA) or Vite |
| Deployment | Vercel |

---

#### 4.2 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance with base URL & auth header
│   ├── components/
│   │   ├── Navbar.jsx            # Header with cart icon and nav links
│   │   ├── ProductCard.jsx       # Product grid card component
│   │   ├── CartItem.jsx          # Single cart item row
│   │   ├── ProtectedRoute.jsx    # Route guard for authenticated pages
│   │   └── AdminRoute.jsx        # Route guard for admin pages
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── OrderDetailPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProducts.jsx
│   │       ├── AdminOrders.jsx
│   │       └── AdminUsers.jsx
│   ├── context/
│   │   ├── AuthContext.jsx       # Global auth state (user, token, login, logout)
│   │   └── CartContext.jsx       # Global cart state and operations
│   ├── App.jsx                   # Main router and layout
│   └── index.js                  # React entry point
├── .env
├── package.json
└── README.md
```

---

#### 4.3 Pages & Routes

| Route | Page | Access | Description |
| --- | --- | --- | --- |
| `/` | Home Page | Public | Landing page with featured products |
| `/products` | Products Page | Public | All products with search and filters |
| `/products/:id` | Product Detail | Public | Single product full view |
| `/login` | Login Page | Public | User login form |
| `/register` | Register Page | Public | New user registration form |
| `/cart` | Cart Page | Private | Shopping cart with items and totals |
| `/checkout` | Checkout Page | Private | Shipping address and order review |
| `/payment` | Payment Page | Private | Stripe card payment form |
| `/orders` | Orders Page | Private | User order history list |
| `/orders/:id` | Order Detail | Private | Single order full details |
| `/profile` | Profile Page | Private | User profile and settings |
| `/admin` | Admin Dashboard | Admin | Stats overview for admins |
| `/admin/products` | Admin Products | Admin | Manage all products |
| `/admin/orders` | Admin Orders | Admin | Manage all orders |
| `/admin/users` | Admin Users | Admin | Manage all users |

---

#### 4.4 API Integration

| Feature | API Endpoint Called | Method |
| --- | --- | --- |
| Register | `/api/auth/register` | POST |
| Login | `/api/auth/login` | POST |
| Get Current User | `/api/auth/me` | GET |
| Get Products | `/api/products` | GET |
| Search Products | `/api/products/search?q=` | GET |
| Get Product Detail | `/api/products/:id` | GET |
| View Cart | `/api/cart` | GET |
| Add to Cart | `/api/cart` | POST |
| Update Cart Item | `/api/cart/:productId` | PUT |
| Remove Cart Item | `/api/cart/:productId` | DELETE |
| Checkout | `/api/orders/checkout` | POST |
| Get Orders | `/api/orders` | GET |
| Get Order Detail | `/api/orders/:id` | GET |
| Create Payment Intent | `/api/payments/create-payment-intent` | POST |
| Confirm Payment | `/api/payments/confirm` | POST |
| Admin Dashboard Stats | `/api/admin/dashboard` | GET |
| Admin Get All Orders | `/api/admin/orders` | GET |
| Admin Update Order Status | `/api/admin/orders/:id/status` | PUT |
| Admin Get All Users | `/api/admin/users` | GET |

---

#### 4.5 Environment Variables

| Variable | Description | Example Value |
| --- | --- | --- |
| `REACT_APP_API_URL` | Backend API base URL | `https://ecommercee.onrender.com` |
| `REACT_APP_STRIPE_PUBLIC_KEY` | Stripe publishable key for payment UI | `pk_test_xxxxx` |

---

### 5. Security Features

* **JWT Token Storage:** Auth token stored in localStorage and attached to every API request via Axios request interceptor.
* **Protected Routes:** `ProtectedRoute` component checks for a valid token before rendering private pages. Unauthenticated users are redirected to the login page.
* **Admin Route Guard:** `AdminRoute` component verifies user role is admin before rendering dashboard pages.
* **Automatic Token Expiry Handling:** Axios response interceptor detects 401 errors, clears the token, and redirects the user to login.
* **Stripe Elements:** Card data is never sent to the backend. Stripe.js handles all sensitive payment data securely on the client side.
* **Environment Variables:** API URL and Stripe public key stored in `.env` file. Never hardcoded in source files.
* **Input Validation:** All forms include client-side validation for required fields, email format, and password length before submission.

---

### 6. File Management

* Environment configuration stored in `.env` file in the frontend root directory.
* `.env.example` template provided for onboarding new developers without exposing real keys.
* `.gitignore` configured to exclude `.env`, `node_modules`, and `build/` directory from version control.
* Build output generated in the `/build` directory via `npm run build` for production deployment on Vercel.
* Static assets (images, icons, fonts) stored in the `/public` directory and referenced via relative URLs.
* Component files use `.jsx` extension and are organized by feature under `/src/pages` and `/src/components`.

---

### 7. Success Criteria

* User registration and login working end-to-end with JWT token stored and attached to all authenticated API requests.
* Product listing, search, filtering, and sorting rendering correctly with live data from the backend API.
* Shopping cart persisting per user with correct quantity updates, item removal, and total calculations.
* Checkout form collecting shipping address and successfully placing an order via the backend.
* Stripe payment form loading, accepting test card details, and completing payment successfully.
* Order history and order detail pages displaying accurate data for the logged-in user.
* Admin dashboard accessible only to admin users with correct stats, product, order, and user management working.
* Protected and admin routes correctly blocking unauthenticated or unauthorized access with redirects.
* Application fully responsive and usable on desktop, tablet, and mobile screen sizes.
* All API errors handled gracefully with user-friendly error messages displayed on screen.
* Frontend successfully deployed and live on Vercel with backend URL configured in environment variables.

---

**Document Owner:** Kothasaiteja76, Frontend Developer — E-Commerce App
**Version:** 1.0.0
**Last Updated:** March 2026