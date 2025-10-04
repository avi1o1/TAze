#!/bin/bash

echo "🚀 Setting up TAze Queue Management System..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp .env.local.example .env.local
    echo "⚠️  Please edit .env.local and add your MongoDB connection string!"
else
    echo "✅ Environment file already exists"
fi

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local and add your MongoDB connection string"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 to view the application"
