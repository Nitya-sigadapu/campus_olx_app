# Campus OLX – The Campus Resource Exchange

🚀 **Live Demo:** [Campus OLX](https://campus-olx-app-3.onrender.com/)

## Project Overview

Campus OLX is a secure campus-exclusive marketplace platform designed for students to buy and sell academic and hostel-related resources such as books, electronics, calculators, cycles, lab coats, stationery, and room essentials.

Every semester, seniors often discard valuable items while juniors search for affordable alternatives. Campus OLX bridges this gap by creating a trusted student marketplace within the college ecosystem.

Access is restricted to verified institutional email IDs only, ensuring that only college students can use the platform. The platform includes secure authentication, cloud-hosted image uploads, real-time messaging, interest tracking, seller ratings and reviews, pagination, and advanced marketplace search and filtering.

---

# Tech Stack

| Category                | Technology          | Purpose                              |
| ----------------------- | ------------------- | ------------------------------------ |
| Frontend                | React.js            | Dynamic component-based UI           |
| UI Styling              | Tailwind CSS        | Responsive and modern user interface |
| Backend                 | Node.js, Express.js | REST API development                 |
| Database                | MySQL / TiDB Cloud  | Relational database management       |
| Authentication          | JWT                 | Secure user sessions                 |
| Password Security       | bcrypt              | Password hashing                     |
| Real-Time Communication | Socket.io           | Instant messaging                    |
| Image Storage           | Cloudinary          | Cloud image hosting                  |
| API Requests            | Axios               | Frontend-backend communication       |
| Deployment              | Render              | Application hosting                  |

---

# Database

The project uses MySQL locally and TiDB Cloud in production.

## Main Tables

* users
* listings
* interests
* messages
* reviews

## Relationships

* User → Listings (One-to-Many)
* Users ↔ Listings through Interests (Many-to-Many)
* Users → Messages (One-to-Many via sender and receiver)
* Users ↔ Reviews (Many-to-Many through seller ratings and reviews)

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
3. OTP is displayed in backend logs / Render logs (development mode)
4. User enters OTP in frontend
5. Account becomes verified after successful validation

---

# Features

## Secure Campus Access

* Registration restricted to institutional email IDs only
* Student-only marketplace ecosystem
* Prevents unauthorized external access
* Trusted campus community environment

---

## Secure Authentication

* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Persistent login sessions

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

```text
403 Forbidden
```

---

## Cloud Image Uploads

Campus OLX supports image uploads through Cloudinary.

### Features

* Cloud-hosted product images
* Optimized image delivery
* Unique image URLs stored in database
* Automatic image management
* Placeholder image support when no image exists

---

## Browse Marketplace

Dashboard displays:

* Listing image previews
* Item title and price
* Seller information
* Interest count
* Category and condition details
* Clean card-based marketplace UI

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

```text
8 students interested
```

---

## Seller Rating & Reputation System

Campus OLX includes a seller reputation system to improve trust within the marketplace.

Features:

* View seller profiles directly from listings
* Submit ratings and reviews for sellers
* View average seller rating
* View seller review history
* Reputation-based buyer decision support

This system helps buyers identify reliable sellers while encouraging accountability and positive marketplace interactions.

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

---

## Responsive User Interface

Built using React.js and Tailwind CSS.

### Features

* Fully responsive design
* Optimized for desktops, tablets, and mobile browsers
* Modern card-based marketplace interface
* Responsive chat and dashboard layouts
* Consistent user experience across screen sizes

---

# Architecture

```text
React Frontend
      |
      v
Express Backend
      |
      +------> TiDB Cloud Database
      |
      +------> Cloudinary Image Storage
      |
      +------> Socket.io Real-Time Communication
```

---

# Setup Instructions

## Clone Repository

```bash
git clone https://github.com/Nitya-sigadapu/campus_olx_app.git
cd campus_olx_app
```

## Install Backend Dependencies

```bash
cd backend
npm install
```

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Run Backend

```bash
cd backend
npm start
```

## Run Frontend

```bash
cd frontend
npm start
```

---

# Local Development URLs

### Frontend

```text
http://localhost:3000
```

### Backend API

```text
http://localhost:5000
```

---

# Deployment

## Application Hosting

* Render

## Database

* TiDB Cloud Serverless

## Image Storage

* Cloudinary

---

# Future Improvements

* Personalized recommendation engine
* Push notifications for chats and listing activity
* Native mobile application using React Native
* Campus-specific category recommendations
* Admin moderation and reporting dashboard
* AI-powered listing recommendations

---

# Author

Developed as a full-stack web application project demonstrating:

* Authentication systems
* REST API development
* Database management
* Real-time communication
* Cloud image storage
* Seller reputation and review management
* Modern React frontend architecture
* Secure backend engineering
* Full-stack application deployment workflows

**Nitya Sigadapu**

GitHub: [Nitya-sigadapu](https://github.com/Nitya-sigadapu)

Live Demo: [Campus OLX](https://campus-olx-app-3.onrender.com/)
