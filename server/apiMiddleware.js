import { registerUserInDb, authenticateUserInDb, getAllRegisteredUsers } from './authDb.js';

export function authApiPlugin() {
  return {
    name: 'portal-backend-auth-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Only handle /api endpoints
        if (!req.url.startsWith('/api')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        // Set standard CORS & JSON headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        // Helper to send JSON response
        const sendJson = (statusCode, data) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        // Helper to parse JSON body
        const parseBody = () => {
          return new Promise((resolve, reject) => {
            let bodyStr = '';
            req.on('data', chunk => {
              bodyStr += chunk;
              if (bodyStr.length > 1e6) {
                req.destroy();
                reject(new Error('Payload too large'));
              }
            });
            req.on('end', () => {
              if (!bodyStr) return resolve({});
              try {
                resolve(JSON.parse(bodyStr));
              } catch (e) {
                reject(new Error('Invalid JSON format in request body.'));
              }
            });
            req.on('error', reject);
          });
        };

        try {
          // ROUTE 1: REGISTER
          if ((pathname === '/api/auth/register' || pathname === '/api/register') && req.method === 'POST') {
            const body = await parseBody();
            const { email, password, fullName, role, phone, metadata } = body;
            const phoneVal = phone || metadata?.phone || null;

            const user = registerUserInDb({
              email,
              password,
              fullName,
              role,
              phone: phoneVal,
              metadata
            });

            console.log(`[Backend API] New user registered: ${user.email} (${user.role})`);
            return sendJson(201, {
              success: true,
              user,
              message: 'Account created successfully and stored in backend database.'
            });
          }

          // ROUTE 2: LOGIN
          if ((pathname === '/api/auth/login' || pathname === '/api/login') && req.method === 'POST') {
            const body = await parseBody();
            const { email, password } = body;

            const user = authenticateUserInDb({ email, password });
            console.log(`[Backend API] User logged in: ${user.email} (${user.role})`);
            return sendJson(200, {
              success: true,
              user,
              message: 'Login successful.'
            });
          }

          // ROUTE 3: GET ALL USERS (excluding passwords)
          if (pathname === '/api/auth/users' && req.method === 'GET') {
            const users = getAllRegisteredUsers();
            return sendJson(200, {
              success: true,
              count: users.length,
              users
            });
          }

          // ROUTE 4: HEALTH CHECK
          if (pathname === '/api/health' && req.method === 'GET') {
            return sendJson(200, {
              status: 'ok',
              database: 'portal.sqlite',
              timestamp: new Date().toISOString()
            });
          }

          // If no API matched
          return sendJson(404, {
            success: false,
            error: `API route ${pathname} not found`
          });
        } catch (err) {
          console.error(`[Backend API Error] ${pathname}:`, err.message);
          const isConflict = err.message.includes('already exists');
          const isAuthFailure = err.message.includes('Incorrect password') || err.message.includes('No account found');
          const status = isConflict ? 409 : isAuthFailure ? 401 : 400;

          return sendJson(status, {
            success: false,
            error: err.message
          });
        }
      });
    }
  };
}
