import { Message } from 'discord.js';
import type { Command } from '../types/command';
import * as prometheusService from '../services/prometheus';
import { createBaseEmbed, createErrorEmbed } from '../utils/embeds';
import { ChannelType } from "discord.js";


const queryCommand: Command = {
	name: "query",
	description: "Menjalankan query PromQL kustom",

	async execute(message: Message, args: string[]): Promise<Message | void> {
		// Check if query is provided
		if (args.length === 0) {
			const errorEmbed = createErrorEmbed(
				"Silakan masukkan query PromQL yang ingin dijalankan."
			);
			return message.reply({ embeds: [errorEmbed] });
		}

		try {
			if (
				message.channel.type === ChannelType.GuildText ||
				message.channel.type === ChannelType.DM
			) {
				await message.channel.sendTyping();
			}

			// Execute the query
			const query = args.join(" ");
			const result = await prometheusService.queryPrometheus(query);

			let resultText = "";

			// Format the result
			if (result.data.result && result.data.result.length > 0) {
				result.data.result.forEach((item, index) => {
					if (index > 9) return; // Limit results

					let metricInfo = "";
					if (item.metric) {
						const metricLabels = Object.entries(item.metric)
							.map(([key, value]) => `${key}="${value}"`)
							.join(", ");
						metricInfo = `{${metricLabels}}`;
					}

					let value = "";
					if (item.value) {
						value = item.value[1];
					} else if (item.values) {
						value = item.values
							.map((v) => `[${new Date(v[0] * 1000).toISOString()}, ${v[1]}]`)
							.join(", ");
					}

					resultText += `${metricInfo}: ${value}\n`;
				});

				// Add note if results are truncated
				if (result.data.result.length > 10) {
					resultText += `\n... dan ${
						result.data.result.length - 10
					} hasil lainnya.`;
				}
			} else {
				resultText = "Tidak ada hasil yang ditemukan untuk query tersebut.";
			}

			// Create and send embed
			const embed = createBaseEmbed(
				"Prometheus Query Result",
				0x9932cc
			).setDescription(`Query: \`${query}\`\n\n\`\`\`\n${resultText}\n\`\`\``);

			await message.reply({ embeds: [embed] });
		} catch (error) {
			console.error("Error in query command:", error);
			const errorEmbed = createErrorEmbed(
				"Terjadi kesalahan saat menjalankan query Prometheus."
			);
			await message.reply({ embeds: [errorEmbed] });
		}
	},
};

export default queryCommand;