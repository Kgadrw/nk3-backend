# NK 3D Architecture Studio - Backend API

Backend API server for the dashboard.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (already created) with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

3. Run the development server:
```bash
npm run dev
```

The server will start on port 5000 by default.

## Project Structure

```
backend/
├── config/
│   └── database.js      # MongoDB connection
├── controllers/         # Request handlers
├── models/              # Database models
├── routes/              # API routes
│   └── dashboard.js     # Dashboard routes
├── middleware/          # Custom middleware
├── server.js            # Express server entry point
└── package.json
```

