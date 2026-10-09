import app from './app';
import { config } from './config/env';

app.listen(config.port, () => {
  console.log(`User app running on http://localhost:${config.port}, using Ashor at ${config.ashorUrl}`);
});
