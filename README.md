# Discord Monitoring Bot

Bot Discord untuk monitoring server dengan Prometheus menggunakan TypeScript.

## Fitur

- Monitoring status server (CPU, memory, disk, uptime)
- Monitoring trafik jaringan
- Melihat alert yang aktif
- Menjalankan query PromQL kustom

## Persyaratan

- Node.js 16+
- Docker dan Docker Compose
- Discord Bot Token (dari [Discord Developer Portal](https://discord.com/developers/applications))
- Prometheus dan Alert Manager yang sudah terkonfigurasi

## Instalasi

1. Clone repository
2. Salin file `.env.example` menjadi `.env` dan sesuaikan nilai-nilainya
3. Build dan jalankan bot dengan Docker Compose:

```bash
docker-compose -f docker-compose.yaml -f docker-compose.override.yaml up -d discord-bot
```

## Penggunaan

Bot menggunakan awalan (prefix) `!` secara default. Berikut perintah yang tersedia:

- `!status` - Menampilkan status server (CPU, RAM, disk, uptime)
- `!network` - Menampilkan statistik jaringan
- `!alerts` - Menampilkan alert yang sedang aktif
- `!query <promql>` - Menjalankan query PromQL kustom
- `!help` - Menampilkan daftar perintah yang tersedia

## Pengembangan

Untuk pengembangan lokal:

1. Install dependencies:
```bash
npm install
```

2. Jalankan dalam mode development:
```bash
npm run dev
```

3. Build untuk production:
```bash
npm run build
```

## Struktur Proyek

```
discord-monitoring-bot/
├── src/
│   ├── commands/         # Direktori untuk semua command
│   ├── services/         # Services untuk komunikasi dengan API
│   ├── utils/            # Utilitas umum
│   ├── types/            # Type definitions
│   ├── config.ts         # Konfigurasi aplikasi
│   └── index.ts          # Entry point aplikasi
├── .env                  # Environment variables
└── package.json          # Dependencies
```

## Menambahkan Command Baru

1. Buat file command baru di folder `src/commands/`
2. Implementasikan interface `Command`
3. Daftarkan command di `src/commands/index.ts`