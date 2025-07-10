import express from 'express';
import dotenv from 'dotenv';
import { router } from './routes';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200', // allow this origin
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['*'],
    credentials: false,
  }),
);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
