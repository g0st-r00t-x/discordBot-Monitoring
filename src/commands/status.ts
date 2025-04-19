import { Message } from 'discord.js';
import type { Command } from '../types/command';
import * as prometheusService from '../services/prometheus';
import { formatNumber, formatUptime, getColorFromPercentage } from '../utils/formatters';
import { createBaseEmbed, createErrorEmbed } from '../utils/embeds';
import { ChannelType } from 'discord.js';

const statusCommand: Command = {
  name: 'status',
  description: 'Menampilkan status server (CPU, RAM, disk, uptime)',
  
  async execute(message: Message): Promise<void> {
    try {
      if (message.channel.type === ChannelType.GuildText || 
          message.channel.type === ChannelType.DM) {
          if (message.channel.type === ChannelType.GuildText || 
    message.channel.type === ChannelType.DM) {
  await message.channel.sendTyping();
}
      }
      
      // Mengambil semua data secara parallel
      const [cpuData, memoryData, diskData, uptimeData, prometheusStatus] = await Promise.all([
        prometheusService.getCpuUsage(),
        prometheusService.getMemoryUsage(),
        prometheusService.getDiskUsage(),
        prometheusService.getServerUptime(),
        prometheusService.getPrometheusStatus()
      ]);
      
      // Extract CPU usage value
      let cpuUsage = 'N/A';
      let cpuUsageValue = 0;
      if (cpuData?.data?.result && cpuData.data.result.length > 0) {
        cpuUsageValue = parseFloat(cpuData.data.result[0].value![1]);
        cpuUsage = `${formatNumber(cpuUsageValue)}%`;
      }
      
      // Extract memory usage value
      let memoryUsage = 'N/A';
      let memoryUsageValue = 0;
      if (memoryData?.data?.result && memoryData.data.result.length > 0) {
        memoryUsageValue = parseFloat(memoryData.data.result[0].value![1]);
        memoryUsage = `${formatNumber(memoryUsageValue)}%`;
      }
      
      // Extract disk usage value
      let diskUsage = 'N/A';
      let diskUsageValue = 0;
      if (diskData?.data?.result && diskData.data.result.length > 0) {
        diskUsageValue = parseFloat(diskData.data.result[0].value![1]);
        diskUsage = `${formatNumber(diskUsageValue)}%`;
      }
      
      // Extract uptime value
      let uptime = 'N/A';
      if (uptimeData?.data?.result && uptimeData.data.result.length > 0) {
        uptime = formatUptime(uptimeData.data.result[0].value![1]);
      }
      
      // Calculate average for color
      const averageUsage = (cpuUsageValue + memoryUsageValue + diskUsageValue) / 3;
      const color = getColorFromPercentage(averageUsage);
      
      // Create and send embed
      const embed = createBaseEmbed('Server Status', color)
        .setDescription('Informasi status server saat ini')
        .addFields(
          { name: 'CPU Usage', value: cpuUsage, inline: true },
          { name: 'Memory Usage', value: memoryUsage, inline: true },
          { name: 'Disk Usage', value: diskUsage, inline: true },
          { name: 'Uptime', value: uptime, inline: true },
          { name: 'Prometheus', value: prometheusStatus, inline: true }
        );
      
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in status command:', error);
      const errorEmbed = createErrorEmbed('Terjadi kesalahan saat mengambil status server.');
      await message.reply({ embeds: [errorEmbed] });
    }
  }
};

export default statusCommand;