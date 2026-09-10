# Farmart - Grocery Full-Stack E-Commerce Platform

A production-grade, decoupled full-stack grocery e-commerce web application built with a modern **React (Vite) Frontend**, **Node.js (Express) Backend**, and relational **SQL Database**.

---

## 🏗 Project Architecture

```text
project-root/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # SQL database connection & auto-migration
│   │   ├── controllers/         # REST API route controllers
│   │   ├── models/              # Relational SQL models & query builder
│   │   ├── routes/              # Express API endpoints (/api/products, /api/auth, etc.)
│   │   ├── middleware/          # JWT authentication & error handling
│   │   ├── services/            # Core business logic layer
│   │   ├── utils/               # Response formatting & JWT utilities
│   │   ├── app.js               # Express application config
│   │   └── server.js            # Node.js server entry point
│   ├── database/
│   │   ├── schema.sql           # SQL tables, foreign keys, indexes
│   │   ├── seed.sql             # Comprehensive seed data for products, categories, reviews
│   │   └── dbInit.js            # Standalone database initialization script
│   ├── .env.example             # Backend environment template
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/                  # Static assets, product images, icons, logo.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Reusable Container, Button, SectionTitle, Paragraph
│   │   │   ├── layout/          # Header with real-time badges, Footer, Search bar
│   │   │   ├── product/         # ProductCard, ProductQuickViewModal
│   │   │   └── home/            # Hero, CategorySlider, BrandSlider, TopSaver, BestSeller, CardBanner
│   │   ├── pages/               # Home, Shop, SingleProduct, Cart, Wishlist, Checkout, Login, Register
│   │   ├── context/             # AuthContext, CartContext, WishlistContext
│   │   ├── hooks/               # useAuth, useCart, useWishlist
│   │   ├── services/            # Axios API service clients
│   │   ├── App.jsx              # React Router configuration
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind CSS & Swiper slider styling
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start & Run Instructions

### 1. Start the Backend API Server

Open a terminal and run:

```bash
cd backend
npm install
npm run dev
```

- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`
- **Database**: Auto-initializes and seeds with full grocery catalog (`backend/database/farmart.sqlite`).

### 2. Start the Frontend Application

In a separate terminal, run:

```bash
cd frontend
npm install
npm run dev
```

- **Frontend App**: `http://localhost:5173`

---

## 🛒 Features & Functionality

- **Product Catalog & Dynamic Search**: Filter by category, featured brand, search keywords, or top discount deals.
- **Interactive Sliders**: Smooth touch-enabled Swiper sliders for categories, brands, top savers, and best sellers.
- **Product Details & Live Reviews**: Dynamic product pages with real-time customer reviews and ratings submission.
- **Quick View Modal**: Interactive product preview modal without leaving the catalog page.
- **Shopping Cart & Wishlist**: Real-time counter badges in the header, persistent items, quantity adjuster, and instant updates.
- **Checkout & Orders**: Complete delivery form, order placement, and automatic cart clearing.
- **User Authentication**: Secure registration (with instant 15% discount card on homepage) and JWT-based login.
- **Newsletter**: Instant subscription with duplicate prevention.
- **Relational SQL Database**: Clean normalized schema with tables for users, products, categories, brands, reviews, cart items, wishlist, orders, and newsletter subscribers.
