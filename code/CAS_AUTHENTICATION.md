# TAze Queue Management System with CAS Authentication

This application now uses CAS (Central Authentication Service) authentication via `login.iiit.ac.in` to secure all features.

## Authentication Flow

1. **Login Process:**
   - User visits any protected page
   - If not authenticated, redirected to `/auth/signin`
   - Automatically redirects to `https://login.iiit.ac.in/cas/login`
   - After successful CAS login, user is redirected back with a ticket
   - Ticket is validated with CAS server
   - User information is stored in localStorage
   - User is redirected to the main application

2. **Protected Resources:**
   - All pages except `/auth/signin` and `/auth/error` require authentication
   - All API endpoints require valid authentication token
   - Tokens expire after 24 hours

3. **Logout Process:**
   - Clears local storage
   - Redirects to CAS logout URL
   - Then redirects back to signin page

## Key Files

### Authentication Components
- `/lib/auth.js` - NextAuth configuration (simplified for CAS)
- `/lib/middleware.js` - API authentication middleware
- `/components/AuthWrapper.js` - Client-side authentication wrapper
- `/pages/auth/signin.js` - Sign-in page with CAS redirect
- `/pages/auth/error.js` - Authentication error page
- `/pages/api/auth/cas-callback.js` - CAS ticket validation endpoint

### Protected API Endpoints
- `/api/queues` - Queue CRUD operations
- `/api/queues/[id]` - Individual queue operations
- `/api/queues/[id]/next-turn` - Advance queue turn
- `/api/queues/[id]/new-ticket` - Issue new ticket
- `/api/seed` - Seed sample data

### Authentication Utilities
- `/api/auth/logout.js` - Logout endpoint
- `/api/auth/status.js` - Authentication status check

## Security Features

1. **Token-based Authentication:**
   - Simple base64 encoded tokens containing username and timestamp
   - 24-hour token expiration
   - Automatic redirect to login on token expiry

2. **CAS Integration:**
   - Direct integration with IIIT CAS server
   - Ticket validation for secure authentication
   - Support for CAS logout

3. **Protected Routes:**
   - Client-side route protection with AuthWrapper
   - Server-side API protection with middleware
   - Automatic token inclusion in API requests

## Environment Variables

Required in `.env.local`:
```bash
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here
```

## Usage

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Visit `http://localhost:3000`
   - You'll be redirected to CAS login
   - Use your IIIT credentials
   - Access all queue management features

3. **Logout:**
   - Click the logout button in the top-right
   - You'll be logged out from both the app and CAS

## Authentication States

- **Unauthenticated:** Redirected to CAS login
- **Authenticated:** Full access to all features
- **Token Expired:** Automatic redirect to login
- **Authentication Error:** Error page with retry option

## API Authentication

All API requests must include the authentication token:
```javascript
const authToken = localStorage.getItem('cas_auth_token');
fetch('/api/queues', {
  headers: {
    'Authorization': `Bearer ${authToken}`
  }
});
```

## User Information

Once authenticated, user information is available:
- **Username:** IIIT username
- **Email:** `username@iiit.ac.in`
- **Display Name:** Same as username

This information is stored in localStorage and displayed in the UI.
