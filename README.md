# SarangResepi 🍜

A modern, responsive recipe management web application that allows users to create, store, and discover recipes. Built using cutting-edge web technologies including Next.js 14, React, TypeScript, TailwindCSS, and Supabase.

## Overview

SarangResepi ("Recipe Nest" in Malay) is a full-stack web application designed to help food enthusiasts manage and share their recipes. The application features a dark-themed UI with elegant typography and smooth transitions, making recipe management a delightful experience.

### Technologies Used

- **Frontend:**

  - Next.js 14 (React Framework)
  - React 18
  - TypeScript
  - TailwindCSS
  - Headless UI
  - Heroicons

- **Backend & Database:**

  - Supabase (PostgreSQL)
  - Supabase Auth
  - Supabase Storage

- **Development Tools:**
  - ESLint
  - Prettier
  - npm

## Features

### User Authentication

- Email-based authentication system
- Secure user sessions
- Protected routes for authenticated users

### Recipe Management

- Create detailed recipes with:
  - Title and description
  - Ingredients list
  - Step-by-step instructions
  - Recipe images
- Edit existing recipes
- Delete recipes
- View personal recipe collection

### User Interface

- Responsive design for all screen sizes
- Dark theme optimized for readability
- Modern and clean UI components
- Mobile-friendly navigation
- Elegant typography and spacing

### Image Handling

- Upload and store recipe images
- Image preview before upload
- Responsive image loading
- Optimized image delivery

### Browse & Discovery

- Browse all public recipes
- Clean grid layout for recipe cards
- Recipe preview with images

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sarangresepi.git
cd sarangresepi
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technical Details

### Architecture

- **Frontend Architecture:**

  - Page-based routing with Next.js
  - Server and Client Components
  - Context-based state management
  - Responsive TailwindCSS design system

- **Database Schema:**

  - Users table (managed by Supabase Auth)
  - Recipes table (stores recipe information)
  - Storage bucket (for recipe images)

- **Authentication Flow:**

  - Email-based authentication
  - Protected API routes
  - Secure session management

- **Performance Optimizations:**
  - Image optimization with Next.js Image
  - Code splitting
  - Server-side rendering where applicable
  - Optimized fonts loading

### Security Features

- Secure authentication with Supabase
- Protected API routes
- Secure image upload
- Input sanitization
- Type safety with TypeScript

Visit [GitHub Repository](https://github.com/adzlann/SarangResepi) for more information.
