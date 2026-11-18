# Geng Pilah — Petualangan Pahlawan Cilik Penyelamat Bumi

Website edukasi lingkungan untuk anak TK & SD (5–12 tahun) yang mengajarkan cara memilah sampah
lewat permainan, cerita interaktif, dan sertifikat pahlawan. Dibuat untuk
**TECHNO VERSARY VOL. II Web Design Competition** — tema *EcoDigital For Environment*
(HIMA-TI FKOM Universitas Kuningan).

## Deskripsi Website

Geng Pilah memperkenalkan lima karakter tong sampah — **Si Orgi** (organik), **Si Rino**
(anorganik), **Si Bebe** (B3), **Si Kiki** (kertas), dan **Si Resi** (residu) — yang menemani
anak belajar memilah sampah lewat ilustrasi dan interaksi singkat.

Isi utama:

- **Beranda Petualangan** (`#/`) — infografis dengan jalur pelangi yang tergambar saat
  digulir, perkenalan lima tong yang dipilih dengan ketukan, perkiraan waktu terurai,
  jurus 3R, stasiun pemilah isometrik, game tiga level, dan pembuat sertifikat PNG.
- **Main** (`#/main`) — game memilah sampah, taman interaktif yang bisa dibersihkan,
  dan pembuat sertifikat. Sertifikat bisa dibuat tanpa menyelesaikan game.
- **Pojok Cerita & Kreasi** (`#/cerita`) — komik bercabang "Petualangan Bobi si Botol Plastik", galeri
  sulap daur ulang, serta artikel edukasi dengan rujukan Waste4Change dan aturan resmi.
- **Tentang Geng Pilah** (`#/tentang`) — cerita misi, alasan belajar sejak usia dini,
  penjelasan keputusan UX, kartu atribusi data, dan profil tim.
- **Surat Pahlawan** (`#/surat`) — papan janji pahlawan cilik (tersimpan di perangkat) dan
  formulir penyusun pesan kolaborasi untuk sekolah/orang tua. Pesan tidak otomatis terkirim.

Fitur yang dirancang khusus untuk anak:

- **Suara Bahasa Indonesia** (Web Speech API) pada tombol "Bacakan", untuk anak yang belum
  lancar membaca.
- **Efek suara disintesis** dengan Web Audio API tanpa berkas audio terpisah.
- **Dua cara bermain**: seret sampah ke tong, atau ketuk sampah lalu ketuk tong (ramah layar
  sentuh).
- **Umpan balik belajar**: jawaban salah diberi petunjuk; fakta dan rujukannya muncul
  setelah jawaban benar. Perkiraan 450 tahun untuk botol plastik bukan waktu pasti plastik hilang.
- **Akses keyboard** untuk tab tong: Tab ke tong, lalu panah kiri/kanan.
- Semua animasi menghormati `prefers-reduced-motion`.

## Teknologi

| Bagian | Pilihan |
| --- | --- |
| Build | Vite |
| UI | React 19 + Tailwind CSS v4 |
| Animasi | CSS keyframes, IntersectionObserver, jalur SVG mengikuti gulir, Lenis, Web Audio SFX |
| Ikon & maskot | SVG buatan sendiri + ikon Lucide berlisensi terbuka (tanpa aset berbayar) |
| Suara | Web Audio API + Web Speech API |
| Font | Fredoka & Nunito (SIL OFL), disajikan sendiri dari `public/fonts/` |

Maskot, ilustrasi, dan sebagian besar ikon dibuat sendiri. Ikon diagram tertentu dari Lucide; foto pendukung memakai lisensi terbuka dengan kredit di bawah.

## Petunjuk Instalasi & Cara Menjalankan

Prasyarat: Node.js 20.19+ atau 22.12+ (sesuai Vite 8), dan npm.

```bash
# 1. masuk ke folder proyek
cd TiyangTiyung_Amikom_WebDesignTechnoversary_vol_II

# 2. pasang dependensi
npm ci

# 3. jalankan mode pengembangan
npm run dev
# buka http://localhost:5173

# 4. build untuk produksi (jalankan preview setelah build)
npm run build
npm run preview
```

Pemeriksaan opsional: `npm run lint`. Untuk uji tampilan otomatis, jalankan
`npm run preview -- --host 127.0.0.1` di satu terminal, lalu
`node verify/ui-regression.mjs` di terminal lain. Skrip ini memerlukan
Microsoft Edge terpasang dan memeriksa server pada `http://127.0.0.1:4173`.

Tidak ada variabel lingkungan, API key, atau server backend yang dibutuhkan. Kemajuan
permainan dan janji pahlawan tersimpan di `localStorage` perangkat pengunjung; pesan
kolaborasi hanya disiapkan untuk disalin atau dibuka di aplikasi email. Sertifikat dibuat
dan diunduh di browser.

