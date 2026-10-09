import express from 'express';
import workflowRoute from './routes/workflow.router';

const app = express();

app.use(express.json());
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'User app is healthy' });
});
app.use('/workflows', workflowRoute);

export default app;
