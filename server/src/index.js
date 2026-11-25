import { createApp } from './app.js';
import { getDb } from './db/connection.js';

const PORT = Number(process.env.PORT || 3001);

getDb();
const app = createApp();

app.listen(PORT, () => {
  console.log(`Rikkei Lab Express 4 API listening on http://localhost:${PORT}`);
});

