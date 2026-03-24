# 🛒 E-Commerce Full Stack Application

A secure and scalable full-stack e-commerce web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It supports user authentication, product management, shopping cart, order processing, and Stripe payment integration.

---

## 🌐 Live Demo

| Service | URL |
| --- | --- |
| Frontend | https://ecommercee.vercel.app |
| Backend API | https://ecommercee.onrender.com |
| API Health Check | https://ecommercee.onrender.com/healthz |

---

## 📁 Project Structure

```
ecommercee/
├── backend/        # Node.js + Express REST API
└── frontend/       # React.js Single Page Application
```

---

## ⚙️ Tech Stack

### Backend
| Layer | Technology |
| --- | --- |
| Runtime | Node.js (v18+) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcryptjs |
| Payments | Stripe API |
| Security | Helmet, CORS |

### Frontend
| Layer | Technology |
| --- | --- |
| Framework | React.js (v18+) |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| State Management | React Context API |
| Payment UI | Stripe.js / Stripe Elements |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas cloud)
- Stripe account
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/Kothasaiteja76/ecommercee.git
cd ecommercee
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Fill in your environment variables in `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

Start the backend server:

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create your `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

Start the frontend:

```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🔑 Default Admin Account

On first backend startup, a default admin is created automatically:

| Field | Value |
| --- | --- |
| Email | admin@ecommerce.com |
| Password | admin123 |

> ⚠️ **Change this password immediately in production!**

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |

### Products
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/products` | Public | List all products |
| GET | `/api/products/search?q=` | Public | Search products |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Cart
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/cart` | Private | View cart |
| POST | `/api/cart` | Private | Add item to cart |
| PUT | `/api/cart/:productId` | Private | Update quantity |
| DELETE | `/api/cart/:productId` | Private | Remove item |
| DELETE | `/api/cart` | Private | Clear cart |

### Orders
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/orders/checkout` | Private | Checkout from cart |
| GET | `/api/orders` | Private | Get order history |
| GET | `/api/orders/:id` | Private | Get single order |
| PUT | `/api/orders/:id/cancel` | Private | Cancel order |

### Payments
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/payments/create-payment-intent` | Private | Create Stripe payment intent |
| POST | `/api/payments/confirm` | Private | Confirm payment |
| GET | `/api/payments/status/:orderId` | Private | Get payment status |
| POST | `/api/payments/webhook` | Public | Stripe webhook |

### Admin
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET | `/api/admin/orders` | Admin | All orders |
| PUT | `/api/admin/orders/:id/status` | Admin | Update order status |
| PUT | `/api/admin/products/:id/inventory` | Admin | Update stock |
| GET | `/api/admin/users` | Admin | All users |
| PUT | `/api/admin/users/:id/toggle-active` | Admin | Toggle user status |

---

## ☁️ Deployment

### Backend → Render

| Field | Value |
| --- | --- |
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Add all environment variables in Render → Environment settings.

### Frontend → Vercel

| Field | Value |
| --- | --- |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `build` |
| Install Command | `npm install` |

Add `REACT_APP_API_URL` pointing to your Render backend URL.

### Database → MongoDB Atlas

1. Create a free M0 cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Add database user with username and password
3. Set Network Access to `0.0.0.0/0`
4. Copy the connection string into `MONGODB_URI`

---

## 🔒 Security Features

- JWT-based authentication with token expiry
- Role-based access control (Customer / Admin)
- Password hashing with bcryptjs
- Helmet for secure HTTP headers
- CORS protection
- Stripe webhook signature verification
- Environment variables for all secrets

---

## 📄 Documentation

| Document | Link |
| --- | --- |
| Backend PRD | [docs/Ecommerce_Backend_PRD.md](./docs/Ecommerce_Backend_PRD.md) |
| Frontend PRD | [docs/Ecommerce_Frontend_PRD.md](./docs/Ecommerce_Frontend_PRD.md) |

---

## 📸 Features Overview

- ✅ User registration and login
- ✅ Product listing, search, and filtering
- ✅ Shopping cart management
- ✅ Order placement and tracking
- ✅ Stripe payment integration
- ✅ Admin dashboard with full platform control
- ✅ Responsive design for all screen sizes

---

## 👤 Author

**Kothasaiteja76**
- GitHub: [@Kothasaiteja76](https://github.com/Kothasaiteja76)

---

## 📝 License

This project is licensed under the ISC License.