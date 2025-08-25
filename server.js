const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication namespace
  const authNamespace = io.of('/auth');

  // Handle authentication events
  authNamespace.on('connection', (socket) => {
    console.log('Client connected to auth namespace:', socket.id);

    // Handle login event
    socket.on('login', async (credentials) => {
      try {
        console.log('Socket login attempt with credentials:', credentials);
        
        // Make a request to the login API
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/login`;
        console.log('Making request to login API:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });

        console.log('Login API response status:', response.status);
        const data = await response.json();
        console.log('Login API response data:', data);

        if (response.ok) {
          console.log('Login successful, emitting login_success event');
          // Emit success event with user data
          socket.emit('login_success', data);
          
          // Join user's room for personalized updates
          socket.join(`user:${data.user.id}`);
          
          // Broadcast to admin users that a new user logged in
          authNamespace.to('admin').emit('user_activity', {
            type: 'login',
            user: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email
            },
            timestamp: new Date()
          });
        } else {
          console.log('Login failed, emitting login_error event');
          // Emit error event
          socket.emit('login_error', data);
        }
      } catch (error) {
        console.error('Login error:', error);
        socket.emit('login_error', { success: false, message: 'Server error during login' });
      }
    });

    // Handle register event
    socket.on('register', async (userData) => {
      try {
        // Make a request to the register API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
          // Emit success event with user data
          socket.emit('register_success', data);
          
          // Join user's room for personalized updates
          socket.join(`user:${data.user.id}`);
          
          // Broadcast to admin users that a new user registered
          authNamespace.to('admin').emit('user_activity', {
            type: 'register',
            user: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email
            },
            timestamp: new Date()
          });
        } else {
          // Emit error event
          socket.emit('register_error', data);
        }
      } catch (error) {
        console.error('Registration error:', error);
        socket.emit('register_error', { success: false, message: 'Server error during registration' });
      }
    });

    // Handle user authentication status check
    socket.on('check_auth', async (token) => {
      try {
        // Make a request to the me API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          // Emit success event with user data
          socket.emit('auth_status', { authenticated: true, user: data.user });
          
          // Join user's room and role room
          socket.join(`user:${data.user.id}`);
          if (data.user.role === 'admin') {
            socket.join('admin');
          }
        } else {
          // Emit unauthenticated status
          socket.emit('auth_status', { authenticated: false });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        socket.emit('auth_status', { authenticated: false, error: 'Server error during authentication check' });
      }
    });

    // Handle logout event
    socket.on('logout', (userId) => {
      if (userId) {
        // Leave user's room
        socket.leave(`user:${userId}`);
        socket.leave('admin');
        
        // Broadcast to admin users that a user logged out
        authNamespace.to('admin').emit('user_activity', {
          type: 'logout',
          userId,
          timestamp: new Date()
        });
      }
      socket.emit('logout_success');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected from auth namespace:', socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});