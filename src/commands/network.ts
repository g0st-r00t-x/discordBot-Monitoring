import { Message } from 'discord.js';
import type { Command } from '../types/command';
import * as prometheusService from '../services/prometheus';
import { formatBytes } from '../utils/formatters';
import { createBaseEmbed, createErrorEmbed } from '../utils/embeds';
import type { NetworkInterface } from '../types/prometheus';
import { ChannelType } from "discord.js";


const networkCommand: Command = {
  name: 'network',
  description: 'Menampilkan statistik jaringan',
  
  async execute(message: Message): Promise<void> {
    try {
      if (message.channel.type === ChannelType.GuildText || 
    message.channel.type === ChannelType.DM) {
  await message.channel.sendTyping();
}
      
      // Get network traffic data
      const networkData = await prometheusService.getNetworkTraffic();
      
      let rxTotal = 0;
      let txTotal = 0;
      const interfaces: NetworkInterface[] = [];
      
      // Process receive data
      if (networkData.rx?.data?.result) {
        networkData.rx.data.result.forEach(item => {
          const device = item.metric.device;
          const rxBytes = parseFloat(item.value![1]);
          
          interfaces.push({
            name: device,
            rx: rxBytes,
            tx: 0
          });
          
          rxTotal += rxBytes;
        });
      }
      
      // Process transmit data
      if (networkData.tx?.data?.result) {
        networkData.tx.data.result.forEach(item => {
          const device = item.metric.device;
          const txBytes = parseFloat(item.value![1]);
          
          const existingInterface = interfaces.find(i => i.name === device);
          if (existingInterface) {
            existingInterface.tx = txBytes;
          } else {
            interfaces.push({
              name: device,
              rx: 0,
              tx: txBytes
            });
          }
          
          txTotal += txBytes;
        });
      }
      
      // Create embed
      const embed = createBaseEmbed('Network Traffic', 0x0099FF)
        .setDescription('Informasi traffic jaringan saat ini (bytes/second)')
        .addFields(
          { name: 'Total RX', value: formatBytes(rxTotal), inline: true },
          { name: 'Total TX', value: formatBytes(txTotal), inline: true }
        );
      
      // Add interface details
      interfaces.forEach(iface => {
        embed.addFields({
          name: `Interface: ${iface.name}`,
          value: `RX: ${formatBytes(iface.rx)}/s\nTX: ${formatBytes(iface.tx)}/s`,
          inline: true
        });
      });
      
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in network command:', error);
      const errorEmbed = createErrorEmbed('Terjadi kesalahan saat mengambil informasi jaringan.');
      await message.reply({ embeds: [errorEmbed] });
    }
  }
};

export default networkCommand;