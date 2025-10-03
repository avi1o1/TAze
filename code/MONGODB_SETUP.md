# MongoDB Atlas Setup Guide

## Quick Setup Instructions

### Option 1: Use Provided Connection (Temporary)
The application is currently configured with a demo MongoDB Atlas connection that should work for testing.

### Option 2: Set Up Your Own MongoDB Atlas (Recommended for Production)

1. **Create a MongoDB Atlas Account**
   - Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
   - Sign up for a free account

2. **Create a New Cluster**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free tier)
   - Select your preferred cloud provider and region
   - Name your cluster (e.g., "taze-cluster")

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password
   - Set privileges to "Read and write to any database"

4. **Whitelist IP Address**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
   - For production, add only your server's IP

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your preferred database name (e.g., "taze-queue-system")

6. **Update Environment Variables**
   ```bash
   # Edit .env.local file
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.xxxxx.mongodb.net/<database-name>?retryWrites=true&w=majority
   ```

7. **Restart the Application**
   ```bash
   npm run build
   npm start
   ```

## Testing the Connection

1. **Visit the Application**
   - Open [http://localhost:3000](http://localhost:3000)

2. **Create Sample Data**
   - Make a POST request to [http://localhost:3000/api/seed](http://localhost:3000/api/seed)
   - Or use the create queue button in the UI

3. **Verify Database**
   - Check your MongoDB Atlas dashboard
   - Go to "Browse Collections" to see your data

## Troubleshooting

- **Connection Timeout**: Check your IP whitelist settings
- **Authentication Failed**: Verify username/password in connection string
- **Database Not Found**: MongoDB will create the database automatically when first data is inserted

## Security Notes

- Never commit your actual MongoDB credentials to version control
- Use environment variables for sensitive information
- For production, restrict IP access to your server only
- Use strong passwords for database users