## Struktur Singkat

```
src/
  App.jsx                 # rute + skip link + code splitting per halaman
  components/
    layout/               # navbar & footer
    home/                 # hero, taman interaktif, peta waktu, stasiun pemilah
    mascots/              # lima karakter SVG + Bumi
    game/                 # game "Kasih Makan Geng Pilah" 3 level
    certificate/          # pembuat sertifikat PNG
    art/  common/         # komponen ilustrasi & bersama
  pages/                  # Main, Pojok Cerita, Tentang, Surat Pahlawan
  data/                   # data sampah, level, dan konten edukasi
  lib/                    # efek suara, suara Bahasa Indonesia, scroll, canvas
verify/
  ui-regression.mjs       # cek rute dan tata letak di Microsoft Edge via Playwright
```

## Sumber Data

Materi jenis sampah, waktu penguraian, dan jurus 3R diadaptasi dari Waste4Change.
Ketentuan pemilahan sampah berbahaya dirujuk ke peraturan resmi:

- **Waste4Change Indonesia** — [*Pengertian Sampah & Jenis-Jenisnya*](https://waste4change.com/blog/sampah-pengertian-jenis-hingga-peraturannya-di-indonesia), [*Membedakan Sampah Organik dan Anorganik Berdasarkan Waktu Terurai*](https://waste4change.com/blog/mengapa-sampah-organik-dan-anorganik-dibedakan-berdasarkan-waktu-terurai), dan [*Contoh Sampah Anorganik, Pengertian, Jenis dan Manfaatnya*](https://waste4change.com/blog/contoh-sampah-anorganik-pengertian-jenis-manfaat).
- **Peraturan Pemerintah No. 81 Tahun 2012 Pasal 17** — [ketentuan pemilahan, termasuk sampah berbahaya](https://peraturan.go.id/id/pp-no-81-tahun-2012).

Angka 450 tahun adalah perkiraan edukasi, bukan jaminan botol plastik akan hilang dalam waktu itu. [NOAA](https://marinedebris.noaa.gov/discover-marine-debris/mystery-how-long-until-it-s-gone) menjelaskan lamanya bergantung pada bahan dan kondisi lingkungan; plastik dapat terpecah menjadi mikroplastik. Perkiraan waktu di situs bukan hasil pengukuran tim.

Situs ini **tidak memuat angka timbulan sampah nasional** yang belum dapat kami lacak
ke sumber primer. Perkiraan waktu penguraian per benda bersifat edukatif, bukan angka
hasil pengukuran tim atau angka yang bisa diuji langsung di rumah.

## Tim

Nama Tim: **Tiyang Tiyung**

| Nama | Peran |
| --- | --- |
| Laila Septiani Hidayat | UI/UX & Maskot Designer |
| Ramadhan Hari Nugroho | Creative Frontend Developer |
| Rangga Pasha Cucu Wibisono | Game Logic & Interactive Engineer |

## Lisensi Aset

Maskot, ilustrasi, dan ikon selain yang dikreditkan di bawah dibuat sendiri untuk kompetisi ini. Font Fredoka & Nunito memakai
lisensi SIL Open Font License. Tidak ada aset berbayar yang digunakan.

- `assets/recycling-bottles.jpg`: foto **Celinebj**, *Recycling bottles.JPG*, Wikimedia Commons,
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
  [Sumber dan foto asli](https://commons.wikimedia.org/wiki/File:Recycling_bottles.JPG).
  Menampilkan botol terkumpul di Centro de Educación Ambiental Acuexcomatl,
  Xochimilco, Mexico City; bukan dokumentasi lokasi di Indonesia. Versi situs
  diunduh pada lebar 960 piksel (ubah ukuran dari foto asli); kredit juga tercantum di halaman.

- `public/svg/lucide/`: ikon **Lucide Icons and Contributors**, lisensi ISC; `arrow-right.svg`
  turunan Feather, Copyright (c) 2013-present Cole Bemis, lisensi MIT.
  Sumber: https://lucide.dev/license. Warna garis dikunci ke palet situs;
  salinan pemberitahuan lisensi: `public/svg/lucide/LICENSE.txt`.

Figure isometrik di bagian "Ke Mana Sampah Setelah Kamu Buang?" dibangun dengan
**Anatomy** (https://github.com/wheresryan22/anatomy, MIT License, Copyright (c) 2026 Ryan).
Berkas yang dipakai disalin ke `src/vendor/anatomy/` beserta salinan lisensinya; geometri
figur, tata letak, dan interaksinya ditulis sendiri di proyek ini.
