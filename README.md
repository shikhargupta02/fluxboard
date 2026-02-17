# 🚀 FluxBoard

FluxBoard is a simple Kanban-style task management board built with **React** and **TypeScript**.

It allows you to create tasks, drag and drop them between columns, and automatically persist your board state in the browser.

---

## ✨ Features

- 📝 Create and manage tasks  
- 🧲 Drag and drop between columns (Todo, In Progress, Done)  
- 💾 Automatic localStorage persistence (debounced)  
- 🔎 Task filtering  
- ↩️ Undo / Redo support  
- 📱 Responsive layout  
- ⚡ Service Worker support (offline-ready with Workbox)  

---

## 🛠 Tech Stack

- React
- TypeScript
- Context API (state management)
- Custom Hooks
- Workbox (service worker & caching)
- LocalStorage persistence

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/fluxboard.git
cd fluxboard
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Run Locally

```bash
npm start
```

The app will run at:

```
http://localhost:3000
```

---

## 🏗 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

---

## 📁 Project Structure

```
src/
 ├── components/        # UI components
 ├── context/           # Global state provider
 ├── hooks/             # Custom React hooks
 ├── store/             # Actions & reducers
 ├── utils/             # Utility functions
 ├── types/             # TypeScript types
 └── service-worker/    # Workbox configuration
```

---

## 💾 Persistence

- Board state (`tasks` and `order`) is automatically saved to `localStorage`
- Persistence is debounced to avoid excessive writes
- Filters and history are not persisted

