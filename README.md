<<<<<<< HEAD
# Serenity Hotel, Resort, and Restaurant Management
=======
# Serenity Hotel, Resort, and Restaurant
>>>>>>> e7eec05 (Ganti semua tulisan Tranquil Stays menjadi Serenity Hotel, Resort, and R)

## Overview

Serenity Hotel, Resort, and Restaurant is a modern, luxurious hotel booking application designed to provide a seamless and elegant user experience. Built with a powerful stack including Next.js, Genkit, and ShadCN UI, this project demonstrates a sophisticated, feature-rich web application. From browsing exquisite rooms to getting personalized travel recommendations from an AI-powered concierge, Serenity is your digital gateway to a world of luxury and tranquility.

## ✨ Features

- **Interactive Room Showcase**: A beautiful, responsive gallery to explore detailed information and images of our luxurious rooms.
- **Seamless Booking Form**: An intuitive and user-friendly form to book a stay with date range selection.
- **AI-Powered Concierge**: A smart assistant powered by Google's Gemini model via Genkit. It provides personalized recommendations for local attractions and can even search for flights through an integrated (mock) travel marketplace API.
- **Multi-language Support**: Fully internationalized to support both English (`en`) and Bahasa Indonesia (`id`).
- **Multi-currency Support**: Dynamically switch between US Dollar (`USD`) and Indonesian Rupiah (`IDR`) for room and flight prices.
- **Modern UI/UX**: Built with ShadCN UI and Tailwind CSS for a sleek, modern, and accessible interface.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://reactjs.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/download/) installed and running.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd serenity-hotel
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add your database connection details. This file is used to store sensitive information and is not committed to version control.

```env
# PostgreSQL Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pelangihot"

# You may also need a Google AI API key for Genkit
# GOOGLE_API_KEY="YOUR_GOOGLE_AI_API_KEY"
```

### 4. Set Up the Database

Connect to your PostgreSQL instance and run the `schema.sql` file to create the necessary tables and seed initial data.

```sql
-- Example using psql
psql -U postgres -d pelangihot -a -f schema.sql
```

### 5. Run the Development Servers

This project requires two separate development servers to run concurrently: one for the Next.js application and one for the Genkit AI flows.

- **Terminal 1: Start the Next.js App**
  ```bash
  npm run dev
  ```
  Your application will be available at [http://localhost:9002](http://localhost:9002).

- **Terminal 2: Start the Genkit Server**
  ```bash
  npm run genkit:dev
  ```
  This starts the Genkit development server, which allows the AI Concierge to function.

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run genkit:dev`: Starts the Genkit development server.
- `npm run build`: Creates a production build of the application.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the code using Next.js's built-in ESLint configuration.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.

## 🤖 AI Features

The AI concierge is built using **Genkit** and leverages Google's **Gemini** model. It uses a flow defined in `src/ai/flows/local-attraction-recommendation.ts`.

The key feature is its ability to use "tools." We have defined a `searchFlights` tool that the AI can decide to use if a user's query mentions flights. This demonstrates a basic agentic pattern where the AI can call external functions to gather information.

## 🌍 Internationalization (i18n)

The application supports multiple languages and currencies:
- **Languages**: English (`en`) and Bahasa Indonesia (`id`). The content is managed through dictionary files in `src/dictionaries`.
- **Currencies**: US Dollar (`USD`) and Indonesian Rupiah (`IDR`).
- Users can switch between locales and currencies using the dropdown in the header.

## 📂 Project Structure

```
.
├── src
│   ├── ai                 # Genkit AI flows and configuration
│   ├── app                # Next.js App Router pages and layouts
│   ├── components         # Reusable React components (including ShadCN UI)
│   ├── config             # i18n configuration
│   ├── context            # React context providers (e.g., Currency)
│   ├── dictionaries       # JSON files for i18n
│   ├── hooks              # Custom React hooks
│   ├── lib                # Utility functions, constants, etc.
│   └── middleware.ts      # Next.js middleware for i18n routing
├── public                 # Static assets
├── schema.sql             # Database schema definition
├── .env                   # Environment variables (local)
├── next.config.ts         # Next.js configuration
└── tailwind.config.ts     # Tailwind CSS configuration
```
