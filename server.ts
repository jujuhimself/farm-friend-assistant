
import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable CORS for mobile app development (Capacitor)
  app.use(cors({
    origin: '*', // In production, you should restrict this to your app's origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());

  // --- API ROUTES ---
  
  // Health check for terminal uplink
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'STABLE', 
      uplink: 'ACTIVE',
      timestamp: new Date().toISOString(),
      node: 'DAR_ES_SALAAM_TERMINAL'
    });
  });

  // Sample Market Data Route
  app.get('/api/market/summary', (req, res) => {
    res.json({
      volatility: '4.2%',
      momentum: 'HIGH',
      risk: 'AAA',
      last_sync: new Date().toLocaleTimeString()
    });
  });

  // --- VITE MIDDLEWARE ---
  
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 GRAIN_X TERMINAL BACKEND ACTIVE`);
    console.log(`📡 UPLINK: http://localhost:${PORT}`);
    console.log(`🛠️  MODE: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

startServer().catch((err) => {
  console.error('TERMINAL_CRITICAL_FAILURE:', err);
  process.exit(1);
});
