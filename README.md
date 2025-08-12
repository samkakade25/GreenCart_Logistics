# GreenCart Logistics Management System

### Frontend Deployment Link: [https://green-cart-logistics-eight.vercel.app/](https://green-cart-logistics-eight.vercel.app/)
### Backend Deployment Link: [https://greencart-logistics-1plr.onrender.com/](https://greencart-logistics-1plr.onrender.com/)

## 1. Project Overview & Purpose
GreenCart Logistics is a logistics management web application designed to help companies manage delivery simulations, track KPIs (profit, efficiency, on-time deliveries), and manage essential business data such as drivers, routes, and orders.

### The system consists of:
- **Simulation Module** – Run and view delivery simulations with configurable inputs.
- **Dashboard** – View KPIs and performance charts.
- **Management Pages** – CRUD interfaces for Drivers, Routes, and Orders.

### Purpose:
To optimize delivery operations by simulating schedules, improving efficiency, and tracking real-time data.

## 2. Tech Stack Used

### Frontend:
- **React.js** — UI library
- **TypeScript** — Strongly typed JavaScript
- **Tailwind CSS** — Utility-first CSS framework
- **Grommet** — UI component library
- **Axios** — HTTP client for API calls

### Backend:
- **Node.js** — Server runtime
- **Express.js** — Web application framework
- **PostgreSQL** — Database
- **Prisma** — ORM for PostgreSQL
- **CORS** — Cross-Origin Resource Sharing middleware

## 3. Setup Instructions

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/samkakade25/GreenCart_Logistics.git
cd GreenCart_Logistics/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Go to backend folder
cd ../backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run database migrations (if using Prisma)
npx prisma init
npx prisma migrate dev --name init
npx prisma generate

# Start backend server
npm start
```

## 4. Environment Variables

### Backend .env
```bash
PORT=
DATABASE_URL=
JWT_SECRET=
NODE_ENV=
```

## 5. API Documentation

### Base URL
     https://greencart-logistics-1plr.onrender.com/api

### Endpoints
     **Simulation**
     **POST /simulation/simulate**
     Runs a new simulation based on input parameters.
     *Request:*
      {
        "availableDrivers": 3,
        "routeStartTime": "08:00",
        "maxHoursPerDriver": 8
      }

     *Response:*
      {
        "simulation": {
          "id": 2,
          "timestamp": "2025-08-12T16:33:10.479Z",
          "availableDrivers": 3,
          "routeStartTime": "08:00",
          "maxHoursPerDriver": 8,
          "totalProfit": 36002.8,
          "efficiency": 80
                      },
            "driverStats": [
                { "driverId": 3, "assignedOrders": 8, "totalHours": 7.21 },
                { "driverId": 1, "assignedOrders": 7, "totalHours": 7.71 },
                { "driverId": 2, "assignedOrders": 10, "totalHours": 7.81 }
                          ],
          "totalDeliveries": 25,
          "onTimeDeliveries": 20
       }

       **GET /simulation/latest**
       Fetches the most recent simulation result.
       *Response:*

          {
            "id": 4,
            "timestamp": "2025-08-12T16:57:20.468Z",
            "availableDrivers": 2,
            "routeStartTime": "08:00",
            "maxHoursPerDriver": 7,
            "totalProfit": 22979.2,
            "efficiency": 75
          }

### Postman Collection
     https://www.postman.com/spaceflight-geologist-44542914/public-workplace/collection/cw14sjh/greencart-logistics?action=share&creator=32467370

