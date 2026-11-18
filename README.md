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

- **Beranda Petualangan** — taman interaktif yang bisa dibersihkan dengan satu sentuhan,
  perkenalan lima maskot tong sampah, peta waktu penguraian sampah, jurus 3R,
  stasiun pemilah isometrik, game memilah sampah tiga level, dan pembuat sertifikat
  pahlawan yang dapat diunduh sebagai PNG.
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
| Animasi | CSS keyframes + IntersectionObserver (POP), scroll-pin (`--progress` dari satu rAF loop Lenis), Web Audio SFX |
| Ikon & maskot | SVG buatan sendiri + ikon Lucide berlisensi terbuka (tanpa aset berbayar) |
| Suara | Web Audio API + Web Speech API |
| Font | Fredoka & Nunito (SIL OFL), disajikan sendiri dari `public/fonts/` |

Maskot, ilustrasi, dan sebagian besar ikon dibuat sendiri. Ikon diagram tertentu dari Lucide; foto pendukung memakai lisensi terbuka dengan kredit di bawah.

## Petunjuk Instalasi & Cara Menjalankan

Prasyarat: Node.js 18 atau lebih baru, dan npm.

```bash
# 1. masuk ke folder proyek
cd webdesign_tiyangtiyung_technoversary_vol.II

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
```

## Sumber Data

Materi jenis sampah, waktu penguraian, dan jurus 3R diadaptasi dari:

- **Waste4Change Indonesia** — [*Pengertian Sampah & Jenis-Jenisnya*](https://waste4change.com/blog/sampah-pengertian-jenis-hingga-peraturannya-di-indonesia), [*Membedakan Sampah Organik dan Anorganik Berdasarkan Waktu Terurai*](https://waste4change.com/blog/mengapa-sampah-organik-dan-anorganik-dibedakan-berdasarkan-waktu-terurai), dan [*Contoh Sampah Anorganik, Pengertian, Jenis dan Manfaatnya*](https://waste4change.com/blog/contoh-sampah-anorganik-pengertian-jenis-manfaat).

Angka 450 tahun adalah perkiraan edukasi, bukan jaminan botol plastik akan hilang dalam waktu itu. [NOAA](https://marinedebris.noaa.gov/discover-marine-debris/mystery-how-long-until-it-s-gone) menjelaskan lamanya bergantung pada bahan dan kondisi lingkungan; plastik dapat terpecah menjadi mikroplastik. Perkiraan waktu di situs bukan hasil pengukuran tim.

Situs ini **tidak memuat angka nasional apa pun**. Angka timbulan sampah Indonesia yang beredar
luas tidak dapat kami lacak ke sumber primer, jadi kami memilih tidak menampilkannya daripada
menampilkan angka yang tidak bisa kami pertanggungjawabkan. Yang kami tampilkan hanya waktu
penguraian per jenis benda sebagai perkiraan edukasi, bukan angka yang bisa diuji langsung di rumah.

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
