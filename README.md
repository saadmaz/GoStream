<<<<<<< HEAD
# GoStream
=======
# 🚀 GoStream

A high-performance full-stack application generator and manager. **GoForge** leverages a powerful **Go** backend for robust processing and a modern **React** frontend for an intuitive user experience.

## 🏗 System Architecture
This project is structured as a monorepo for seamless development:
* **Backend:** High-concurrency API server written in Go.
* **Frontend:** Dynamic Single Page Application (SPA) built with React, TypeScript, and Vite.
* **Styling:** Tailwind CSS with Shadcn UI components.
* **Database:** Integrated via Drizzle ORM.



## 🛠 Tech Stack
* **Backend:** Go 1.21+ (Standard Library / Fiber)
* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS, Lucide Icons
* **State Management:** TanStack Query (React Query)
* **Deployment:** Replit / Docker-ready

## 🏁 Getting Started

### Prerequisites
* **Go:** `2.48.1` or higher (detected in your logs)
* **Node.js:** v18+ 
* **Git:** Installed and configured

### Installation
1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd Go-Builder
    ```
2.  **Setup Backend:**
    ```bash
    go mod tidy
    ```
3.  **Setup Frontend:**
    ```bash
    cd client && npm install
    ```

### Running Locally
You can run the entire stack using the Replit "Run" button or manually:
* **Start Backend:** `go run main.go`
* **Start Frontend:** `cd client && npm run dev`

## 📁 Project Structure
```text
├── client/                 # React Frontend (Vite + TS)
│   ├── src/components/ui   # Shadcn UI Components
│   └── src/pages           # Application Views
├── server/                 # Go Backend Logic
│   ├── routes.ts           # API Route Definitions
│   └── storage.ts          # Database/Persistence Layer
├── shared/                 # Shared Types and Schemas
├── replit.nix              # Environment Configuration
└── go.mod                  # Go Dependencies

```

## ⚠️ Troubleshooting Git Issues

If you see errors regarding `gitsafe-backup`, ensure your remote origins are configured correctly:

```bash
git remote -v

```

To fix the "No such host known" error for `gitsafe`, check your SSH/config settings or verify the backup service is online.
>>>>>>> a332e25a4b90c3d2faa821916b9ea1ac4140c948
