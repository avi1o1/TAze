# TAze Queue Management System

A modern queue management system built with Next.js and MongoDB for efficient ticket-based queue handling, secured with CAS authentication.

## Features

- 🔐 **CAS Authentication** - Secure login via IIIT CAS (login.iiit.ac.in)
- 🎫 **Digital Ticket System** - Issue and manage numbered tickets
- ⏭️ **Real-time Queue Management** - Track current serving numbers
- 📊 **Visual Progress Indicators** - See queue status at a glance
- 🔄 **Auto-refresh** - Real-time updates every 15 seconds
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🗄️ **MongoDB Integration** - Persistent data storage
- 👤 **User Management** - Track queue creators and user sessions

## Security Features

- **CAS Integration** - Authentication via IIIT CAS server
- **Protected Routes** - All features require authentication
- **Token-based Security** - Secure API access with time-limited tokens
- **Automatic Logout** - Session expiry and CAS logout support

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: CAS (Central Authentication Service)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16.x or later
- MongoDB database (local or cloud instance like MongoDB Atlas)
- Access to IIIT network for CAS authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TAze/code
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```bash
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-here
   ```
   
   For local MongoDB:
   ```
   MONGODB_URI=mongodb://localhost:27017/taze-queue-system
   ```

4. **Seed the database with sample data** (optional)
   Once the app is running, visit `http://localhost:3000/api/seed` to create sample queues.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Queues
- `GET /api/queues` - Get all queues
- `POST /api/queues` - Create a new queue
- `GET /api/queues/[id]` - Get a specific queue
- `PUT /api/queues/[id]` - Update a queue
- `DELETE /api/queues/[id]` - Delete a queue

### Queue Actions
- `PUT /api/queues/[id]/next-turn` - Advance to next customer
- `PUT /api/queues/[id]/new-ticket` - Issue a new ticket

### Utility
- `POST /api/seed` - Create sample queue data

## Data Model

Each queue contains:
- `title` - Queue name
- `description` - Queue description
- `nextTicket` - Next ticket number to be issued
- `currentTurn` - Currently serving ticket number
- `timestamps` - Created and updated timestamps

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
├── pages/
│   ├── api/
│   │   ├── queues/
│   │   │   ├── [id]/
│   │   │   │   ├── next-turn.js
│   │   │   │   └── new-ticket.js
│   │   │   └── [id].js
│   │   ├── queues.js
│   │   └── seed.js
│   ├── _app.js
│   ├── _document.js
│   └── index.js
├── lib/
│   └── mongodb.js
├── models/
│   └── Queue.js
├── src/
│   ├── index.css
│   └── App.css
└── public/
    └── ...
```

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
