# 🖨️ PrintShop — Digital Print Shop Management & Customer Ordering System

A full-stack web application that connects a **physical print shop** with its customers. Shop owners manage orders, pricing, printers, and QR codes from a private dashboard, while customers order prints from a separate public page accessed via a shop-specific QR code — no login required.

---

## ✨ Features

### Shop Owner (`/dashboard`)
- Real-time new orders via Socket.IO (no page refresh)
- Accept / Reject / Print / Ready for Pickup / Complete workflow
- Configure shop info, business hours, open/closed status
- Editable printing prices (B&W / Color, single / double sided)
- Unique shop QR code — view, download, print, copy, share
- Add, remove, test, and set default printers (network / USB / Bluetooth)
- Printer connection testing via real network check (port 9100)

### Customer (`/order/:shopSlug`)
- Upload documents (PDF, DOC, DOCX, JPG, PNG, JPEG)
- Configure color mode, sides, copies, paper size
- Live price calculation from shop's MongoDB pricing
- Real-time order status updates
- Mobile-first responsive design

### Backend
- Express + MongoDB (Mongoose) REST API
- Socket.IO real-time events
- Secure file downloads (no public file URLs)
- Automatic expired file purge
- Input-validated order pricing (never trust frontend)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router, Tailwind CSS, Framer Motion, Socket.IO client |
| Backend | Node.js, Express 5, Socket.IO, Multer, Mongoose |
| Database | MongoDB Atlas (existing) |
| Realtime | Socket.IO |

---

## 📁 Project Structure

```
print-shop-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # orderController, shopController
│   │   ├── models/          # Order, ShopConfig
│   │   ├── routes/          # orders, shop, files
│   │   ├── middleware/      # errorHandler
│   │   ├── socket/          # socketHandlers
│   │   ├── db/              # mongoose connection
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # OrderCard, FileUploadArea, PriceDisplay...
│   │   ├── layouts/         # DashboardLayout
│   │   ├── pages/
│   │   │   ├── dashboard/   # NewOrders, AllOrders, Completed, Printers, Settings
│   │   │   └── customer/    # OrderPage (public)
│   │   ├── hooks/           # useSocket
│   │   └── App.js
│   └── package.json
└── docs/                    # API, Setup, Deployment guides
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas connection string

### Backend
```bash
cd backend
npm install
# create .env with MONGODB_URI, PORT, FRONTEND_URL
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# create .env.development with REACT_APP_API_URL=http://localhost:5000
npm start
```

---

## 🔗 Key Routes

| Route | Audience |
|---|---|
| `/` | Redirects to `/dashboard` |
| `/dashboard/new-orders` | Shop Owner |
| `/dashboard/orders` | Shop Owner |
| `/dashboard/completed` | Shop Owner |
| `/dashboard/printers` | Shop Owner |
| `/dashboard/settings` | Shop Owner |
| `/order/:shopSlug` | Customer (public) |

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Create order (multipart) |
| PUT | `/api/orders/:id` | Update order status |
| GET | `/api/shop/config` | Get shop config |
| GET | `/api/shop/config/:slug` | Get shop by slug |
| POST | `/api/shop/config` | Update shop config |
| POST | `/api/shop/printer/test` | Test printer connection |
| POST | `/api/files/upload` | Upload file |
| GET | `/api/files/download/:filename` | Secure download |

---

## 🔒 Security & Privacy

- Customer files are **not** publicly accessible — downloads require a valid order reference
- Files auto-purge after retention period (default 48h)
- Prices are always recalculated on the backend

---

## 📄 License

ISC
