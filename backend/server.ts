/// <reference path="./src/types/express.d.ts" />
import './src/config/env';
import './src/models/index';
import { createApp } from './src/app';
import { testConnection } from './src/config/database';
import { env } from './src/config/env';
import { startImportWorker } from './src/workers/import.worker';
import { startReportWorker } from './src/workers/report.worker';

async function bootstrap(): Promise<void> {
  try {
    await testConnection();

    startImportWorker();
    startReportWorker();

    const app = createApp();

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port} [${env.nodeEnv}]`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
