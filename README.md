# WebSocket Chat Application

A real-time chat application built with Node.js WebSocket server and a modern HTML5 client interface.

## Features

- 🔄 **Real-time messaging** using WebSocket protocol
- 💬 **Multi-user chat** with username support
- 🎨 **Modern UI** with responsive design
- 🔌 **Auto-reconnection** with exponential backoff
- 📱 **Mobile-friendly** responsive design
- 🛡️ **Error handling** and connection status indicators
- ⚡ **Fast and lightweight** implementation

## Project Structure

```
websocket/
├── server.js          # WebSocket server implementation
├── package.json       # Node.js dependencies
├── README.md         # This file
└── public/           # Client-side files
    ├── index.html    # Main HTML page
    ├── style.css     # CSS styles
    └── script.js     # JavaScript client code
```

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone or download the project files**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## Usage

1. **Enter your username** in the username field
2. **Type your message** in the message input
3. **Press Enter or click Send** to send your message
4. **Open multiple browser tabs/windows** to test multi-user chat

## How It Works

### Server (`server.js`)
- Uses Express.js to serve static files
- Implements WebSocket server using the `ws` library
- Handles client connections, message broadcasting, and disconnections
- Provides a health check endpoint at `/health`

### Client (`public/script.js`)
- Establishes WebSocket connection to the server
- Handles message sending and receiving
- Implements auto-reconnection with exponential backoff
- Manages UI state and user interactions

### Features Explained

#### Real-time Communication
- WebSocket provides full-duplex communication
- Messages are instantly broadcast to all connected clients
- No polling required - true real-time experience

#### Auto-reconnection
- Automatically attempts to reconnect if connection is lost
- Uses exponential backoff to avoid overwhelming the server
- Maximum 5 reconnection attempts

#### Message Types
- **User messages**: Regular chat messages from users
- **System messages**: Server notifications (user joined/left, welcome messages)

#### Security Features
- HTML escaping to prevent XSS attacks
- Input validation and sanitization
- Connection state management

## API Endpoints

### WebSocket Events

#### Client to Server
```javascript
{
  "user": "username",
  "message": "Hello, world!"
}
```

#### Server to Client
```javascript
// User message
{
  "type": "message",
  "user": "username",
  "message": "Hello, world!",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// System message
{
  "type": "system",
  "message": "A new user joined the chat",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### HTTP Endpoints

- `GET /` - Main chat interface
- `GET /health` - Server health check
  ```json
  {
    "status": "OK",
    "connections": 3,
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
  ```

## Customization

### Changing the Port
Edit the `PORT` variable in `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Styling
Modify `public/style.css` to customize the appearance.

### Adding Features
- **Private messaging**: Add user-to-user message routing
- **File sharing**: Implement file upload/download
- **User authentication**: Add login/logout functionality
- **Message persistence**: Store messages in a database

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `server.js`
   - Or kill the process using the port

2. **WebSocket connection fails**
   - Check if the server is running
   - Verify firewall settings
   - Check browser console for errors

3. **Messages not appearing**
   - Check browser console for JavaScript errors
   - Verify WebSocket connection status
   - Ensure username is entered

### Debug Mode
Enable debug logging by adding this to `server.js`:
```javascript
const debug = require('debug')('websocket:server');
// Add debug() calls throughout the code
```

## Dependencies

- **ws**: WebSocket implementation for Node.js
- **express**: Web framework for serving static files
- **nodemon**: Development dependency for auto-restart

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy chatting! 🚀** 