# Implementation Plan - Pixora (Pinterest Clone)

Building a high-performance, scalable Pinterest-style frontend with mocked data and rich UI/UX.

## 1. Project Setup
- [ ] Initialize `react-router-dom` and Framer Motion.
- [ ] Set up clean folder structure.
- [ ] Configure global styles (Tailwind + Shadcn).

## 2. Mock Data & API Layer
- [ ] Create `src/mock/data.ts` with comprehensive JSON for pins, users, and stats.
- [ ] Create `src/mock/api.ts` to simulate async operations with latency.

## 3. Global State
- [ ] `AuthContext`: Manage session tokens and user profile.
- [ ] `PinContext`: Centralized store for grid data and user interactions.

## 4. Core Components
- [ ] **Masonry Grid**: Responsive CSS Columns / Grid layout for pins.
- [ ] **Pin Card**: Interactive cards with hover effects and quick actions.
- [ ] **Navigation**: Global Navbar with search and user dropdowns.
- [ ] **Layouts**: Separate layouts for Feed, Auth, and Dashboard.

## 5. Feature Implementation
- [ ] **Auth Flow**: Completed login, signup, and reset screens.
- [ ] **Dashboard**: Storage visualization using Recharts and pin management.
- [ ] **Upload System**: Drag & drop handling with preview and quota logic.
- [ ] **Subscription**: Pricing cards with mock Stripe checkout flow.
- [ ] **Admin Panel**: Management interface with analytics.

## 6. Performance & UX Polish
- [ ] Image lazy loading and code splitting.
- [ ] Glassmorphism effects and smooth transitions.
- [ ] Responsive design verification.
