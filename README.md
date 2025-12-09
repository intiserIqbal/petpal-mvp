# 🐾 PetPal MVP

![GitHub repo size](https://img.shields.io/github/repo-size/intiserIqbal/petpal-mvp)
![GitHub last commit](https://img.shields.io/github/last-commit/intiserIqbal/petpal-mvp)
![GitHub issues](https://img.shields.io/github/issues/intiserIqbal/petpal-mvp)
![GitHub forks](https://img.shields.io/github/forks/intiserIqbal/petpal-mvp?style=social)
![GitHub stars](https://img.shields.io/github/stars/intiserIqbal/petpal-mvp?style=social)

---

## 🚀 Overview

**PetPal** is an AI-enhanced pet adoption platform built with the MERN stack (MongoDB, Express, React, Node.js) and JWT authentication.  
It connects adopters and pet owners through secure listings, search filters, AI-powered sentiment analysis, and a review system.

- **Backend:** Node.js/Express, MongoDB Atlas (free tier), JWT, Groq API for sentiment analysis
- **Frontend:** React (Vite), Tailwind CSS, RESTful API integration
- **Image Uploads:** Local storage via Multer (no Cloudinary, fully free)
- **Deployment:** Render.com (backend), Vercel (frontend), all on free tiers

---

## 🎯 MVP Features

- Pet Listings CRUD (Create, Read, Update, Delete)
- Secure user authentication (JWT)
- Review system for pet listings
- AI-powered sentiment analysis (Groq API)
- Local image uploads (no external paid services)
- Owner-only edit/delete permissions
- Responsive web UI (mobile-friendly)

---

## 🧑‍💻 Team & Workflow

- **Version Control:** GitHub (main protected, PRs via dev)
- **Collaboration:** Discord (#petpal-team)
- **CI/CD:** Manual PR merge (every 2 days)
- **Pair Programming:** Intiser + Teammate A
- **Faculty Feedback:** Documented in Trello

---

## 🏗️ Architecture

- **Backend:**

  - RESTful API (`/api/pets`, `/api/auth`, `/api/reviews`, `/api/analyze-sentiment`, `/api/uploads`)
  - MongoDB Atlas for persistent data
  - Groq API for sentiment analysis (free, regionally available)
  - Multer for local image uploads
  - Owner checks for secure CRUD operations

- **Frontend:**
  - React SPA (Vite)
  - Tailwind CSS for rapid UI
  - API integration via Axios
  - Responsive design for desktop and mobile browsers

---

## 🛡️ Free Tier Compliance

All services (MongoDB Atlas, Render, Vercel, Groq) are on free plans.  
No credit card required for any backend or frontend service.

---

## 📈 Strengths & Potential Updates

- **Strengths:**

  - 100% free deployment (no paid APIs or hosting)
  - AI-powered sentiment analysis for pet descriptions
  - Secure, owner-only listing management
  - Modular codebase for easy extension

- **Potential Updates:**
  - Add advanced search and filtering (by breed, age, location)
  - Integrate push notifications (email/SMS)
  - Expand to React Native/Expo for true cross-platform mobile support
  - Add moderation/admin dashboard
  - Implement OAuth/social login
  - Enhance review system (images, ratings breakdown)
  - Add chat/messaging between adopters and owners

---

## 📜 License

MIT License © 2025 [Intiser Iqbal](https://github.com/intiserIqbal)

---

## 📝 Academic Note

This project demonstrates a scalable, AI-enhanced full-stack application using only free-tier cloud services.  
It is suitable for academic demonstration, MVP launches, and further research in digital adoption platforms.
