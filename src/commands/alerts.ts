import { Message } from 'discord.js';
import type { Command } from '../types/command';
import * as prometheusService from '../services/prometheus';
import { createBaseEmbed, createErrorEmbed } from '../utils/embeds';
import type { AlertManagerAlert } from '../types/prometheus';
import { ChannelType } from "discord.js";


const alertsCommand: Command = {
  name: 'alerts',
  description: 'Menampilkan alert yang sedang aktif',
  
  async execute(message: Message): Promise<void> {
    try {
      if (message.channel.type === ChannelType.GuildText || 
    message.channel.type === ChannelType.DM) {
  await message.channel.sendTyping();
}
      
      // Get active alerts
      const alertsData = await prometheusService.getActiveAlerts();
      
      // Filter firing alerts
      const activeAlerts = alertsData.data.alerts.filter(
        (alert: AlertManagerAlert) => alert.state === 'firing'
      );
      
      // Create embed with appropriate color based on alert count
      const embed = createBaseEmbed(
        'Active Alerts',
        activeAlerts.length > 0 ? 0xFF0000 : 0x00FF00
      ).setDescription(
        activeAlerts.length > 0 
          ? `Terdapat ${activeAlerts.length} alert yang aktif` 
          : 'Tidak ada alert yang aktif saat ini'
      );
      
      // Add alert details
      if (activeAlerts.length > 0) {
        activeAlerts.forEach((alert: AlertManagerAlert, index: number) => {
          const name = alert.labels.alertname || `Alert #${index + 1}`;
          const severity = alert.labels.severity || 'unknown';
          const summary = alert.annotations.summary || 'No summary';
          const description = alert.annotations.description || 'No description';
          
          embed.addFields({
            name: `${name} (${severity})`,
            value: `${summary}\n${description}`,
            inline: false
          });
        });
      }
      
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in alerts command:', error);
      const errorEmbed = createErrorEmbed('Terjadi kesalahan saat mengambil informasi alert.');
      await message.reply({ embeds: [errorEmbed] });
    }
  }
};

export default alertsCommand;