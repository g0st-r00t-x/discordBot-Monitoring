import { EmbedBuilder } from 'discord.js';

/**
 * Buat embed kosong dengan properti default
 * @param title - Judul embed
 * @param color - Warna embed (hex)
 * @returns EmbedBuilder
 */
export function createBaseEmbed(title: string, color: number = 0x0099FF): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: 'Server Monitoring' });
}

/**
 * Buat embed error
 * @param message - Pesan error
 * @returns EmbedBuilder
 */
export function createErrorEmbed(message: string): EmbedBuilder {
  return createBaseEmbed('Error', 0xFF0000)
    .setDescription(message);
}