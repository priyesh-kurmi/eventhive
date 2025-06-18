# EventHive

A modern event management platform built with Next.js, featuring real-time chat powered by Socket.IO.

## Features

- **Event Management**: Create, join, and manage events
- **Real-time Chat**: Socket.IO powered chat for events and direct messages  
- **User Authentication**: NextAuth.js integration with Google OAuth
- **Direct Messaging**: Private conversations between users
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Node.js, Socket.IO, MongoDB
- **Authentication**: NextAuth.js
- **Real-time**: Socket.IO for chat functionality

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Google OAuth credentials (optional, for social login)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd event-hive
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
SOCKET_PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Running the Application

#### Option 1: Use the start scripts (Recommended)

**Windows (Batch):**
```bash
./start-dev.bat
```

**Windows (PowerShell):**
```bash
./start-dev.ps1
```

#### Option 2: Manual startup

1. Start the Socket.IO server:
```bash
npm run socket:dev
```

2. In a new terminal, start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Architecture

### Socket.IO Integration

This project uses a hybrid approach:
- **Next.js App**: Runs on port 3000 (Vercel-deployable)
- **Socket.IO Server**: Runs on port 3001 (separate server)

### Real-time Features

- **Event Chat**: Public chat rooms for events
- **Direct Messages**: Private messaging between users
- **Live Updates**: Real-time message delivery

### Deployment

#### Frontend (Next.js)
Deploy to Vercel, Netlify, or any serverless platform.

#### Socket.IO Server
Deploy to Railway, Render, DigitalOcean, or any Node.js hosting service.

Update the `NEXT_PUBLIC_SOCKET_URL` environment variable to point to your deployed Socket.IO server.

## Development

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run socket:dev` - Start Socket.IO server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── models/             # Database models
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
