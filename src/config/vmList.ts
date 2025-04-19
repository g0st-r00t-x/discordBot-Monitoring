/**
 * List of virtual machines to monitor with their respective endpoints
 */
export const vmList = [
	{
		name: "VM1",
		host: "http://192.168.222.19:9100",
		matricsDocker: "http://192.168.222.19:9323",
		description: "Application Server",
	},
	{
		name: "VM2",
		host: "http://192.168.222.13:9100",
		matricsDocker: "http://192.168.222.13:9323",
		description: "Database Server",
	},
	{
		name: "VM3",
		host: "http://192.168.222.17:9100",
		matricsDocker: "http://192.168.222.17:9323",
		description: "Web Server",
	},
];
