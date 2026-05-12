# Schedulix

A full-stack interactive operating system educational simulator featuring various core OS algorithms, interactive visualizations, and a cyberpunk-themed UI.

## Features

- **Process Scheduling:** Visualizes various CPU scheduling algorithms.
- **Memory Management:** Demonstrates memory allocation strategies.
- **Deadlock Detection:** Implements Banker's Algorithm for deadlock avoidance and detection.
- **Disk Scheduling:** Interactive disk head movement simulations.
- **File System Explorer:** Simulates file organization and traversal.
- **AI-powered Assistant:** Context-aware educational assistant.
- **Admin Dashboard & Quizzes:** Comprehensive progress tracking and knowledge checks.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sivasri-cs/schedulix.git
cd schedulix
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Configuration

1. Create a `.env` file in the `backend` directory based on the environment variables required (e.g., `MONGO_URI`, `JWT_SECRET`).
2. If your frontend requires environment variables, create a `.env` file in the `frontend` directory.

### Running the Application

1. Start the backend development server:
```bash
# from the backend directory
npm run dev
```

2. Start the frontend development server:
```bash
# from the frontend directory
npm run dev
```

Open your browser and navigate to the local server URL provided by Vite (usually `http://localhost:5173`).

## License

This project is licensed under the MIT License.
