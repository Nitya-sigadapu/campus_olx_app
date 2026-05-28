# Campus OLX – The Campus Resource Exchange

## Project Overview

Campus OLX is a secure campus-exclusive marketplace platform designed for students to buy and sell used academic and hostel-related resources such as books, electronics, cycles, lab coats, stationery, and room essentials.

Every semester, seniors often discard valuable items while juniors search for affordable alternatives. Campus OLX bridges this gap by creating a trusted student marketplace within the college community.

The platform restricts access to verified college email IDs and includes OTP verification, JWT authentication, real-time chat, image uploads, pagination, and interest tracking.

---

# Tech Stack

| Category                | Technology | Purpose                        |
| ----------------------- | ---------- | ------------------------------ |
| Frontend                | React.js   | Dynamic component-based UI     |
| Backend                 | Express.js | REST API development           |
| Database                | MySQL      | Relational database management |
| Authentication          | JWT        | Secure user sessions           |
| Password Security       | bcrypt     | Password hashing               |
| Real-Time Communication | Socket.io  | Instant messaging              |
| File Uploads            | Multer     | Image upload handling          |
| API Requests            | Axios      | Frontend-backend communication |

---

# Database

The project uses a local MySQL database:

```sql
campus_olx
```

## Main Tables

* users
* listings
* interests
* messages

---

# Demo Accounts

The following demo accounts are available for testing:

| Name      | Email                                               | Password |
| --------- | --------------------------------------------------- | -------- |
| Nitya     | [nitya@iiti.ac.in](mailto:nitya@iiti.ac.in)         | 123456   |
| Praharsha | [praharsha@iiti.ac.in](mailto:praharsha@iiti.ac.in) | 654321   |
| Prayuktha | [prayuktha@iiti.ac.in](mailto:prayuktha@iiti.ac.in) | 123456   |
| Charan    | [charan@iiti.ac.in](mailto:charan@iiti.ac.in)       | 123456   |

If login fails, users can create a new account using the signup page.

---

# OTP Verification

During signup:

1. User enters email, password, and contact number
2. Backend generates a 6-digit OTP
3. OTP is displayed in backend terminal
4. User enters OTP in frontend
5. Account becomes verified after successful validation

Example terminal output:

```bash
Generated OTP for user@iiti.ac.in : 493078
```

---

# Features

## Secure Authentication

* College email-only registration
* OTP verification system
* Password hashing using bcrypt
* JWT-based authentication

---

## Marketplace CRUD

Users can create listings with:

* Title
* Description
* Category
* Condition
* Price
* Listing Images

Users can:

* Create listings
* Delete their own listings
* View all listings
* Upload item photos

Unauthorized deletion attempts return:

```bash
403 Forbidden
```

---

## Image Upload Functionality

Campus OLX supports image uploads for marketplace listings.

### Features

* Users can upload product photos while creating listings
* Images are stored locally on the backend server using Multer
* Uploaded images are dynamically displayed on listing cards
* Unique filenames are generated to prevent collisions
* Placeholder image displayed when no image exists

This feature improves listing quality and provides a more realistic marketplace experience.

---

## Browse Marketplace

Dashboard displays:

*Listing image previews
*Item title and price
*Seller information
*Interest count
*Category and condition details
*Clean card-based marketplace UI

---

## Search and Filters

Users can filter listings using:

* Search by title
* Category filter
* Price range filter

Listings update dynamically without page reloads.

---

## Interest System

Seller contact details remain hidden initially.

When a user clicks **Show Interest**:

* Seller contact becomes visible
* Interest count increases

Example:

```bash
8 students interested
```

---

## Pagination

To improve performance and user experience:

* API returns 12 listings per page
* Navigation supported using Next / Previous controls

---

## Real-Time Chat System

Campus OLX includes a real-time messaging system powered by Socket.io.

### Features

* Private buyer-seller messaging
* Instant message delivery
* Persistent message history
* Auto-scroll chat interface
* WhatsApp-inspired modern chat UI

The chat system enables smooth communication directly inside the platform.

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/Nitya-sigadapu/campus_olx_app.git
cd campus_olx_app
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000
JWT_SECRET=your_secret_key
```

---

# Run Backend

```bash
cd backend
node server.js
```

---

# Run Frontend

```bash
cd frontend
npm start
```

---

# Local Development URLs

## Frontend

```bash
http://localhost:3000
```

## Backend API

```bash
http://localhost:5000
```

---

# Deployment

The project currently runs locally for development purposes.

Recommended deployment platforms:

* Render (Backend)
* Vercel / Netlify (Frontend)

---

# Future Improvements

* Cloud image storage using AWS S3 or Cloudinary
* Full production deployment
* Seller notification system
* Advanced recommendation engine
* Mobile responsive optimization
* Admin moderation dashboard

---

# Author

Developed as a full-stack web application project demonstrating:

* Authentication systems
* REST API development
* Database management
* Real-time communication
* File upload handling
* Modern React frontend architecture
* Secure backend engineering
* Full-stack application deployment workflows
