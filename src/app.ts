import express from 'express';
import servicesRoute from './routes/service.router';
import getOrchestrationRoute from '../src/services/orchestration/server.router';

const app = express();

app.use(express.json());
app.use('/', servicesRoute);
app.use('/orchestration', getOrchestrationRoute);
export default app;
