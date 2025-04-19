import { Collection } from 'discord.js';
import type { Command } from '../types/command';

import statusCommand from './status';
import networkCommand from './network';
import alertsCommand from './alerts';
import queryCommand from './query';
import helpCommand from './help';

// Create commands collection
const commands = new Collection<string, Command>();

// Register all commands
const commandList = [
  statusCommand,
  networkCommand,
  alertsCommand,
  queryCommand,
  helpCommand
];

// Add commands to collection
commandList.forEach(command => {
  commands.set(command.name, command);
});

export default commands;