# 🛡️ SENTRY

**Keep your family connected, safely.**

Sentry is a real-time family location-sharing platform. Create an encrypted "family circle," invite your inner circle with a secure code, and monitor live locations on a shared map — with fine-grained, per-member visibility controls managed by admins.

---

## ✨ Features

- **Phone-based authentication** — signup/login with phone number + password, secured with JWT and bcrypt-hashed passwords.
- **Family Circles** — create a circle, generate a shareable invite link, and let members join instantly.
- **Multi-family support** — belong to and switch between multiple family circles from one account.
- **Multi-admin roles** — promote or demote members to admin; the system always guarantees at least one admin remains.
- **Granular location permissions** — admins control exactly who can view whose live location (`canViewLocationsOf`).
- **Real-time location tracking** — live position updates streamed over WebSockets (Socket.IO), fanned out only to permitted viewers.
- **Interactive map** — built with Leaflet + marker clustering, custom avatar markers, online/offline status, and "last seen" timestamps.
- **Member management** — remove members, leave a circle, and safeguards against removing the last remaining admin.
- **Account settings** — update profile info, change password, and delete account (with cascading cleanup from all family circles).
- **Responsive UI** — desktop sidebar + mobile bottom nav, built with Tailwind CSS.

---

## 🧱 Tech Stack

### Frontend (`/client`)

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Router v7](https://reactrouter.com/)
- [Leaflet](https://leafletjs.com/) / `react-leaflet` / `react-leaflet-cluster` for mapping
- [Socket.IO Client](https://socket.io/) for real-time updates
- [Axios](https://axios-http.com/) for API calls
- [react-hot-toast](https://react-hot-toast.com/) for notifications

### Backend (`/server`)

- [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [Socket.IO](https://socket.io/) for real-time location broadcasting
- [JWT](https://jwt.io/) for authentication
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing

---

## 📁 Project Structure

```
sentry/
├── client/                    # React frontend
│   └── src/
│       ├── apiFuncs/          # API call wrappers (axios)
│       ├── components/        # Reusable UI components (Header, Sidebar, Map markers, etc.)
│       ├── context/            # AuthContext & LocationContext (global state)
│       ├── layouts/           # DashboardLayout wrapper
│       ├── pages/              # Route-level pages (Auth, Map, Family, Settings, etc.)
│       └── utils/              # Route guards, axios instance, helpers
│
└── server/                    # Express backend
    ├── controllers/           # Route handlers (auth, user, family, location)
    ├── middleware/             # Auth guards, family checks, error handling
    ├── models/                 # Mongoose schemas (User, Family)
    ├── routes/                 # Express routers
    ├── utils/                  # Token signing/verification, invite code gen, family helpers
    ├── app.js                  # Express app configuration
    ├── server.js                # Entry point, DB connection, HTTP + Socket.IO server
    └── socket.js                # Real-time location & presence broadcasting
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/sentry.git
cd sentry
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `config.env` file inside `/server`:

```env
DATABASE=mongodb+srv://<username>:<db_password>@cluster.mongodb.net/sentry?retryWrites=true&w=majority
DATABASE_PASSWORD=your_mongo_password
PORT=3000
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=90d
VITE_FRONTEND_URL=http://localhost:5173
```

Run the server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside `/client`:

```env
VITE_BACKEND_URL=http://localhost:3000/api/v1
VITE_BASE_BACKEND_URL=http://localhost:3000
```

Run the client:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔌 API Overview

| Method   | Endpoint                                        | Description                                       |
| -------- | ----------------------------------------------- | ------------------------------------------------- |
| `POST`   | `/api/v1/users/signup`                          | Register a new user                               |
| `POST`   | `/api/v1/users/login`                           | Log in and receive a JWT                          |
| `GET`    | `/api/v1/users/me`                              | Get current authenticated user                    |
| `PATCH`  | `/api/v1/users/me`                              | Update profile (name)                             |
| `PATCH`  | `/api/v1/users/change-password`                 | Change account password                           |
| `DELETE` | `/api/v1/users/me`                              | Delete account                                    |
| `POST`   | `/api/v1/family/createFamily`                   | Create a new family circle                        |
| `POST`   | `/api/v1/family/joinFamily/:inviteCode`         | Join a circle via invite code                     |
| `GET`    | `/api/v1/family/me`                             | Get all circles the user belongs to               |
| `POST`   | `/api/v1/family/:familyId/removeMember`         | Admin removes a member                            |
| `POST`   | `/api/v1/family/:familyId/leaveFamily`          | Leave a family circle                             |
| `PATCH`  | `/api/v1/family/:familyId/permissions`          | Update a member's location-visibility permissions |
| `PATCH`  | `/api/v1/family/:familyId/makeAdmin`            | Promote a member to admin                         |
| `PATCH`  | `/api/v1/family/:familyId/revokeAdmin`          | Demote an admin to member                         |
| `POST`   | `/api/v1/location/update`                       | Update the current user's location                |
| `GET`    | `/api/v1/location/getFamilyLocations/:familyId` | Get all visible member locations for a circle     |

### Real-time Events (Socket.IO)

| Event                   | Direction       | Description                                     |
| ----------------------- | --------------- | ----------------------------------------------- |
| `send_live_location`    | client → server | Push a live GPS update                          |
| `receive_live_location` | server → client | Receive a permitted member's live location      |
| `family_member_status`  | server → client | Online/offline presence change for a member     |
| `join_family_room`      | client → server | Join a family's room for future scoped features |

---

## 🔐 Security Notes

- Passwords are hashed with `bcryptjs` before storage; plaintext passwords are never persisted.
- All family and location routes are protected by JWT-based middleware.
- Location visibility is enforced server-side per family member via `canViewLocationsOf`, not just hidden client-side.
- At least one admin is always required per family circle — admin removal/demotion is blocked if it would leave the circle without one.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or file an issue.
