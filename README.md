# 🎬 CineBook - Movie Ticket Booking System

![GitHub stars](https://img.shields.io/github/stars/kunal37x37/movie-booking-system-mern?style=social)
![GitHub forks](https://img.shields.io/github/forks/kunal37x37/movie-booking-system-mern?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/kunal37x37/movie-booking-system-mern?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/kunal37x37/movie-booking-system-mern)
![GitHub repo size](https://img.shields.io/github/repo-size/kunal37x37/movie-booking-system-mern)

> **A Complete Full-Stack Movie Ticket Booking Platform** | Built with MERN Stack | OTP Verification | Real-time Seat Selection | Theatre Owner Dashboard

---

## 📌 Project Overview

CineBook is a comprehensive **Movie Ticket Booking System** that allows users to browse movies, book tickets online with seat selection, and make payments. Theatre owners can manage their movies, shows, track bookings, and view revenue analytics.

### 🎯 Purpose
This project was developed as an **Internship Task** to demonstrate full-stack development skills using the MERN (MongoDB, Express.js, React.js, Node.js) stack.

### 👥 Target Users
- **Movie Lovers** - Browse & book movie tickets
- **Theatre Owners** - Manage movies, shows, and track bookings

---

## ✨ Features

### 👤 User Features
| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Register/Login with Email OTP Verification |
| 🎬 **Browse Movies** | View all movies with posters & details |
| 🔍 **Search & Filter** | Search by name, language, genre, status |
| 📅 **Date Selection** | Select from 7 available dates |
| ⏰ **Show Times** | Multiple show timings per movie |
| 💺 **Seat Selection** | Interactive theatre layout with categories |
| 🏷️ **Seat Categories** | Platinum/Gold/Silver with different prices |
| 💰 **Dynamic Pricing** | Automatic GST (18%) + Convenience Fee calculation |
| 💳 **Payment Gateway** | Card/UPI/Netbanking options |
| 📜 **Booking History** | View all past & upcoming bookings |
| 🎫 **Download Ticket** | Digital ticket for booked shows |

### 🏢 Theatre Owner Features
| Feature | Description |
|---------|-------------|
| ➕ **Add Movies** | Add new movies with complete details |
| ✏️ **Edit Movies** | Update movie information |
| 🗑️ **Delete Movies** | Remove movies from system |
| ⏰ **Manage Shows** | Add/Remove multiple show times |
| 🎨 **Seat Categories** | Custom categories with pricing & colors |
| 📊 **View Bookings** | See all customer bookings |
| 📈 **Analytics Dashboard** | Revenue breakdown & popular movies |
| 👥 **Customer Info** | View customer details for each booking |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React.js** | UI Framework |
| **HTML5** | Structure |
| **CSS3** | Styling & Animations |
| **JavaScript (ES6+)** | Logic & Interactions |
| **Axios** | API calls |
| **React Router DOM** | Navigation |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **MongoDB** | Database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication |
| **Bcryptjs** | Password Hashing |
| **Nodemailer** | Email Service (OTP) |

### Tools & DevOps
| Tool | Purpose |
|------|---------|
| **VS Code** | Code Editor |
| **Git** | Version Control |
| **GitHub** | Repository Hosting |
| **Postman** | API Testing |
| **MongoDB Compass** | Database Management |

---

## 📁 Project Structure
```bash
movie-booking-system-mern/
│
├── backend/
│ ├── models/
│ │ ├── User.js # User schema
│ │ ├── Movie.js # Movie schema with seat categories
│ │ ├── Booking.js # Booking schema
│ │ └── OTP.js # OTP verification schema
│ ├── routes/
│ │ ├── authRoutes.js # Login/Register APIs
│ │ ├── movieRoutes.js # Movie CRUD APIs
│ │ ├── bookingRoutes.js # Booking APIs
│ │ └── otpRoutes.js # OTP send/verify APIs
│ ├── middleware/
│ │ └── auth.js # JWT verification middleware
│ ├── server.js # Entry point
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── LandingPage.js # Home page with movies
│ │ │ ├── Login.js # Login page
│ │ │ ├── Register.js # Registration with OTP
│ │ │ ├── UserDashboard.js # User dashboard
│ │ │ ├── OwnerDashboard.js # Owner dashboard
│ │ │ └── BookingPage.js # Seat selection & payment
│ │ ├── context/
│ │ │ └── AuthContext.js # Auth state management
│ │ ├── App.js # Main component
│ │ └── index.js # Entry point
│ └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('user'/'owner'),
  phone: String,
  createdAt: Date
}
```
## Movies Collection

{
  name: String,
  description: String,
  language: String,
  genre: String,
  duration: String,
  image: String,
  basePrice: Number,
  seatCategories: [{
    name: String,
    price: Number,
    color: String,
    rows: [String],
    seatsPerRow: Number,
    bookedSeats: [String]
  }],
  shows: [{
    time: String,
    date: String,
    bookedSeats: [String]
  }],
  ownerId: ObjectId,
  status: String
}
