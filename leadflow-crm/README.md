# LeadFlow CRM – BDA Team Management System

A full-stack CRM platform built for Business Development Associate (BDA) teams. Track leads through a 6-stage pipeline, monitor team performance, manage follow-ups, and gain insights through analytics.

---

## Features

- **6-Stage BDA Pipeline** – New → Contacted → Proposal Sent → Negotiation → Closed Won → Closed Lost
- **Drag-and-Drop Kanban Board** – Move leads between stages visually
- **Activity Timeline** – Auto-tracked history for every lead action
- **Follow-up Reminders** – Overdue and upcoming follow-ups dashboard
- **Team Performance Scoreboard** – Per-BDA metrics: deals closed, conversion rate, revenue
- **Analytics Dashboard** – Monthly trends, source breakdown, funnel charts
- **Lead Management** – Full CRUD with search, filter, sort, and CSV export
- **JWT Authentication** – Secure register/login with protected routes
- **DiceBear Avatars** – Auto-generated profile avatars (free, no API key)
- **Responsive Design** – Works on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + Framer Motion |
| Charts | Recharts |
| Drag & Drop | @hello-pangea/dnd |
| Icons | React Icons |
| Notifications | React Hot Toast |
| Avatars | DiceBear API (free) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (free tier) |
| Auth | JWT (custom) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/leadflow-crm.git
cd leadflow-crm
```

### 2. Setup Backend
```bash
cd server
cp .env.example .env
# Fill in MONGODB_URI and JWT_SECRET in .env
npm install
npm run dev
```

### 3. Setup Frontend
```bash
cd client
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Get all leads (with filter/search/sort) |
| POST | `/api/leads` | Create lead |
| GET | `/api/leads/:id` | Get single lead |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |
| POST | `/api/leads/:id/notes` | Add note |
| DELETE | `/api/leads/:id/notes/:noteId` | Delete note |

### Dashboard & Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads/stats` | Dashboard statistics |
| GET | `/api/leads/followups` | Follow-up reminders |
| GET | `/api/leads/activities` | Activity timeline |
| GET | `/api/leads/performance` | Team performance metrics |

---

## Folder Structure

```
leadflow-crm/
├── client/                    # React frontend
│   ├── public/                # Static assets
│   └── src/
│       ├── components/
│       │   ├── dashboard/     # StatCard, ConversionRing
│       │   ├── layout/        # Sidebar, DashboardLayout, ProtectedRoute
│       │   ├── leads/         # LeadModal, LeadDrawer
│       │   ├── notes/         # NotesTimeline
│       │   └── ui/            # Badges, Skeletons
│       ├── context/           # AuthContext
│       ├── pages/             # All page components
│       ├── services/          # API service layer
│       └── utils/             # Helpers, constants
├── server/                    # Express backend
│   ├── config/                # DB connection
│   ├── controllers/           # Business logic
│   ├── middleware/            # JWT auth middleware
│   ├── models/                # Mongoose schemas
│   └── routes/                # Express routes
└── README.md
```

---

## Deployment

### Frontend – Vercel
1. Push `client/` to GitHub
2. Import to Vercel
3. Set `VITE_API_URL` env var to your Render backend URL
4. Deploy

### Backend – Render
1. Push `server/` to GitHub
2. Create a new Web Service on Render
3. Set environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`
4. Deploy

---

## BDA Pipeline Stages

| Stage | Description |
|-------|-------------|
| New | Lead just added, not yet contacted |
| Contacted | Initial contact made |
| Proposal Sent | Proposal or quote sent to lead |
| Negotiation | Actively discussing terms |
| Closed Won | Deal successfully closed |
| Closed Lost | Lead did not convert |

---

## Screenshots

> Add screenshots here after deployment

- Dashboard with widgets
- Kanban pipeline board
- Analytics charts
- Team performance scoreboard

---

## License

MIT — free to use and modify.
