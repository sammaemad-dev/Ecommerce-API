# E-Commerce Backend API

RESTful E-Commerce API built with Node.js, Express, MongoDB, With JWT Authentication and Authorization.

# Table Of Contents

- Features
- Tech Stack
- Project Structure
- Installation
- Environment Variables
- Running
- Endpoints
- Deployment

# Features

- JWT Authentication & Authorization
- Product Management
- Shopping Cart
- Role Based Access Control
- Orders
- OTP Validations
- Email Verification
- Mongoose Transactions
- Cloudinary Image Management
- Admin Dashboard Analytics

# Tech Stack

- NodeJS
- Express JS
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Cloudinary
- Multer
- Nodemailer
- Slugify
- dotenv
- cors
- cookie-parser
- joi
- Morgan

# Project Architecture

ecommerce-api/
├── config/ → Cloudinary setup
├── models/ → Mongoose schemas and models
│ ├── User.model.js
│ ├── Product.model.js
│ ├── Order.model.js
│ ├── Cart.model.js
│ ├── Wishlist.model.js
│ └── OTP.model.js
├── controllers/ → Business logic for every resource
├── DB/ → Database connection
├── routes/ → Express route definitions
├── middleware/ → Auth guard, role check, upload, error handler , validate
├── utils/ → sendEmail, uploadToCloudinary,
├── validation/ → using joi create the files
└── index.js → App entry point
└── .env → all environment variables
└── vercel.json → handle the api deploy to vercel

# Installation

git clone <repo>

cd ECOMMERCE-API

npm install

# Environment Variables

## Server

PORT=5000
NODE_ENV=development

## Database

MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ecommerce

## JWT

JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

## Cloudinary

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

## Email (Nodemailer)

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Running

- Dev
  - npm run dev
- Prod
  - npm start

# API Endpoints

## Authentication /auth

| Method | Endpoint                           | Description                                          | Auth   |
| ------ | ---------------------------------- | ---------------------------------------------------- | ------ |
| POST   | `/auth/register/send-otp`          | Register a new user and send a verification OTP      | Public |
| POST   | `/auth/verify-otp`                 | Verify the registration OTP and activate the account | Public |
| POST   | `/auth/login`                      | Authenticate a user and return a JWT                 | Public |
| POST   | `/auth/logout`                     | Log out the authenticated user                       | User   |
| POST   | `/auth/forgot-password/send-otp`   | Send a password reset OTP                            | Public |
| POST   | `/auth/forgot-password/verify-otp` | Verify the reset OTP and set a new password          | Public |
| GET    | `/auth/me`                         | Get the authenticated user's profile                 | User   |

## Users /users

| Method | Endpoint     | Description                            | Auth  |
| ------ | ------------ | -------------------------------------- | ----- |
| POST   | `/users/add` | Create a new user from the admin panel | Admin |
| GET    | `/users/all` | Retrieve all users                     | Admin |
| GET    | `/users/:id` | Retrieve a user by ID                  | Admin |
| PATCH  | `/users/:id` | Update a user's profile                | User  |
| DELETE | `/users/:id` | Delete a user                          | Admin |

## Products /products

| Method | Endpoint                     | Description                                                   | Auth         |
| ------ | ---------------------------- | ------------------------------------------------------------- | ------------ |
| GET    | `/products`                  | Retrieve all products with filtering, sorting, and pagination | Public       |
| GET    | `/products/search`           | Search products using advanced filters                        | Public       |
| GET    | `/products/:id`              | Retrieve a product by ID                                      | Public       |
| POST   | `/products`                  | Create a new product                                          | Admin        |
| PUT    | `/products/update/:id`       | Update a product and manage its images                        | Admin        |
| DELETE | `/products/:id`              | Delete a product and its images                               | Admin        |
| POST   | `/products/:id/reviews`      | Add a review to a product                                     | User         |
| GET    | `/products/:id/reviews`      | Retrieve all reviews for a product                            | Public       |
| DELETE | `/products/:id/reviews/:rid` | Delete a product review                                       | User / Admin |

## Cart /carts

| Method | Endpoint                  | Description                          | Auth |
| ------ | ------------------------- | ------------------------------------ | ---- |
| GET    | `/carts`                  | Retrieve the user's cart             | User |
| POST   | `/carts/items`            | Add an item to the cart              | User |
| PATCH  | `/carts/items`            | Update an item's quantity            | User |
| DELETE | `/carts/items/:productId` | Remove an item from the cart         | User |
| POST   | `/carts/coupon`           | Apply a coupon to the cart           | User |
| DELETE | `/carts/coupon`           | Remove the applied coupon            | User |
| DELETE | `/carts/clear`            | Clear the cart and remove the coupon | User |

## Orders /orders

| Method | Endpoint                   | Description                              | Auth  |
| ------ | -------------------------- | ---------------------------------------- | ----- |
| POST   | `/orders`                  | Create a new order                       | User  |
| GET    | `/orders/my`               | Retrieve the authenticated user's orders | User  |
| GET    | `/orders/my/:id`           | Retrieve a specific user order           | User  |
| PATCH  | `/orders/my/:id/cancel`    | Cancel a pending or confirmed order      | User  |
| GET    | `/orders/admin/dashboard`  | Retrieve all orders with filters         | Admin |
| GET    | `/orders/admin/carts`      | Retrieve detailed order information      | Admin |
| GET    | `/orders/admin`            | Retrieve all orders                      | Admin |
| GET    | `/orders/admin/:id`        | Retrieve an order by ID                  | Admin |
| PATCH  | `/orders/admin/:id/status` | Update an order's status                 | Admin |

## Wishlist /wishlists

| Method | Endpoint                       | Description                                | Auth |
| ------ | ------------------------------ | ------------------------------------------ | ---- |
| GET    | `/wishlists/my`                | Retrieve the authenticated user's wishlist | User |
| POST   | `/wishlists/add/:productId`    | Add a product to the wishlist              | User |
| DELETE | `/wishlists/remove/:productId` | Remove a product from the wishlist         | User |
| DELETE | `/wishlists/clear`             | Clear the entire wishlist                  | User |

## Admin — Dashboard & Analytics /admin

| Method | Endpoint                 | Description                                 | Auth  |
| ------ | ------------------------ | ------------------------------------------- | ----- |
| GET    | `/admin/dashboard`       | Retrieve dashboard analytics and statistics | Admin |
| GET    | `/admin/carts`           | Retrieve all active shopping carts          | Admin |
| GET    | `/admin/wishlists`       | Retrieve all user wishlists                 | Admin |
| GET    | `/admin/wishlists/stats` | Retrieve the most wishlisted products       | Admin |

# Deployment
