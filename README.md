# Product CRUD App (React + Node.js + MySQL)

A simple full-stack app where users can register, log in, and add, view, edit and delete products.

**Backend:** Node.js, Express, MySQL, JWT, bcrypt, multer
**Frontend:** React (Vite), React Router, Axios

## Features

- Register and login with JWT authentication
- Passwords hashed with bcrypt
- Protected API routes using auth middleware
- Product CRUD (list, add, edit, view, delete)
- Validation on backend and frontend forms
- Axios interceptor adds the token to every request, and logs out if the token expires
- Loading and error messages
- Search and pagination (bonus)
- Product image upload with multer (bonus)

## Setup

Short step-by-step guide: [GETTING_STARTED.md](GETTING_STARTED.md)

### 1. Database

Open MySQL (Workbench or terminal) and run the file `backend/database/schema.sql`.

### 2. Backend

```bash
cd backend
npm install
```

Open `backend/.env` and put your MySQL password in `DB_PASSWORD`. Then:

```bash
npm start
```

The API runs on http://localhost:5000

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## API Endpoints

| Method | URL | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login, returns token |
| GET | /api/products?page=1&search= | Get products (protected) |
| GET | /api/products/:id | Get one product (protected) |
| POST | /api/products | Create product, form-data with optional `image` (protected) |
| PUT | /api/products/:id | Update product, form-data with optional `image` (protected) |
| DELETE | /api/products/:id | Delete product (protected) |

Protected routes need the header `Authorization: Bearer <token>`.

Uploaded images are saved in `backend/uploads` and served at `http://localhost:5000/uploads/<filename>`. Only image files up to 2MB are allowed.

## Folder Structure

```
crud-app/
├── backend/
│   ├── config/
│   │   └── db.js                   # MySQL connection
│   ├── controllers/
│   │   ├── authController.js       # register, login logic
│   │   └── productController.js    # product CRUD logic
│   ├── database/
│   │   └── schema.sql              # database tables
│   ├── middleware/
│   │   ├── authMiddleware.js       # checks JWT token
│   │   └── uploadMiddleware.js     # image upload (multer)
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth URLs
│   │   └── productRoutes.js        # /api/products URLs
│   ├── uploads/                    # uploaded images (created automatically)
│   ├── utils/
│   │   └── validators.js           # request body validation
│   ├── .env.example
│   ├── app.js                      # express app setup
│   ├── package.json
│   └── server.js                   # starts the server
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js            # axios instance + interceptors + IMAGE_URL
    │   ├── services/
    │   │   ├── authService.js      # login, register API calls
    │   │   └── productService.js   # product API calls
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── PrivateRoute.jsx    # protects pages
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   └── products/
    │   │       ├── ProductList.jsx # list, search, pagination, delete
    │   │       ├── ProductForm.jsx # add + edit
    │   │       └── ProductView.jsx
    │   ├── styles/
    │   │   └── index.css
    │   ├── App.jsx                 # all routes
    │   └── main.jsx
    └── package.json
```

**How a request flows (backend):** `server.js` → `app.js` → `routes` → `middleware` (checks token) → `controllers` (validation + SQL) → response.

**How the frontend calls the API:** `pages` → `services` → `api/axios.js` (adds token) → backend.
