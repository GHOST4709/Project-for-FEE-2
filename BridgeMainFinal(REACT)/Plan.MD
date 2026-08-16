# 📍 Project Context & Specification: "Bridge" - React + Google Maps App (Part 1)

## 🎯 App Concept: Bridge
**The Core Idea:** "Bridge" is a web application designed specifically for university students to make campus life easier. It provides a centralized platform where students can connect with classmates for studying, arrange carpooling, discover campus events, and share announcements. The ultimate goal is to improve communication, collaboration, and convenience by bringing essential student services into one easy-to-use platform.

**Core Services / Map Categories:**
* 🚗 Carpool / Transportation
* 🏠 PG / Rooms (Accommodation)
* 🍔 Restaurants / Other Food Stuff
* ✏️ Stationery
* 👕 Clothing
* 💻 Tech Repair

## 📋 Executive Summary (Semester Evaluation - Part 1)
This project is **Part 1 of an Academic Semester Evaluation**. It is a **Client-Only (Frontend) React Application** built with Vite, integrating the **Google Maps API** and mock JSON data. 

The primary goal of this submission is **not backend complexity**, but rather demonstrating mastery in **Semantic HTML**, **DOM Manipulation in React**, **Clean Code Architecture**, and **Core React Concepts** (`useState`, `useEffect`, `useRef`, `Props`) to achieve full marks based on the grading rubric.

---

## 📊 Evaluation Rubric & Strict Guidelines

To achieve maximum marks (28/28), all code generated MUST strictly adhere to the following 4 criteria:

### 1. HTML Structure & CSS Styling (7–8 Marks)
* **Semantic HTML Required:** DO NOT use generic `<div>` tags everywhere. Use explicit tags:
  * `<header>` & `<nav>` for the app navigation and category filters (Carpool, PG, Food, etc.).
  * `<main>` for the primary app wrapper.
  * `<aside>` or `<section>` for search sidebars and the service listings.
  * `<article>` for individual service/location cards.
  * `<footer>` for the app footer.
* **CSS Best Practices:**
  * Use modern CSS Variables defined in `:root` (colors, typography, spacing).
  * Use **Flexbox** and **CSS Grid** for responsive layouts.
  * Keep component styling modular and organized under `src/styles/`.

### 2. JavaScript & Clean Code Standards (6–8 Marks)
* **File Naming:** `PascalCase` for React components (`ServiceCard.jsx`), `camelCase` for utilities/hooks (`useGoogleMaps.js`).
* **Clean Code:** Use clear variable names, ES6+ features (destructuring, arrow functions, template literals), and modular re-usable components.
* **Git Conventions:** Ensure commits are granular with descriptive prefixes (`feat:`, `style:`, `refactor:`, `fix:`).

### 3. DOM Manipulation (3–5 Marks)
* **Direct DOM Mounting:** Demonstrate explicit DOM binding by initializing the Google Maps canvas into a physical DOM container using React's **`useRef`** hook:
  ```javascript
  const mapRef = useRef(null);
  // new window.google.maps.Map(mapRef.current, options);