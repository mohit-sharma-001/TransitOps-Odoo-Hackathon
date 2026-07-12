# TransitOps — Fleet Operations Management Platform

TransitOps is a modern digital platform built to manage, track, and automate transport company operations. It provides a complete workflow for tracking vehicles, drivers, trips, maintenance scheduling, fuel logs, and real-time operational expenses, complete with a performance and ROI analytics dashboard.

### 🔗 Deployed Application
* **Live Link:** [https://transit-ops-odoo-hackathon-lake.vercel.app/login](https://transit-ops-odoo-hackathon-lake.vercel.app/login)
* **Backend API:** [https://transitops-odoo-hackathon-m4od.onrender.com](https://transitops-odoo-hackathon-m4od.onrender.com)

---

## 🚀 Key Features

*   **Vehicle & Fleet Management:** Keep track of vehicle specifications, status (Available, On Trip, Maintenance), acquisition costs, and telemetry.
*   **Driver Roster:** Maintain driver profiles, licensing status, current vehicle assignments, and experience statistics.
*   **Trip Dispatch Center:** Schedule, dispatch, complete, or cancel cargo trips. Capture real-time trip parameters like cargo weight, odometer increments, and fuel usage.
*   **Maintenance & Service Log:** Schedule preventive services, record mechanic comments, cost details, and track completion/overdue statuses.
*   **Fuel & Refueling Records:** Keep an audit log of refueling locations, cost per liter, and quantity purchased to monitor efficiency.
*   **Reports & ROI Analytics:** Dynamic dashboards visualizing fleet utilization, total distance run, fuel efficiency metrics ($km/L$), operating costs, and estimated ROI calculations.

---

## 🛠️ Technology Stack

### Backend
*   **Engine:** Node.js + Express.js
*   **ORM:** Prisma Client
*   **Database:** SQLite (local development file database)
*   **Authentication:** JSON Web Tokens (JWT) for secure role-based route protection (`FleetManager`, `Dispatcher`, `SafetyOfficer`, `FinancialAnalyst`)

### Frontend
*   **Framework:** React 19 + Vite
*   **Styling:** Tailwind CSS + Vanilla CSS utilities
*   **Icons:** Lucide React
*   **Client Network:** Axios (with request & response token interceptors)
*   **Animations:** Framer Motion

---

## 📁 Repository Structure

```
├── backend/
│   ├── prisma/             # Schema definition & SQLite database file
│   ├── src/
│   │   ├── controllers/    # Route controllers (Auth, Vehicles, Drivers, Trips, Reports, etc.)
│   │   ├── middleware/     # Auth and role verification middlewares
│   │   ├── routes/         # Express API route endpoints
│   │   ├── utils/          # Prisma client and helper functions
│   │   └── app.js          # Express app bootstrap
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI elements & feature tables (TripTable, DriverTable, etc.)
│   │   ├── context/        # React context (Auth & Theme)
│   │   ├── pages/          # Views (Dashboard, Trips, Reports, Maintenance, Login, etc.)
│   │   ├── services/       # API integration layers
│   │   ├── App.jsx         # App router and global error boundary
│   │   └── index.css       # Core Tailwind CSS directives
│   └── package.json
│
└── README.md               # Documentation guide
```

---

## ⚙️ Getting Started

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm (v9 or higher)

### 1. Database Setup
The backend uses SQLite, which requires no external database engine installation. 

Navigate to the `backend/` directory and set up the database schema:
```bash
cd backend
npm install
npx prisma db push
```

### 2. Run the Backend
Start the Express server on port `5000`:
```bash
npm run dev
```

### 3. Run the Frontend
In a new terminal window, navigate to the `frontend/` directory and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at [http://localhost:5173](http://localhost:5173).

---

## 🔧 Recent Bug Fixes & Stability Enhancements

We recently addressed three critical bugs in the codebase to restore platform stability and ensure correct rendering:

