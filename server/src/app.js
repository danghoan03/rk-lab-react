import cors from 'cors';
import express from 'express';
import { getDb } from './db/connection.js';
import authRouter from './routes/auth.js';
import borrowingsRouter from './routes/borrowings.js';
import equipmentsRouter from './routes/equipments.js';
import finesRouter from './routes/fines.js';
import penaltiesRouter from './routes/penalties.js';
import reservationsRouter from './routes/reservations.js';
import { errorHandler, notFoundHandler, sendSuccess } from './utils/apiResponse.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', async (_req, res, next) => {
    try {
      getDb();
      return sendSuccess(res, {
        message: 'Rikkei Lab API đang hoạt động.',
        data: { status: 'ok' },
      });
    } catch (err) {
      return next(err);
    }
  });

  app.use('/api/equipments', equipmentsRouter);
  app.use('/api/borrowings', borrowingsRouter);
  app.use('/api/fines', finesRouter);
  app.use('/api/penalties', penaltiesRouter);
  app.use('/api/reservations', reservationsRouter);
  app.use('/api/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
