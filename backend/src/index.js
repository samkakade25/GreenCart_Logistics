import express from 'express';
import cors from 'cors';
import driverRoutes from './routes/driverRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import orderRoutes from "./routes/orderRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { authenticateJWT } from "./controllers/authController.js";


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/drivers', driverRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
