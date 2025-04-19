import { Client, GatewayIntentBits, Message } from 'discord.js';
import config from './config/config';
import commands from './commands';
import { createErrorEmbed } from './utils/embeds';

// Create Discord client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Command prefix
const prefix = config.discord.prefix;

// Log when client is ready
client.once('ready', () => {
  console.log(`Discord bot logged in as ${client.user?.tag}`);
  console.log(`Connected to ${client.guilds.cache.size} guilds`);
  console.log(`Using command prefix: ${prefix}`);
  
  // Set bot status
  client.user?.setActivity('server metrics', { type: 3 }); // Watching server metrics
});

// Handle incoming messages
client.on('messageCreate', async (message: Message) => {
  // Ignore messages from bots and messages that don't start with prefix
  if (message.author.bot || !message.content.startsWith(prefix)) return;
  
  // Split command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();
  
  // Check if command exists
  if (!commandName || !commands.has(commandName)) {
    // List available commands if command not found
    const availableCommands = Array.from(commands.keys())
      .map(cmd => `${prefix}${cmd}`)
      .join(', ');
      
    const errorEmbed = createErrorEmbed(`Command tidak ditemukan. Command yang tersedia: ${availableCommands}`);
    return message.reply({ embeds: [errorEmbed] });
  }
  
  // Get command
  const command = commands.get(commandName);
  
  try {
    // Execute command
    await command?.execute(message, args);
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
    
    const errorEmbed = createErrorEmbed('Terjadi kesalahan saat menjalankan command tersebut.');
    await message.reply({ embeds: [errorEmbed] });
  }
});

// Error handling for client
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

// Process error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Login to Discord
client.login(config.discord.token)
  .then(() => {
    console.log('Bot login successful');
  })
  .catch((error) => {
    console.error('Failed to login:', error);
    process.exit(1);
  });