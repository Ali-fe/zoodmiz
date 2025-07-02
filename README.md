# Zoodmiz – Restaurant Digital Menu & Management Platform

## Introduction
Zoodmiz is a full-stack platform for digital restaurant management. It enables restaurant owners to manage menus, tables, and orders, while customers can view menus, place orders, and reserve tables via a modern web interface and QR codes.

---

## Features

### For Restaurant Owners
- **Digital Menu Management:** Add, edit, or remove dishes and categories with images and prices.
- **Order Management:** View, update, and track customer orders in real time.
- **Table Management:** Add, update, or remove tables; assign QR codes for easy customer access.
- **User & Staff Management:** Manage user profiles and admin statistics.

### For Customers
- **QR Code Ordering:** Scan a table QR code to view the menu and place orders directly from a mobile device.
- **Restaurant Discovery:** Search for restaurants, view menus, and see details.
- **Table Reservation:** Reserve tables for specific times (if enabled).

---

## Technology Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens), HTTP-only cookies
- **Other:** Multer (file uploads), Morgan (logging), Axios, React Query, Chart.js, Leaflet (maps)

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm
- MongoDB (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Ali-fe/zoodmiz.git
cd zoodmiz
```

### 2. Install Dependencies
```bash
npm run startup-project
```
This installs dependencies for both `server` and `client`.

### 3. Environment Variables
Create a `.env` file in the `server` directory with the following content:
```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/zoodmiz
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### 4. Running the App (Development)
To start both server and client in development mode:
```bash
npm run dev
```
- Client: [http://localhost:5173](http://localhost:5173) (Vite default)
- Server API: [http://localhost:3000/api](http://localhost:3000/api)

---

## Project Structure
```
zoodmiz/
  client/    # React frontend
  server/    # Express backend
```

---

## Main API Endpoints
All endpoints are prefixed with `/api`. Most require authentication (except `/auth` and `/customer`).

### Auth
- `POST   /api/auth/register` – Register a new user
- `POST   /api/auth/login` – Login
- `GET    /api/auth/logout` – Logout

### Restaurants
- `GET    /api/restaurants` – Get restaurant info
- `PATCH  /api/restaurants` – Update restaurant info
- `DELETE /api/restaurants` – Delete restaurant
- `GET    /api/restaurants/tables` – List tables
- `POST   /api/restaurants/tables` – Add table
- `PATCH  /api/restaurants/tables/:tableId` – Update table
- `DELETE /api/restaurants/tables/:tableId` – Delete table

### Edibles (Menu)
- `GET    /api/edibles` – List all menu items
- `POST   /api/edibles` – Add menu item
- `GET    /api/edibles/:edibleId` – Get menu item
- `PATCH  /api/edibles/:edibleId` – Update menu item
- `DELETE /api/edibles/:edibleId` – Delete menu item
- `POST   /api/edibles/upload` – Upload menu item image
- `GET    /api/edibles/images` – List images
- `DELETE /api/edibles/images/:encodedpath` – Delete image

### Orders
- `GET    /api/orders` – List all orders
- `POST   /api/orders` – Place new order
- `GET    /api/orders/:orderId` – Get order
- `PATCH  /api/orders/:orderId` – Update order
- `DELETE /api/orders/:orderId` – Delete order

### Users
- `GET    /api/users/current-user` – Get current user info
- `GET    /api/users/admin/app-stats` – Get admin stats (admin only)
- `PATCH  /api/users/update-user` – Update user profile

### Customer (Public)
- `GET    /api/customer/menu/:restaurantId` – Get public menu for a restaurant

---

## Scripts
- `npm run dev` – Start both client and server (development)
- `npm run server` – Start server only (with nodemon)
- `npm run client` – Start client only
- `npm run install_server` – Install server dependencies
- `npm run install_client` – Install client dependencies

---

## Contributing
Pull requests are welcome! Please open an issue first to discuss major changes.

## License
MIT

