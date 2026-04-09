import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { errorHandler, notFound } from './middleware/error-handler';

import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import diaryRoutes from './routes/diary';
import dashboardRoutes from './routes/dashboard';
import reportsRoutes from './routes/reports';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();
const PORT = process.env.PORT ?? 5000;

//middleware
// app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:3000', credentials: true }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/logs', dashboardRoutes);   // weight & water logs share saem router
app.use('/api/reports', reportsRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

//error handlers
app.use(notFound);
app.use(errorHandler);

//start
connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});