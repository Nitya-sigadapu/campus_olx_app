# Campus OLX – The Resource Exchange

## Project Description

Campus OLX is a secure campus-exclusive marketplace designed for students to buy and sell used academic resources such as books, lab coats, electronics, and stationery.

Every semester, seniors discard valuable items while juniors struggle to find them at affordable prices. Campus OLX solves this problem by creating a platform where students can easily exchange these resources within their college community.

The platform ensures security by allowing only **college email IDs** to register and uses **OTP verification and JWT authentication** to protect user accounts.

The application also includes features such as **interest tracking, contact reveal, pagination, search filters, and real-time chat between users**.

---

# Tech Stack

| Category          | Technology | Reason                                    |
| ----------------- | ---------- | ----------------------------------------- |
| Frontend          | React      | Component-based UI and fast development   |
| Backend           | Express.js | Lightweight REST API framework            |
| Database          | MySQL      | Structured relational database            |
| Authentication    | JWT        | Secure session handling                   |
| Password Security | bcrypt     | Secure password hashing                   |
| Real-time Chat    | Socket.io  | Enables instant messaging                 |
| API Requests      | Axios      | Simplifies frontend-backend communication |

---

# Database

The project uses a **local MySQL database** named:

```
campus_olx
```

Main tables used in the project:

```
users
listings
interests
messages
```

---

# Demo Accounts (For Testing)

The following accounts already exist in the database and can be used for testing.

| Name      | Email                                               | Password |
| --------- | --------------------------------------------------- | -------- |
| Nitya     | [nitya@iiti.ac.in](mailto:nitya@iiti.ac.in)         | 123456   |
| Praharsha | [praharsha@iiti.ac.in](mailto:praharsha@iiti.ac.in) | 654321   |
| Prayuktha | [prayuktha@iiti.ac.in](mailto:prayuktha@iiti.ac.in) | 123456   |
| Charan    | [charan@iiti.ac.in](mailto:charan@iiti.ac.in)       | 123456   |
| Amulya    | [amulya@iiti.ac.in](mailto:amulya@iiti.ac.in)       | 123456   |
| Roja      | [roja@iiti.ac.in](mailto:roja@iiti.ac.in)           | 123456   |

If login fails, you can create a new account using the signup page.

---

# OTP Verification

During signup:

1. User enters email, password and contact number.
2. The backend generates a **6-digit OTP**.
3. The OTP is printed in the **backend terminal (server console)**.
4. The user enters the OTP in the frontend.
5. After verification, the account becomes active.

Example terminal output:

```
Generated OTP for user@iiti.ac.in : 493078
```

---

# Features

## Secure Authentication

* Signup restricted to college email IDs
* OTP verification required
* Passwords hashed using **bcrypt**
* JWT-based login sessions

---

## Marketplace CRUD

Users can create listings with:

* Title
* Description
* Category
* Condition
* Price

Users can also delete their own listings.
Unauthorized attempts return **403 Forbidden**.

---

## Browse Marketplace

The dashboard displays all marketplace items including:

* Item title
* Price
* Number of interested students
* Seller contact information (after showing interest)

---

## Search and Filters

Users can filter listings using:

* Search by item title
* Category filter
* Price range filter

Listings update dynamically.

---

## Interest System

Seller contact information is hidden by default.

When a user clicks **Show Interest**:

* Seller contact number becomes visible
* Interest count increases

Example:

```
5 students interested
```

---

## Pagination

To maintain performance:

* API returns **10 listings per page**
* Navigation using **Next / Previous buttons**

---

## Real-Time Chat (Bonus Feature)

Campus OLX includes a real-time chat system implemented using **Socket.io**.

Features:

* Private messaging between buyers and sellers
* Instant message delivery
* Message history stored in database
* Auto-scroll chat interface

---

# Setup Instructions

## 1 Clone Repository

```bash
git clone https://github.com/Nitya-sigadapu/campus_olx_app.git
cd campus_olx_app
```

---

## 2 Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3 Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 4 Environment Variables

Create a `.env` file inside the **backend** folder.

Example:

```
PORT=5000
JWT_SECRET=your_secret_key
```

---

## 5 Run Backend

```bash
cd backend
node server.js
```

---

## 6 Run Frontend

```bash
cd frontend
npm start
```

---

# Local Development URLs

Frontend

```
http://localhost:3000
```

Backend API

```
http://localhost:5000
```

---

# Hosted Link

Currently running locally.
Deployment can be done using:

* **Render** (backend)
* **Vercel / Netlify** (frontend)

---

# Future Improvements

* Image upload for listings
* Wishlist / favorites feature
* Seller notification system
* Mobile responsive improvements
* Cloud deployment

---

# Author

Developed as a **full-stack web application project** demonstrating:

* Authentication systems
* REST API design
* Database management
* Real-time communication
* Modern React frontend architecture
