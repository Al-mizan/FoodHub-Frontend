# Khabo

A food marketplace connecting users with home chefs and local restaurants across Bangladesh. Browse meals, discover providers, and order your favorite dishes — all with a modern, responsive UI.

## Live App

[khabo.vercel.app](https://khabo.vercel.app)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **State Management:** React Context (Cart, Theme)
- **Forms:** TanStack Form + React Hook Form + Zod validation
- **Data Fetching:** TanStack React Query
- **Auth:** Better Auth (client SDK)
- **Icons:** Lucide React

## Features

- Browse meals by cuisine with filterable chip bar and sidebar
- Search and filter meals by name, price range, and sort order
- View restaurant/provider profiles and their menus
- Persistent shopping cart synced with the backend
- Cash on Delivery checkout flow
- Role-based dashboards (Customer, Provider, Admin)
- Provider meal management and order tracking
- Admin panel for categories, users, and orders
- Dark/light mode toggle
- Responsive, mobile-first UI

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (commonLayout)/         # Public pages (home, restaurants)
│   ├── (cartLayout)/           # Cart page layout
│   ├── (dashboardLayout)/      # Dashboard (profile, orders, provider, admin)
│   ├── login/                  # Auth pages
│   ├── register/
│   └── actions/                # Server actions
├── components/
│   ├── layout/                 # Navbar, Footer, Sidebar, Checkout
│   ├── modules/                # Feature-specific components
│   │   ├── authentication/     # Login/Register forms, UserMenu
│   │   └── homepage/           # SearchBar, Cuisines, Dishes, Restaurants
│   ├── shadcnblocks/           # Reusable block components (Logo, Price, Qty)
│   └── ui/                     # Base shadcn/ui primitives
├── hooks/                      # Custom hooks (useAuth, useUser)
├── providers/                  # Context providers (Theme, Cart)
├── services/                   # API service layers
├── types/                      # TypeScript type definitions
├── constants/                  # App constants
├── lib/                        # Utilities (auth-client, utils)
└── env.ts                      # Environment variable validation (t3-env)
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in NEXT_PUBLIC_BACKEND_API, NEXT_PUBLIC_FRONTEND_API, NEXT_PUBLIC_API_URL

# Run development server
pnpm dev
```

## Environment Variables

| Variable                  | Description                  |
| ------------------------- | ---------------------------- |
| `NEXT_PUBLIC_BACKEND_API` | Backend base URL             |
| `NEXT_PUBLIC_FRONTEND_API`| Frontend base URL (for auth) |
| `NEXT_PUBLIC_API_URL`     | API base URL for services    |
