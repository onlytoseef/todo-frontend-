# Todo App Frontend

Production-ready Next.js frontend for the Todo App platform.

This application provides:
- OTP-based authentication UI (signup, login, forgot/reset password, verify OTP)
- A themed Todo home page with add, edit, delete, and logout flows
- Redux Toolkit state management for authentication and todo state
- Material UI integration and a custom visual theme
- API integration with the NestJS backend

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Redux Toolkit + React Redux
- Material UI + Emotion
- Tailwind CSS (base setup) + custom global CSS theme

## Project Structure

```text
Todo App Frotnend/
	app/
		auth/
			forgot-password/page.tsx
			login/page.tsx
			reset/page.tsx
			signup/page.tsx
			verify/page.tsx
		todos/page.tsx
		globals.css
		layout.tsx
		page.tsx
		providers.tsx
	public/
	src/
		Images/sidebar.png
		components/
			forms/
			ui/
				ShoppingListBoard.tsx
				SidebarArt.tsx
				ToastProvider.tsx
		lib/
			api.ts
			storage.ts
		store/
			index.ts
			slices/
				authSlice.ts
				todoSlice.ts
		theme.ts
		types/index.ts
	.env.local.example
	package.json
```

## Core Features

## 1. Authentication Flows

- Signup (`/auth/signup`)
- Verify OTP (`/auth/verify`)
- Login (`/auth/login`)
- Forgot password (`/auth/forgot-password`)
- Reset password (`/auth/reset`)

Notes:
- Signup and forgot-password use a fire-and-forget request pattern for OTP sending, then navigate immediately to verification flow.
- Login stores JWT token and user details in local storage and Redux.

## 2. Todo Home Page

- `/` redirects to `/todos`
- `/todos` renders themed shopping-style todo board
- Add todo (title + number)
- Inline edit todo title with Save action
- Delete todo
- Logout button (clears auth storage and redirects to login)
- Toasts for success, validation, and failure states

## 3. API Integration

The app uses a centralized API utility:
- `src/lib/api.ts`

Capabilities:
- Typed `apiRequest<T>()`
- Custom `ApiError`
- `fireAndForget()` helper for non-blocking requests

## 4. State Management

Redux store setup:
- `src/store/index.ts`

Slices:
- `authSlice`: token, user, hydration state
- `todoSlice`: list/loading helpers (kept available for future extension)

## 5. Theming and UI

- Shared provider setup in `app/providers.tsx`
- Custom MUI theme in `src/theme.ts`
- Global visual language in `app/globals.css`
- Reusable sidebar image component in `src/components/ui/SidebarArt.tsx`

## Environment Variables

Create `Todo App Frotnend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

For production, set this to your deployed backend URL, for example:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.vercel.app
```

Fallback behavior:
- If `NEXT_PUBLIC_API_URL` is missing, the app falls back to the hardcoded value in `src/lib/api.ts`.

## Local Development

## Prerequisites

- Node.js 18+
- npm 9+
- Backend running and reachable

## Install

```bash
npm install
```

## Run Dev Server

```bash
npm run dev
```

Frontend URL:
- http://localhost:3000

## Build and Start (Production Mode)

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - lint the codebase

## Route Map

- `/` -> redirects to `/todos`
- `/todos` -> main todo dashboard
- `/auth/login` -> login
- `/auth/signup` -> signup
- `/auth/verify` -> OTP verification
- `/auth/forgot-password` -> forgot password
- `/auth/reset` -> reset password

## API Contract Expectations

Frontend expects the backend to expose:

Auth:
- `POST /auth/signup`
- `POST /auth/verify-otp`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/verify-reset-otp`
- `POST /auth/reset-password`

Todos (JWT protected):
- `GET /todos`
- `POST /todos`
- `PATCH /todos/:id`
- `DELETE /todos/:id`

Health:
- `GET /health`

## Deployment (Vercel)

## Recommended Settings

- Framework preset: Next.js
- Root directory: `Todo App Frotnend`
- Build command: `npm run build`
- Install command: `npm install`

## Required Environment Variable

- `NEXT_PUBLIC_API_URL` = backend public URL

## Post-Deploy Validation Checklist

- Open `/auth/signup` and submit a test signup
- Verify OTP flow works
- Login succeeds and redirects to `/todos`
- Add/edit/delete todo works
- Logout redirects to login

## Common Issues and Fixes

## 1. CORS Errors

Symptom:
- Browser blocks requests with CORS policy error

Fix:
- Ensure backend `FRONTEND_ORIGIN` includes your frontend domain exactly.

## 2. Frontend Shows 404 on Vercel

Symptom:
- Vercel root URL returns `404: NOT_FOUND`

Fix:
- Confirm Vercel project Root Directory is `Todo App Frotnend`.

## 3. API Calls Going to Wrong Backend

Symptom:
- Login/signup fails unexpectedly

Fix:
- Verify `NEXT_PUBLIC_API_URL` in Vercel and local `.env.local`.

## Security Notes

- Never commit `.env.local`.
- Do not store secrets in frontend env vars except public-safe values prefixed with `NEXT_PUBLIC_`.
- JWT is stored in local storage in current implementation; consider hardened session strategy for highly sensitive apps.

## Maintenance Notes

- Reusable UI/theme primitives are centralized under `src/components/ui` and `app/globals.css`.
- API logic should remain centralized in `src/lib/api.ts` to keep request handling DRY.
- Add new routes under `app/` and keep business logic in isolated modules/hooks for scalability.
