# AURA Coffee ☕

AURA Coffee is a full-stack coffee e-commerce application where users can explore coffee products, manage their cart, and place orders through a simple shopping experience.

## Features

- Browse coffee products
- User authentication
- Add and manage items in the shopping cart
- Checkout and order placement
- Payment integration with Razorpay
- Cash on Delivery (COD) option
- Responsive user interface

## Tech Stack

**Frontend**
- React.js
- React Router
- Tailwind CSS
- Swiper
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

**Payment**
- Razorpay
- Cash on Delivery

## Project Structure

```text
aura-coffee/
├── frontend/
├── backend/
└── README.md
```

*Update the folder structure above if your actual project uses different folder names.*

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Radhika089/aura-coffee.git
cd aura-coffee
```

### 2. Install dependencies

Install frontend and backend dependencies in their respective folders:

```bash
cd client
npm install
```

```bash
cd ../server
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend folder and add your required configuration:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 4. Run the application

Start the backend and frontend development servers using the scripts configured in their respective `package.json` files.

## Author

**Radhika Bansal**

- GitHub: [Radhika089](https://github.com/Radhika089)
