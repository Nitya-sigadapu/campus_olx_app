# Campus OLX – The Campus Resource Exchange

## Live Demo

🚀 **Deployed Application:** [Campus OLX](https://campus-olx-app-3.onrender.com/)

---

## Project Overview

Campus OLX is a secure campus-exclusive marketplace platform designed for students to buy and sell used academic and hostel-related resources such as books, electronics, cycles, lab coats, stationery, calculators, and room essentials.

Every semester, seniors often discard valuable items while juniors search for affordable alternatives. Campus OLX bridges this gap by creating a trusted student marketplace within the college ecosystem.

The platform includes secure authentication, cloud-based image uploads, real-time messaging, interest tracking, pagination, and advanced marketplace search and filtering.

---

## Tech Stack

| Category                | Technology          | Purpose                        |
| ----------------------- | ------------------- | ------------------------------ |
| Frontend                | React.js            | Dynamic component-based UI     |
| Backend                 | Node.js, Express.js | REST API development           |
| Database                | MySQL / TiDB Cloud  | Relational database management |
| Authentication          | JWT                 | Secure user sessions           |
| Password Security       | bcrypt              | Password hashing               |
| Real-Time Communication | Socket.io           | Instant messaging              |
| Image Storage           | Cloudinary          | Cloud image hosting            |
| API Requests            | Axios               | Frontend-backend communication |
| Deployment              | Render              | Application hosting            |

---

## Database

The project uses MySQL locally and TiDB Cloud for production deployment.

### Main Tables

* users
* listings
* interests
* messages
* reviews

---

## Demo Accounts

The following demo accounts are available for testing:

| Name      | Email                                               | Password |
| --------- | --------------------------------------------------- | -------- |
| Nitya     | [nitya@iiti.ac.in](mailto:nitya@iiti.ac.in)         | 123456   |
| Praharsha | [praharsha@iiti.ac.in](mailto:praharsha@iiti.ac.in) | 654321   |
| Prayuktha | [prayuktha@iiti.ac.in](mailto:prayuktha@iiti.ac.in) | 123456   |
| Charan    | [charan@iiti.ac.in](mailto:charan@iiti.ac.in)       | 123456   |

If login fails, users can create a new account using the signup page.

---

## OTP Verification

During signup:

* User enters email, password, and contact number
* Backend generates a 6-digit OTP
* OTP is displayed in the backend terminal
* User enters OTP in frontend
* Account becomes verified after successful validation

Example terminal output:

```text
Generated OTP for user@iiti.ac.in : 493078
```

---

# Features

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

This significantly improves listing quality and user experience.

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

## Architecture

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

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/Nitya-sigadapu/campus_olx_app.git
cd campus_olx_app
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

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

---

## Run Backend

```bash
cd backend
npm start
```

---

## Run Frontend

```bash
cd frontend
npm start
```

---

## Local Development URLs

### Frontend

```text
http://localhost:3000
```

### Backend API

```text
http://localhost:5000
```

---

## Deployment

### Frontend & Backend

* Render

### Database

* TiDB Cloud Serverless

### Image Storage

* Cloudinary

---

## Future Improvements

* Recommendation engine
* Seller ratings and reputation system
* Push notifications
* Campus-specific categories
* Mobile application
* Admin moderation dashboard

---

## Author

Developed as a full-stack web application project demonstrating:

* Authentication systems
* REST API development
* Database management
* Real-time communication
* Cloud image storage
* Modern React frontend architecture
* Secure backend engineering
* Full-stack application deployment workflows

**Nitya Sigadapu**

GitHub: https://github.com/Nitya-sigadapu
