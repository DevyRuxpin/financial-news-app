const v8 = require('v8');
const os = require('os');
const logger = require('./logger');

class Monitoring {
  constructor() {
    this.enabled = process.env.MONITORING_ENABLED === 'true';
  }

  logMetrics() {
    if (!this.enabled) return;

    const heapStats = v8.getHeapStatistics();
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const loadAvg = os.loadavg();

    const metrics = {
      timestamp: new Date().toISOString(),
      memory: {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external,
        rss: memoryUsage.rss
      },
      heap: {
        totalHeapSize: heapStats.total_heap_size,
        usedHeapSize: heapStats.used_heap_size,
        heapSizeLimit: heapStats.heap_size_limit
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      system: {
        loadAverage: loadAvg,
        uptime: os.uptime()
      }
    };

    logger.info('System metrics', metrics);
  }

  startMonitoring(interval = 60000) { // Default to 1 minute
    if (!this.enabled) return;

    setInterval(() => {
      this.logMetrics();
    }, interval);

    logger.info('Monitoring started');
  }
}

module.exports = new Monitoring(); 