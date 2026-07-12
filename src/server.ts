import express, { Application } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes';
import attendanceRoutes from './routes/attendance.routes';
import reportRoutes from './routes/report.routes';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/reports', reportRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'HR Backend API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});