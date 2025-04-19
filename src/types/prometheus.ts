export interface PrometheusResponse {
    status: string;
    data: {
      resultType: string;
      result: PrometheusResult[];
    };
  }
  
  export interface PrometheusResult {
    metric: Record<string, string>;
    value?: [number, string]; // [timestamp, value]
    values?: [number, string][]; // For range queries: [[timestamp, value], ...]
  }
  
  export interface AlertManagerAlert {
    annotations: {
      description?: string;
      summary?: string;
      [key: string]: string | undefined;
    };
    labels: {
      alertname: string;
      severity?: string;
      instance?: string;
      job?: string;
      [key: string]: string | undefined;
    };
    state: 'firing' | 'pending' | 'resolved';
    activeAt: string;
    value: string;
  }
  
  export interface AlertManagerResponse {
    status: string;
    data: {
      alerts: AlertManagerAlert[];
    };
  }
  
  export interface NetworkData {
    rx: PrometheusResponse;
    tx: PrometheusResponse;
  }
  
  export interface NetworkInterface {
    name: string;
    rx: number;
    tx: number;
  }

  export interface VMMetrics {
		name: string;
		host: string;
		status: string;
		cpu: number | null;
		memory: number | null;
		disk: number | null;
		uptime: number | null;
	}

	export interface DockerContainerStats {
		id: string;
		name: string;
		cpu: number;
		memory: number;
		status: string;
	}