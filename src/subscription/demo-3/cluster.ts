import cluster from 'cluster';
import os from 'os';
import path from 'path';

import { logger } from '../../utils';

function main() {
  const cpus: os.CpuInfo[] = os.cpus();
  cluster.setupMaster({ exec: path.resolve(__dirname, 'app.ts') });
  for (const cpu of cpus) {
    const worker = cluster.fork();
    logger.info(`Create worker. pid: ${worker.process.pid}`);
  }

  cluster
    .on('disconnect', worker => {
      logger.info(`CLUSTER: Worker ${worker.id} disconnected from the cluster.`);
    })
    .on('exit', (worker, code, signal) => {
      logger.info(`CLUSTER: Worker ${worker.id} died with exit code ${code} (${signal})`);
      const newWorker = cluster.fork();
      logger.info(`CLUSTER: Worker ${newWorker.id} started`);
    });
}

export { main };
