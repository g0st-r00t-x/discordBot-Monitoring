/**
 * Format angka dengan 2 decimal places
 * @param num - Angka yang akan diformat
 * @returns Angka yang sudah diformat
 */
export function formatNumber(num: number | string): string {
    return parseFloat(num.toString()).toFixed(2);
  }
  
  /**
   * Format bytes menjadi unit yang lebih mudah dibaca
   * @param bytes - Jumlah bytes
   * @returns Nilai yang diformat (KB, MB, GB)
   */
  export function formatBytes(bytes: number | string): string {
    const bytesNum = typeof bytes === 'string' ? parseFloat(bytes) : bytes;
    
    if (bytesNum === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytesNum) / Math.log(k));
    
    return `${parseFloat((bytesNum / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
  
  /**
   * Format detik menjadi format waktu yang lebih mudah dibaca
   * @param seconds - Jumlah detik
   * @returns Format waktu (hari, jam, menit, detik)
   */
  export function formatUptime(seconds: number | string): string {
    let totalSeconds = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
    
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  }
  
  /**
   * Generate warna berdasarkan nilai persentase
   * @param percentage - Nilai persentase (0-100)
   * @returns Kode warna hex
   */
  export function getColorFromPercentage(percentage: number): number {
    if (percentage < 50) {
      return 0x00FF00; // Green
    } else if (percentage < 80) {
      return 0xFFFF00; // Yellow
    } else {
      return 0xFF0000; // Red
    }
  }