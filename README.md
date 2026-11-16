# Geng Pilah — Petualangan Pahlawan Cilik Penyelamat Bumi

Website edukasi lingkungan untuk anak TK & SD (5–12 tahun) yang mengajarkan cara memilah sampah
lewat permainan, cerita interaktif, dan sertifikat pahlawan. Dibuat untuk
**TECHNO VERSARY VOL. II Web Design Competition** — tema *EcoDigital For Environment*
(HIMA-TI FKOM Universitas Kuningan).

## Deskripsi Website

Geng Pilah memperkenalkan lima karakter tong sampah — **Si Orgi** (organik), **Si Rino**
(anorganik), **Si Bebe** (B3), **Si Kiki** (kertas), dan **Si Resi** (residu) — yang menemani
anak belajar memilah sampah tanpa membaca teks panjang.

Isi utama:

- **Beranda Petualangan** — jalur petualangan SVG yang tergambar mengikuti scroll ("Jejak
  Petualangan"), taman interaktif yang bisa dibersihkan dengan satu sentuhan, perkenalan lima
  maskot, game memilah sampah tiga level, dan pembuat sertifikat pahlawan yang dapat diunduh
  sebagai PNG.
- **Pojok Cerita & Kreasi** — komik bercabang "Petualangan Bobi si Botol Plastik", galeri
  sulap daur ulang, fakta sampah Indonesia berangka resmi, dan artikel edukasi bersumber
  Waste4Change.
- **Tentang Geng Pilah** — cerita misi, alasan usia dini adalah masa emas pembentukan kebiasaan,
  penjelasan keputusan UX, kartu atribusi data, dan profil tim.
- **Surat Pahlawan** — papan janji pahlawan cilik (tersimpan di perangkat) dan kotak kolaborasi
  untuk sekolah/orang tua.

Fitur yang dirancang khusus untuk anak:

- **Suara Bahasa Indonesia** (Web Speech API) pada tombol "Bacakan", untuk anak yang belum
  lancar membaca.
- **Efek suara disintesis** dengan Web Audio API — tanpa file audio, tidak pernah gagal dimuat.
- **Dua cara bermain**: seret sampah ke tong, atau ketuk sampah lalu ketuk tong (ramah layar
  sentuh).
- **Salah tidak dihukum**: setiap jawaban salah memberi petunjuk, bukan hukuman.
- Semua animasi menghormati `prefers-reduced-motion`.

## Teknologi

| Bagian | Pilihan |
| --- | --- |
| Build | Vite |
| UI | React 19 + Tailwind CSS v4 |
| Animasi | CSS keyframes + IntersectionObserver (POP), scroll-drawn SVG trail, Web Audio SFX |
| Ikon & maskot | SVG buatan sendiri (tanpa aset berbayar) |
| Suara | Web Audio API + Web Speech API |
| Font | Fredoka & Nunito (Google Fonts, gratis) |

Seluruh aset gratis dan dibuat sendiri; tidak ada template atau komponen berbayar.

## Petunjuk Instalasi & Cara Menjalankan

Prasyarat: Node.js 18 atau lebih baru, dan npm.

```bash
# 1. masuk ke folder proyek
cd webdesign_gengpilah_technoversary_vol.II

# 2. pasang dependensi
npm install

# 3. jalankan mode pengembangan
npm run dev
# buka http://localhost:5173

# 4. build untuk produksi
npm run build
npm run preview
```

Tidak ada variabel lingkungan, API key, atau server backend yang dibutuhkan — seluruh data
permainan dan janji pahlawan disimpan di `localStorage` perangkat pengunjung.

## Struktur Singkat

```
src/
  App.jsx                 # rute + jalur petualangan SVG
  components/
    layout/               # navbar & footer
    home/                 # hero, taman interaktif, galeri maskot
    mascots/              # lima karakter SVG + Bumi
    game/                 # game "Kasih Makan Geng Pilah" 3 level
    certificate/          # pembuat sertifikat PNG
    story/  common/       # komponen halaman cerita & bersama
  pages/                  # Pojok Cerita, Tentang, Surat Pahlawan
  data/                   # data sampah, level, dan konten edukasi
  lib/                    # efek suara, suara Bahasa Indonesia, canvas
```

## Sumber Data & Kurikulum

Seluruh materi jenis sampah, waktu penguraian, dan angka nasional diadaptasi dari:

- **Waste4Change Indonesia** — *"Sampah: Pengertian, Jenis, Hingga Peraturannya di Indonesia"*,
  termasuk angka 68,5 juta ton sampah nasional (2022), 24,3 juta ton belum tertangani, dan
  0,7 kg sampah per orang per hari (Waste4Change mengutip Antara dan KLHK).

## Tim

Nama Tim: **[NAMA TIM]**

| Nama | Peran |
| --- | --- |
| [Nama Anggota 1] | UI/UX & Maskot Designer |
| [Nama Anggota 2] | Creative Frontend Developer |
| [Nama Anggota 3] | Game Logic & Interactive Engineer |

## Lisensi Aset

Maskot, ilustrasi, dan ikon dibuat sendiri untuk kompetisi ini. Font Fredoka & Plus Jakarta
Sans memakai lisensi SIL Open Font License. Tidak ada aset berbayar yang digunakan.
