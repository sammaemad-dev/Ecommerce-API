# E-Commerce Backend API

RESTful E-Commerce API built with Node.js, Express, MongoDB, With JWT Authentication and Authorization.

# Table Of Contents

- Features
- Tech Stack
- Project Structure
- Installation

# Features

- JWT Authentication & Authorization
- Product Management
- Shopping Cart
- Role Based Access Control
- Orders
- OTP Validations
- Email Verification

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
