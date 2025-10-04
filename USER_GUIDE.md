# TAze Queue System - User Guide

## Overview

TAze is a name-based queue management system where users join queues using their authenticated names instead of numeric tickets.

## How It Works

### For Users

1. **Login**: Authenticate using your IIIT CAS credentials
2. **Join Queue**: Click "Join Queue" to add your name to the queue
3. **Wait**: Your position in the queue will be displayed with a numbered list
4. **Get Served**: When it's your turn, your name will appear in the "Currently Serving" section

### For Queue Managers

1. **Call Next**: Click "Next Turn" to call the next person in the queue
2. **View Queue**: See the complete list of people waiting with their positions
3. **Manage**: Admin users can create and delete queues

## Key Features

### Real-time Updates
- The queue automatically refreshes every 15 seconds
- See live updates when people join or leave the queue
- No need to manually refresh the page

### Duplicate Prevention
- Users cannot join the same queue multiple times
- The system prevents duplicate entries automatically
- Clear error messages if you try to join a queue you're already in

### Visual Queue Display
- See exactly who is currently being served
- View the complete queue with numbered positions
- Clear indication of how many people are waiting

### Mobile Friendly
- Responsive design works on phones and tablets
- Touch-friendly buttons and interface
- All functionality available on mobile devices

## Queue Display

Each queue shows:
- **Currently Serving**: The person being helped right now
- **People Waiting**: Total number of people in the queue
- **Next in Line**: Who will be called next
- **Queue List**: Complete numbered list of all people waiting

## Joining a Queue

1. Click the green "Join Queue" button
2. Your name is automatically added to the end of the queue
3. You'll see your position in the numbered queue list
4. Wait for your turn to be called

## For Administrators

Admins have additional features:
- Create new queues
- Delete existing queues

## Best Practices

### For Users
- Only join queues you actually need service for
- Don't leave the system if you're in a queue
- Check your position regularly

### For Queue Managers
- Call people promptly when their turn comes
- Use clear queue descriptions
- Regularly check the queue status

## Troubleshooting

### Can't Join Queue
- Make sure you're logged in
- Check if you're already in the queue
- Refresh the page and try again

### Not Seeing Updates
- Wait for automatic refresh (15 seconds)
- Check your internet connection
- Try manually refreshing the page

### Login Issues
- Make sure you're on the IIIT network
- Clear your browser cache
- Try logging out and back in

## Technical Details

- Built with Next.js and MongoDB
- Secured with CAS authentication
- Real-time updates without WebSockets
- Mobile-responsive design

For technical support or questions, contact the system administrator.
