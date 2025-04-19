import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  // Discord Bot Configuration
  discord: {
    token: process.env.DISCORD_BOT_TOKEN || '',
    prefix: process.env.COMMAND_PREFIX || '!',
  },
  
  // Prometheus Configuration
  prometheus: {
    url: process.env.PROMETHEUS_URL || 'http://prometheus:9090',
    timeout: 5000, // Timeout in milliseconds
  },
  
  // Alert Manager Configuration
  alertManager: {
    url: process.env.ALERTMANAGER_URL || 'http://alertmanager:9093',
  }
};

// Validate required environment variables
if (!config.discord.token) {
  console.error('DISCORD_BOT_TOKEN is required');
  process.exit(1);
}

export default config;