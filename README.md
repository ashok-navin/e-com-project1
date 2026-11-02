# e-com-project1

# 🎯 TRENDING DART — Premium Full-Stack E-Commerce Platform

> **Discover What's Trending** — Premium e-commerce destination for viral home organizers, smart bathroom utilities, and lifestyle essentials.

---

## 📌 Brand & Contact Details
- **Store Name:** TRENDING DART
- **Tagline:** Discover What's Trending
- **Customer Helpline / WhatsApp:** `82708 82715`
- **Official Email:** `trendingdart@gmail.com`
- **Official Instagram:** [https://www.instagram.com/trending_dart](https://www.instagram.com/trending_dart?xtok=MWFsZzJhbHhhcTdoNA==)

---

## 🚀 Key Features

### 1. Opening Animation (2 Seconds)
- When opening or refreshing the application, a sleek 2-second splash screen features the **TRENDING DART** logo with animated speed lines and tagline reveal before transitioning into the storefront.

### 2. Direct "Order Now" Flow (Login Required)
- Every product card and product details page features both:
  - **Add to Cart** (for standard multi-item shopping)
  - **⚡ Order Now** (for instant 1-click ordering)
- **Security Flow:** Clicking **Order Now** requires customer authentication. Unauthenticated users are prompted with a clear notice explaining order tracking requirements and guided to login or register, preserving their checkout intent.

### 3. Automated HTML Email Notifications (Nodemailer)
- **Order Confirmation:** Dispatched instantly upon order creation with full item summary, pricing, and live tracking link.
- **Admin Alert:** Instant email to store management with order total, customer details, and shipping destination.
- **Order Processing:** Dispatched when status moves to `PROCESSING`.
- **Order Shipped:** Dispatched when status moves to `SHIPPED` (includes courier name, tracking AWB number, and estimated arrival).
- **Out for Delivery:** Dispatched when status moves to `OUT FOR DELIVERY`.
- **Order Delivered:** Dispatched upon successful delivery.
- **Order Cancelled:** Dispatched if order is cancelled with refund details.

### 4. Visual Order Tracking System
- Visual timeline with status history:
  $$\text{ORDER CONFIRMED} \longrightarrow \text{PROCESSING} \longrightarrow \text{SHIPPED} \longrightarrow \text{OUT FOR DELIVERY} \longrightarrow \text{DELIVERED}$$
- Accessible via customer account, receipt page, or the public tracking tool at `/track`.

### 5. Protected Administrative Panel (`/admin`)
- Accessible only to authenticated users with role `ADMIN`.
- Real-time MongoDB Atlas analytics (Total sales, total orders, customers, top-selling items, status breakdown).
- **Product Management:** Add, edit, delete, update stock, image URLs, specifications, and variants.
- **Category Management:** Create and manage product categories.
- **Order Management:** View complete customer records, update status with courier AWB, triggering automated customer emails.
- **Coupons & Offers:** Configurable promo codes (`TRENDING10`, `SAVE50`, etc.).
- **Website Settings:** Dynamically update helpline phone, email, Instagram handle, and free delivery thresholds without modifying source code.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios, Canvas Confetti |
| **Backend** | Node.js, Express.js (Vercel Serverless Compatible) |
| **Database** | MongoDB Atlas via Mongoose with Connection Pooling |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing |
| **Email System** | Nodemailer (HTML branded templates with dynamic statuses) |
| **Hosting** | Vercel (Single Project — Frontend SPA + Backend `/api` Serverless Functions) |

---

## 📁 Project Structure

```text
e-com project 1/
│
├── api/
│   └── index.js              # Vercel serverless entry point exporting Express app
│
├── public/
│   ├── logo.png              # Trending Dart official brand logo
│   └── vite.svg
│
├── server/
│   ├── app.js                # Core Express application configuration
│   ├── server.js             # Local standalone development server (Port 5000)
│   ├── config/
│   │   └── db.js             # Mongoose connection pooling & caching
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── couponController.js
│   │   ├── offerController.js
│   │   ├── reviewController.js
│   │   ├── settingsController.js
│   │   ├── statsController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js           # JWT verification & ADMIN role guard
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Coupon.js
│   │   ├── Offer.js
│   │   ├── Review.js
│   │   ├── WebsiteSettings.js
│   │   └── PasswordResetOTP.js
│   ├── routes/
│   │   └── ... (REST endpoints mounted under /api/...)
│   ├── services/
│   │   └── emailService.js   # Nodemailer automated customer email templates
│   └── utils/
│       └── seedData.js       # Admin user and initial catalog seeder
│
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── common/
│   │   │   ├── SplashIntro.jsx     # 2-second opening brand animation
│   │   │   ├── QuickOrderModal.jsx # Direct Order Now authentication flow
│   │   │   └── InstagramIcon.jsx
│   │   ├── layout/
│   │   │   └── OrderTimeline.jsx   # Visual status timeline
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProductCard.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ShopContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Profile.jsx
│   │   ├── OrderDetails.jsx
│   │   ├── OrderTracking.jsx
│   │   ├── Wishlist.jsx
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       └── AdminDashboard.jsx
│   ├── services/
│   │   └── api.js            # Axios client with JWT interceptor
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example              # Environment variables template
├── package.json
├── vercel.json               # Single project Vercel routing
└── vite.config.js            # Vite configuration with /api proxy
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/trending_dart?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=trending_dart_super_secret_jwt_key_2026_jwt_token_sign
JWT_EXPIRES_IN=30d

# Email Notification System (Nodemailer SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=trendingdart@gmail.com
EMAIL_PASS=your_16_character_google_app_password
ADMIN_EMAIL=trendingdart@gmail.com

# Server & Client Configuration
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 🏃 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Initial Admin & Catalog (MongoDB)
```bash
npm run seed
```
> Default Admin Account:
> - **Email:** `admin@trendingdart.com`
> - **Password:** `Admin@TrendingDart2026`

### 3. Run Development Server
```bash
npm run dev
```
- **Storefront (Vite):** `http://localhost:5173`
- **Backend API (Express):** `http://localhost:5000`
- **API Health Check:** `http://localhost:5000/api/health`

### 4. Build for Production
```bash
npm run build
```

---

## ☁️ Single-Project Vercel Deployment

Deploy both frontend and backend under **ONE single Vercel project and URL**:

1. Push this repository to GitHub.
2. In [Vercel Dashboard](https://vercel.com), click **Add New Project** and select the repository.
3. Configure the **Environment Variables** in Vercel:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `ADMIN_EMAIL`
   - `CLIENT_URL` (set to your Vercel URL, e.g. `https://your-domain.vercel.app`)
4. Click **Deploy**.

Vercel will build the Vite frontend into static assets and deploy `api/index.js` as serverless functions handling all `/api/*` traffic automatically according to `vercel.json`.
