import { Message } from 'discord.js';
import type { Command } from '../types/command';
import { createBaseEmbed } from '../utils/embeds';
import config from '../config/config';

const helpCommand: Command = {
  name: 'help',
  description: 'Menampilkan bantuan',
  
  async execute(message: Message): Promise<void> {
    const prefix = config.discord.prefix;
    
    // Create help embed
    const embed = createBaseEmbed('Monitoring Bot - Help', 0xFFFF00)
      .setDescription('Daftar command yang tersedia:')
      .addFields(
        { 
          name: `${prefix}status`, 
          value: 'Menampilkan status server (CPU, RAM, disk, uptime)', 
          inline: false 
        },
        { 
          name: `${prefix}network`, 
          value: 'Menampilkan statistik jaringan', 
          inline: false 
        },
        { 
          name: `${prefix}alerts`, 
          value: 'Menampilkan alert yang sedang aktif', 
          inline: false 
        },
        { 
          name: `${prefix}query <promql>`, 
          value: 'Menjalankan query PromQL kustom', 
          inline: false 
        },
        { 
          name: `${prefix}help`, 
          value: 'Menampilkan bantuan ini', 
          inline: false 
        }
      );
    
    await message.reply({ embeds: [embed] });
  }
};

export default helpCommand;