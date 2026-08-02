# 🛡️ SENTRY

**Keep your family connected, safely.**

Sentry is a real-time family location-sharing platform. Create an encrypted "family circle," invite your inner circle with a secure link, and monitor live locations on a shared map — with fine-grained, per-member visibility controls managed by admins.

---

## ✨ Features

- **Phone-based authentication** — signup/login with phone number + password, secured with JWT and bcrypt-hashed passwords. Signup also collects an email, used solely for account recovery.
- **Email OTP password recovery** — forgot your password? Request a 6-digit OTP sent to your registered (masked) email via Brevo, verify it, then set a new password. Works both for logged-out users (via phone number) and logged-in users changing their password from Settings.
- **Family Circles** — create a circle and generate a shareable invite link (`/join/:inviteCode`) that lets members join instantly, including auto-join on signup/login if a person opens the link before authenticating.
- **Multi-family support** — belong to multiple family circles at once and switch your "active" circle from a dropdown in the sidebar (desktop) or top bar (mobile), persisted in `localStorage`.
- **Multi-admin roles** — promote or demote members to admin; the system always guarantees at least one admin remains in a circle.
- **Granular location permissions** — admins control exactly who can view whose live location (`canViewLocationsOf`), enforced server-side, not just hidden client-side.
- **Real-time location tracking** — live position updates streamed over WebSockets (Socket.IO), fanned out only to permitted viewers, across every family the user belongs to simultaneously.
- **Interactive map** — built with Leaflet + marker clustering, custom avatar markers with online/offline glow, device-type icons, "last seen" timestamps, a Solo Mode banner when no circle exists, and Live Follow / Fit Circle / My Position quick-action buttons.
- **Member management** — remove members, leave a circle, and safeguards against removing or demoting the last remaining admin.
- **Account settings** — dedicated Settings page for updating profile info, changing password (current-password flow or OTP recovery flow), local notification-preference toggles, signing out, and deleting your account (with cascading cleanup and last-admin protection across every circle you're in).
- **Resilient auth/session bootstrap** — placeholder-user pattern avoids UI flicker on reload while the session and family list rehydrate.
- **Responsive UI** — desktop sidebar + mobile bottom nav, 404 page, and an error boundary, all built with Tailwind CSS.

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
- [ua-parser-js](https://www.npmjs.com/package/ua-parser-js) for device/OS detection shown on markers & popups

### Backend (`/server`)

- [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [Socket.IO](https://socket.io/) for real-time location broadcasting
- [JWT](https://jwt.io/) for authentication
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing
- [Brevo](https://www.brevo.com/) (`@getbrevo/brevo`) for transactional OTP emails

---

## 📁 Project Structure

```
sentry/
├── client/                    # React frontend
│   └── src/
│       ├── apiFuncs/          # API call wrappers (axios)
│       ├── components/        # Reusable UI components (Header, Sidebar, Map markers, ForgotPasswordModal, etc.)
│       ├── context/            # AuthContext & LocationContext (global state)
│       ├── layouts/           # DashboardLayout wrapper
│       ├── pages/              # Route-level pages (Auth, Map, Family, Settings, JoinFamily, OnboardingCrossroads, NotFound)
│       └── utils/              # Route guards, axios instance, helpers
│
└── server/                    # Express backend
    ├── controllers/           # Route handlers (auth, user, family, location)
    ├── middleware/             # Auth guards, family checks, error handling
    ├── models/                 # Mongoose schemas (User, Family)
    ├── routes/                 # Express routers
    ├── utils/                  # Token signing/verification, invite code gen, family helpers, email templates, sendEmail
    ├── app.js                  # Express app configuration
    ├── server.js                # Entry point, DB connection, HTTP + Socket.IO server
    └── socket.js                # Real-time location & presence broadcasting
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Brevo](https://www.brevo.com/) account + API key (for sending OTP emails)

### 1. Clone the repository

```bash
git clone https://github.com/khushbuChaudhary2213/family-tracker.git
cd family-tracker
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
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_NAME=Sentry
BREVO_SENDER_EMAIL=no-reply@yourdomain.com
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

| Method   | Endpoint                                        | Description                                                    |
| -------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| `POST`   | `/api/v1/users/signup`                          | Register a new user (name, email, phone, password)              |
| `POST`   | `/api/v1/users/login`                           | Log in and receive a JWT                                        |
| `POST`   | `/api/v1/users/forgot-password`                 | Request an OTP for a logged-out user (by phone number)          |
| `POST`   | `/api/v1/users/verify-otp`                      | Verify a logged-out user's OTP                                  |
| `POST`   | `/api/v1/users/reset-password`                  | Reset password for a logged-out user after OTP verification     |
| `GET`    | `/api/v1/users/me`                              | Get current authenticated user                                  |
| `PATCH`  | `/api/v1/users/me`                              | Update profile (name)                                           |
| `DELETE` | `/api/v1/users/me`                              | Delete account (with cascading family cleanup)                  |
| `PATCH`  | `/api/v1/users/change-password`                 | Change password using current password                          |
| `POST`   | `/api/v1/users/request-password-change-otp`     | Request an OTP for a logged-in user's password reset             |
| `POST`   | `/api/v1/users/verify-password-change-otp`      | Verify a logged-in user's OTP                                   |
| `POST`   | `/api/v1/users/reset-password-with-otp`         | Reset a logged-in user's password after OTP verification         |
| `POST`   | `/api/v1/family/createFamily`                   | Create a new family circle                                      |
| `POST`   | `/api/v1/family/joinFamily/:inviteCode`         | Join a circle via invite code                                   |
| `GET`    | `/api/v1/family/me`                             | Get all circles the user belongs to                              |
| `POST`   | `/api/v1/family/:familyId/removeMember`         | Admin removes a member                                          |
| `POST`   | `/api/v1/family/:familyId/leaveFamily`          | Leave a family circle                                            |
| `PATCH`  | `/api/v1/family/:familyId/permissions`          | Update a member's location-visibility permissions                |
| `PATCH`  | `/api/v1/family/:familyId/makeAdmin`            | Promote a member to admin                                        |
| `PATCH`  | `/api/v1/family/:familyId/revokeAdmin`          | Demote an admin to member                                        |
| `POST`   | `/api/v1/location/update`                       | Update the current user's location                               |
| `GET`    | `/api/v1/location/getFamilyLocations/:familyId` | Get all visible member locations for a circle                    |

### Real-time Events (Socket.IO)

| Event                   | Direction       | Description                                                                 |
| ------------------------ | --------------- | ----------------------------------------------------------------------------- |
| `send_live_location`    | client → server | Push a live GPS update (coords + device info)                               |
| `receive_live_location` | server → client | Receive a permitted member's live location, fanned out across all families  |
| `family_member_status`  | server → client | Online/offline presence change for a member, including last-known location  |
| `join_family_room`      | client → server | Join a family's room, reserved for future family-scoped features (e.g. chat) |

---

## 🔐 Security Notes

- Passwords are hashed with `bcryptjs` before storage; plaintext passwords are never persisted.
- All family and location routes are protected by JWT-based middleware.
- Password-reset OTPs are single-use, time-limited (10 minutes), stored on the user document with `select: false`, and cleared after use or failed email delivery.
- Recovery emails only ever reveal a masked version of the registered email address to the client.
- Location visibility is enforced server-side per family member via `canViewLocationsOf`, not just hidden client-side.
- At least one admin is always required per family circle — admin removal, demotion, or account deletion is blocked if it would leave any circle without one.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or file an issue.
