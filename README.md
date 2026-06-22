# Fable – Ebook Marketplace Platform

## 📖 Project Overview

**Fable** is a modern full-stack Ebook Marketplace Platform where readers can discover, purchase, and read digital books, while writers can publish and manage their own ebooks. The platform provides a seamless reading experience, secure authentication, ebook purchasing functionality, and role-based access control.

The project was developed as a complete ebook management and distribution system using modern web technologies.

---

## 🌐 Live Website

**Live URL:**
🔗 [https://fable-client-blond.vercel.app](https://fable-client-blond.vercel.app)

---

## 🎯 Purpose

The primary goal of Fable is to create a digital ecosystem that connects writers and readers in a single platform. Writers can publish and manage ebooks, while readers can browse, purchase, and access their ebook library anytime.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* Email and Password Authentication
* Google Login Integration
* Secure User Session Management
* Protected Routes
* Role-Based Access Control

### 👤 User Features

* User Registration & Login
* Browse All Available Ebooks
* View Detailed Ebook Information
* Purchase Ebooks
* Access Purchased Ebooks Library
* Responsive User Dashboard
* Dark & Light Theme Support

### ✍️ Writer Features

* Upload New Ebooks
* Manage Published Ebooks
* Edit Ebook Information
* Delete Ebooks
* Track Published Content

### 🛠️ Admin Features

* Manage Users
* Manage Writers
* Manage Ebooks
* Platform Content Moderation
* Dashboard Analytics

### 📚 Ebook Management

* Ebook Cover Upload
* Category-Based Organization
* Detailed Ebook Pages
* Purchase Verification
* Ownership Validation

### 🎨 UI/UX Features

* Modern Responsive Design
* Mobile-Friendly Interface
* Clean Dashboard Layout
* Loading States
* Error Handling Pages
* Toast Notifications

---

## 🏗️ Technology Stack

### Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* ShadCN UI
* Lucide React Icons

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* Better Auth
* Google OAuth

### Deployment

* Vercel (Frontend)
* Render / Custom Server (Backend)

---

## 📦 NPM Packages Used

### Core Packages

```bash
next
react
react-dom
typescript
```

### Authentication

```bash
better-auth
better-auth/react
```

### UI & Styling

```bash
tailwindcss
class-variance-authority
clsx
tailwind-merge
lucide-react
```

### Forms & Validation

```bash
react-hook-form
zod
@hookform/resolvers
```

### HTTP Requests

```bash
axios
```

### Notifications

```bash
sonner
```

### Utilities

```bash
date-fns
```

---

## 📁 Project Structure

```text
app/
├── api/
├── auth/
├── dashboard/
├── ebooks/
├── login/
├── register/
├── ebook-payment-success/

components/
hooks/
lib/
providers/
public/
services/
```

---

## 🔒 Authentication Flow

1. User registers or logs in.
2. Better Auth creates and manages sessions.
3. Protected routes validate user access.
4. Google OAuth authentication is supported.
5. Users can securely access purchased content.

---

## 🚀 Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

```env
NEXT_PUBLIC_SERVER_URL=your_server_url

BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=your_app_url

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Run Development Server

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
```

---

## 📈 Future Improvements

* Online Payment Gateway Integration
* Ebook Reviews & Ratings
* Wishlist Functionality
* Advanced Search & Filtering
* Author Profiles
* Reading Progress Tracking
* Subscription Plans
* Ebook Recommendations

---

## 👨‍💻 Developer

**Md Abu Sayed**
Web Application Developer

---

## 📄 License

This project was developed for educational and portfolio purposes. All rights reserved.

---

### Project Name

**Fable – Discover & Read Original Ebooks** 📚✨
