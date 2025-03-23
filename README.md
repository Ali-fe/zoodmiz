# Restaurant Management & Reservation Platform

## Introduction
This platform is designed to revolutionize the way restaurants manage their menus and interact with customers. It provides a comprehensive solution for restaurant owners to manage their menus, track orders, and handle reservations, while offering customers an easy way to discover restaurants, view menus, and make reservations or orders via QR codes.

---

## Features

### For Restaurant Owners:
- **Menu Management**:
  - Add, edit, or remove dishes from the menu.
  - Categorize dishes (e.g., appetizers, main courses, desserts).
  - Update prices and descriptions in real-time.
- **Order Management**:
  - View and manage customer orders in real-time.
  - Track order status (e.g., pending, in progress, completed).
- **Table & Reservation Management**:
  - Assign QR codes to tables for easy access.
  - Manage reservations and table availability.
- **Analytics**:
  - Track popular dishes and peak hours.
  - Generate sales reports.

### For Customers:
- **Discover Restaurants**:
  - Search for restaurants by location, cuisine, or rating.
  - View restaurant details, menus, and reviews.
- **QR Code Access**:
  - Scan a table's QR code to view the menu and place orders directly.
- **Reservation & Ordering**:
  - Reserve a table for a specific time.
  - Pre-order dishes for pickup or dine-in.
- **Location-Based Services**:
  - Find nearby restaurants using GPS.
  - Get directions to the restaurant.

---

## Technologies Used
- **Frontend**: React.js, HTML, CSS, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (for storing restaurant and menu data)
- **Authentication**: JWT (JSON Web Tokens)
- **QR Code Generation**: `qrcode` library
- **Maps & Location Services**: Google Maps API
- **Deployment**: Docker, AWS (EC2, S3)

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas (or a local MongoDB instance)
- Google Maps API key (for location services)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Ali-fe/mizban.git
   cd restaurant-platform
2. Install dependencies:
   ```bash
    npm install
3. Set up environment variables:
    Create a .env file in the root directory and add the following:
    ```.env
    PORT=3000
    MONGO_URL=mongodb://127.0.0.1:27017/mizban
    JWT_SECRET=secret
    JWT_EXPIRES_IN=1d
    GOOGLE_MAPS_API_KEY=your_google_maps_api_key
4. Run the application:
    ```bash
    npm start
5. Access the platform:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints
### Restaurant Management
- GET /api/restaurants - Get a list of all restaurants.
- POST /api/restaurants - Add a new restaurant.
- PUT /api/restaurants/:id - Update restaurant details.
- DELETE /api/restaurants/:id - Delete a restaurant.

### Menu Management
- GET /api/menus/:restaurantId - Get the menu of a specific restaurant.
- POST /api/menus - Add a new dish to the menu.
- PUT /api/menus/:id - Update a dish.
- DELETE /api/menus/:id - Remove a dish from the menu.

### Order Management
- GET /api/orders - Get all orders.
- POST /api/orders - Place a new order.
- PUT /api/orders/:id - Update order status.

### Reservation Management
- GET /api/reservations - Get all reservations.
- POST /api/reservations - Create a new reservation.
- DELETE /api/reservations/:id - Cancel a reservation.

## Contributing
- We welcome contributions! If you'd like to contribute, please follow these steps:
    - Fork the repository.
    - Create a new branch (git checkout -b feature/YourFeatureName).
    - Commit your changes (git commit -m 'Add some feature').
    - Push to the branch (git push origin feature/YourFeatureName).
    - Open a pull request.

## License
- This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
- For any questions or inquiries, please contact:
- Email: ali90fereidouni@gmail.com
- GitHub: Ali-fe

