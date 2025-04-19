//services/prometheus.ts
import fetch from 'node-fetch';
import config from '../config/config';
import type { 
  PrometheusResponse, 
  AlertManagerResponse, 
  NetworkData 
} from '../types/prometheus';

const PROMETHEUS_URL = config.prometheus.url;
const ALERTMANAGER_URL = config.alertManager.url;

/**
 * Melakukan query ke Prometheus API
 * @param query - PromQL query
 * @returns Hasil query
 */
export async function queryPrometheus(query: string): Promise<PrometheusResponse> {
  try {
    const response = await fetch(
      `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(query)}`,
      { timeout: config.prometheus.timeout }
    );
    
    if (!response.ok) {
      throw new Error(`Prometheus query error: ${response.statusText}`);
    }
    
    const data = await response.json() as PrometheusResponse;
    return data;
  } catch (error) {
    console.error('Error querying Prometheus:', error);
    throw error;
  }
}

/**
 * Mendapatkan informasi CPU usage
 * @returns CPU usage data
 */
export async function getCpuUsage(): Promise<PrometheusResponse> {
  const query = '100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)';
  return queryPrometheus(query);
}

/**
 * Mendapatkan informasi memory usage
 * @returns Memory usage data
 */
export async function getMemoryUsage(): Promise<PrometheusResponse> {
  const query = '(node_memory_MemTotal_bytes - node_memory_MemFree_bytes - node_memory_Buffers_bytes - node_memory_Cached_bytes) / node_memory_MemTotal_bytes * 100';
  return queryPrometheus(query);
}

/**
 * Mendapatkan informasi disk usage
 * @returns Disk usage data
 */
export async function getDiskUsage(): Promise<PrometheusResponse> {
  const query = '100 - ((node_filesystem_avail_bytes{mountpoint="/"} * 100) / node_filesystem_size_bytes{mountpoint="/"})';
  return queryPrometheus(query);
}

/**
 * Mendapatkan status Prometheus
 * @returns Status Prometheus
 */
export async function getPrometheusStatus(): Promise<string> {
  try {
    const response = await fetch(`${PROMETHEUS_URL}/-/healthy`, { 
      timeout: config.prometheus.timeout 
    });
    return response.ok ? 'online' : 'offline';
  } catch (error) {
    return 'offline';
  }
}

/**
 * Mendapatkan informasi uptime server
 * @returns Uptime data
 */
export async function getServerUptime(): Promise<PrometheusResponse> {
  const query = 'node_time_seconds - node_boot_time_seconds';
  return queryPrometheus(query);
}

/**
 * Mendapatkan beban jaringan
 * @returns Network data
 */
export async function getNetworkTraffic(): Promise<NetworkData> {
  const rxQuery = 'rate(node_network_receive_bytes_total{device!="lo"}[5m])';
  const txQuery = 'rate(node_network_transmit_bytes_total{device!="lo"}[5m])';
  
  const rxData = await queryPrometheus(rxQuery);
  const txData = await queryPrometheus(txQuery);
  
  return { rx: rxData, tx: txData };
}

/**
 * Mendapatkan daftar alert yang aktif
 * @returns Alert data
 */
export async function getActiveAlerts(): Promise<AlertManagerResponse> {
  try {
    const response = await fetch(`${ALERTMANAGER_URL}/api/v2/alerts`, {
      timeout: config.prometheus.timeout
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching alerts: ${response.statusText}`);
    }
    
    const data = await response.json() as AlertManagerResponse;
    return data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
}