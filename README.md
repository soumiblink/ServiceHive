# 🐝 ServiceHive

ServiceHive is a **slot management and swapping platform** where users can create events, mark them as swappable, and send/accept swap requests seamlessly.  
Built with **Node.js, Express, MongoDB**, and **React (Vite)** — designed for scalability and clean architecture.

---

## 🚀 Live Demo

🌐 **Frontend:** [https://service-hive-six.vercel.app](https://service-hive-six.vercel.app)  
📘 **Postman Docs:** [View Full API Documentation](https://documenter.getpostman.com/view/29319175/2sB3WpQ1Ju)  
💻 **GitHub Repository:** [Imran00852/ServiceHive](https://github.com/Imran00852/ServiceHive)

---

## 🧠 Tech Stack

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Frontend         | React (Vite)            |
| Backend          | Node.js, Express.js     |
| Database         | MongoDB (Mongoose)      |
| Authentication   | JWT + Cookies           |
| Containerization | Docker & Docker Compose |
| Deployment       | Vercel (Frontend)       |

---

## 🏗️ Project Structure

```
ServiceHive/
│
├── client/              # React (Vite) frontend
├── server/              # Express + MongoDB backend
├── docker-compose.yml   # Docker Compose setup
└── README.md
```

---

## ⚙️ Setup Instructions

### 🧩 Prerequisites

- Node.js (v18+)
- Docker & Docker Compose (if using container setup)
- npm or yarn

---

### 🏃‍♂️ Local Setup (Without Docker)

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/Imran00852/ServiceHive.git
cd ServiceHive
```

#### 2️⃣ Setup the backend

```bash
cd server
npm install
```

Create a `.env` file inside `/server`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

#### 3️⃣ Setup the frontend

```bash
cd ../client
npm install
npm run dev
```

Visit frontend → **http://localhost:5173**

---

### 🐳 Setup using Docker Compose (Recommended)

Run both frontend and backend in one command:

```bash
docker compose up --build
```

This will:

- Start the **client** at → `http://localhost:5173`
- Start the **server** at → `http://localhost:5000`
- Spin up a **MongoDB** container at `mongo:27017`

You can stop everything using:

```bash
docker compose down
```

---

## 🔐 Authentication Routes

| Method | Endpoint             | Description                 | Protected |
| ------ | -------------------- | --------------------------- | --------- |
| `POST` | `/api/user/register` | Register a new user         | ❌        |
| `POST` | `/api/user/login`    | Login and receive JWT token | ❌        |
| `GET`  | `/api/user/me`       | Get logged-in user details  | ✅        |
| `GET`  | `/api/user/logout`   | Logout and clear token      | ✅        |

---

## 🎟️ Event Routes

| Method   | Endpoint                    | Description                   | Protected |
| -------- | --------------------------- | ----------------------------- | --------- |
| `POST`   | `/api/events`               | Create a new event/slot       | ✅        |
| `GET`    | `/api/events`               | Get all your events           | ✅        |
| `DELETE` | `/api/events/:id`           | Delete an event               | ✅        |
| `PATCH`  | `/api/events/:id/swappable` | Toggle event swappable status | ✅        |

---

## 🔄 Swap Request Routes

| Method | Endpoint                        | Description                               | Protected |
| ------ | ------------------------------- | ----------------------------------------- | --------- |
| `GET`  | `/api/swappable-slots`          | Get list of available (swappable) slots   | ✅        |
| `POST` | `/api/swap-request`             | Create a new swap request                 | ✅        |
| `POST` | `/api/swap-response/:requestId` | Accept or reject a swap request           | ✅        |
| `GET`  | `/api/swap-requests`            | Get all swap requests related to the user | ✅        |

---

## 📦 Environment Variables

| Variable       | Description            | Example                           |
| -------------- | ---------------------- | --------------------------------- |
| `PORT`         | Server port            | 5000                              |
| `MONGO_URI`    | MongoDB connection URI | mongodb://mongo:27017/ServiceHive |
| `JWT_SECRET`   | Secret for JWT signing | your_secret_here                  |
| `FRONTEND_URL` | Frontend base URL      | http://localhost:5173             |

---

## 🧰 Docker Services Overview

| Service  | Description         | Port  |
| -------- | ------------------- | ----- |
| `client` | React Vite frontend | 5173  |
| `server` | Express backend     | 5000  |
| `mongo`  | MongoDB database    | 27017 |

---

## 🧪 API Testing

You can explore and test all APIs directly using this Postman collection:  
👉 [Postman Documentation](https://documenter.getpostman.com/view/29319175/2sB3WpQ1Ju)

Each route is grouped by module (Users, Events, Swap Requests) and ready to test with example payloads.

---

---

## 🧑‍💻 Author

**Imran Bhat**  
💼 Full Stack Developer (MERN)  
📍 [GitHub](https://github.com/Imran00852)

---

> _Built with ❤️ by Imran Bhat._
