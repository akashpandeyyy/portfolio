# Akash Pandey — Developer Portfolio

A sleek, responsive, and interactive personal portfolio website for **Akash Pandey**, an Android & Java Backend Developer specializing in secure FinTech applications (AEPS, DMT, BBPS).

This project is built with a focus on modern UI/UX principles, featuring deep dark themes, glassmorphism, subtle micro-animations, and a dynamic backend integration.

## 🚀 Features

- **Modern Hero Carousel**: An auto-sliding, Antigravity-style carousel highlighting the developer's profile, core tech stack, and an animated FinTech transaction card.
- **Dynamic Projects Showcase**: Automatically fetches and displays live projects directly from Firebase Realtime Database.
- **Working Contact Form**: Securely captures visitor messages and stores them in Firebase.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **Performance Focused**: Built with pure HTML, CSS, and Vanilla JavaScript for maximum speed and zero dependency bloat.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend / Database**: Firebase Realtime Database
- **Design System**: Custom CSS variables, CSS Grid/Flexbox, Intersection Observer API for scroll reveal animations.

## 📁 File Structure

- `index.html`: The core HTML structure of the portfolio.
- `style.css`: Contains all visual styling, responsive media queries, and `@keyframes` animations.
- `main.js`: Handles UI logic, including the auto-sliding carousel and scroll-reveal intersection observers.
- `firebase-services.js`: Manages the Firebase initialization, contact form submission, and live project fetching.

## ⚙️ Setup & Configuration

To run this project locally, simply open `index.html` in any modern web browser.

### Firebase Integration

To enable the live contact form and dynamic projects, you need to configure your own Firebase project:

1. Create a new project at the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Build > Realtime Database** and create a database.
3. Go to **Project Settings > General**, add a web app, and copy the `firebaseConfig` object.
4. Open `firebase-services.js` and replace the placeholder configuration with your actual Firebase keys:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 🎨 UI/UX Theme

The design leverages a deep space-inspired palette with vibrant accents to match the developer's brand:
- **Background**: `#0a0e1a` (Deep Space Blue)
- **Primary Accent**: `#38bdf8` (Sky Blue)
- **Secondary Accent**: `#f43f5e` (Soft Maroon/Rose)

---
*Built with HTML, CSS, & Vanilla JS by Akash Pandey.*
