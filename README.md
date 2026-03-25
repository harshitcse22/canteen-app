# Edzy Frontend Screening Task – Canteen App

Welcome to the School Canteen digital ordering system! This project is a simple but functional web interface to help students view snacks, place orders, and track their spending over time. 

## Features
* **Landing Page**: A custom-designed welcome page to serve as the entry point.
* **Snacks Menu**: View all available snacks in a responsive Tailwind grid layout. Includes their price, order counts, and a direct "Order" button.
* **Students Roster**: List all students alongside their referral codes and total amount spent.
* **Student Ledger Details**: A dynamic route (`/students/[id]`) showing granular order history (snack name, quantity, amount, and date) and their total ledger.
* **Order System (Modal)**: A fully validated React Hook Form for placing orders (max 5 items at once).
* **Automated Data Updates**: React Query optimally caches data and invalidates the cache instantly on new orders, triggering instant UI updates without manual reloads.
* **Data Persistence**: Everything runs entirely on the frontend via Mock API arrays which are automatically securely backed up to the browser's `localStorage`. You can safely refresh the page and never lose your students or orders!
* **UX Enhancements**: Graceful loading state animations, empty states (when no orders/students exist), beautiful error handling, and robust mobile-responsive capabilities.

## Tech Stack (Libraries Used)
* **Framework**: React 19 + Next.js 16 (App Router)
* **Language**: TypeScript (`.tsx` / `.ts`)
* **Styling**: Tailwind CSS v4 (Mobile-first, fully responsive grid systems)
* **State Management**:
  * **Local UI State**: Zustand (controls open/closed modals and global selections) 
  * **Server State / Caching**: `@tanstack/react-query`
* **Form Validation**: `react-hook-form` alongside `zod` schema resolvers.

## Setup Instructions

Make sure you have Node.js (v18 or higher recommended) installed.

1. **Clone the repository / unzip the folder**:
   ```bash
   cd canteen-app
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
4. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Mock Data Approach

Since there is no live backend, this project uses an in-memory mock API located at `src/lib/api.ts`.
* Operations artificially simulate network latency (300-500ms bounds) utilizing Promises to allow testing of frontend loading mechanisms.
* To persist your simulation, whenever a mutation (like `createOrder` or `createStudent`) occurs, we securely stringify our mocked arrays and map them directly into the browser's API (`localStorage` via `canteen_snacks`, `canteen_students`, `canteen_orders`). 
* Upon a full page reload, the client hydrates its mock state directly from `localStorage`, ensuring data permanence between sessions securely.

## Folder Structure

```
canteen-app/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router root
│   │   ├── layout.tsx      # Global layout & Tailwind Navigation wrapper
│   │   ├── page.tsx        # Landing / Home Page
│   │   ├── providers.tsx   # React Query initialization
│   │   ├── snacks/
│   │   │   └── page.tsx    # Snacks grid view
│   │   └── students/
│   │       ├── page.tsx    # Students overview and creation list
│   │       └── [id]/
│   │           └── page.tsx # Dynamic student detail view and order tracking
│   ├── components/         # Reusable Component Modules
│   │   ├── CreateStudentForm.tsx
│   │   └── OrderModal.tsx
│   ├── lib/
│   │   └── api.ts          # Central Mock Database, API logic, & localStorage
│   ├── store/
│   │   └── index.ts        # Zustand global UI store
│   └── types/
│       └── index.ts        # TypeScript data interfaces
├── .gitignore
├── package.json
├── README.md               # This file
└── PROMPTS_USED.md         # Generated AI instructions tracking
```
