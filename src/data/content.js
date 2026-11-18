// Konten naratif & interaktif (halaman Pojok Cerita, Tentang, Surat Pahlawan).
// Adaptasi bahasa anak dari materi Waste4Change Indonesia.

export const PARK_TRASH = [
  { id: 'p-kulit', emoji: '🍌', name: 'Kulit pisang', type: 'organik', x: 18, y: 72 },
  { id: 'p-botol', emoji: '🥤', name: 'Botol plastik', type: 'anorganik', x: 44, y: 80 },
  { id: 'p-kardus', emoji: '📦', name: 'Kardus', type: 'kertas', x: 66, y: 74 },
  { id: 'p-koran', emoji: '📰', name: 'Koran', type: 'kertas', x: 30, y: 86 },
  { id: 'p-kaleng', emoji: '🥫', name: 'Kaleng', type: 'anorganik', x: 78, y: 84 },
  { id: 'p-tisu', emoji: '🧻', name: 'Tisu kotor', type: 'residu', x: 56, y: 90 },
]

export const THREE_R = [
  {
    id: 'reduce',
    title: 'Kurangi',
    en: 'Reduce',
    emoji: '🥤',
    kid: 'Bawa botol minum dan kotak bekal sendiri ke sekolah, jadi tidak perlu beli kemasan baru.',
    color: '#22C55E',
  },
  {
    id: 'reuse',
    title: 'Pakai Lagi',
    en: 'Reuse',
    emoji: '🛍️',
    kid: 'Pakai lagi kantong belanja dan toples bekas di rumah. Barang lama bisa jadi teman baru!',
    color: '#F59E0B',
  },
  {
    id: 'recycle',
    title: 'Daur Ulang',
    en: 'Recycle',
    emoji: '♻️',
    kid: 'Pilah sampahmu bersama Geng Pilah supaya bisa disulap jadi barang baru yang keren.',
    color: '#3B82F6',
  },
]

// Komik bercabang: "Petualangan Bobi si Botol Plastik"
export const COMIC = {
  title: 'Petualangan Bobi si Botol Plastik',
  intro:
    'Hari itu Rio selesai minum air. Bobi si botol plastik kini kosong. Rio harus memilih: ke mana Bobi pergi?',
  panels: [
    {
      id: 'start',
      text: 'Bobi kosong dan menatap Rio. "Aku sudah selesai tugasku," kata Bobi pelan. Rio menggaruk kepala.',
      choices: [
        { label: 'Buang Bobi ke sungai', next: 'sungai' },
        { label: 'Masukkan Bobi ke perut Si Rino', next: 'riono' },
      ],
    },
    {
      id: 'sungai',
      text: 'Bobi meluncur ke sungai. Arus membawanya jauh ke laut. Ikan-ikan kecil mengira Bobi makanan, lalu tersangkut. Laut jadi sedih dan penuh sampah plastik.',
      mood: 'sad',
      choices: [{ label: '⏪ Putar Balik Waktu!', next: 'start' }],
    },
    {
      id: 'riono',
      text: 'Si Rino menelan Bobi dengan riang. Di pabrik daur ulang, Bobi dicuci, dilelehkan, dan dicetak ulang. Beberapa minggu kemudian, Bobi kembali sebagai tas sekolah baru untuk Rio!',
      mood: 'happy',
      choices: [{ label: '🔁 Coba jalan cerita lain', next: 'start' }],
    },
  ],
  moral:
    'Satu botol plastik bisa mencemari laut selama ratusan tahun, atau berubah jadi barang baru kalau kita pilah dengan benar.',
}

export const PLEDGES = [
  'Aku janji selalu menghabiskan makananku.',
  'Aku janji membawa botol minum sendiri ke sekolah.',
  'Aku janji memilah sampah di rumah.',
  'Aku janji tidak membuang sampah ke sungai.',
  'Aku janji membawa tas belanja sendiri.',
  'Aku janji mengajak temanku memilah sampah.',
]

export const STICKERS = ['🍏', '🤖', '⚠️', '📘', '🪨']

export const ABOUT = {
  mission: [
    'Geng Pilah lahir dari satu pertanyaan sederhana: kenapa anak-anak diajari membaca dan berhitung, tapi jarang diajari ke mana sampahnya pergi?',
    'Lima sahabat — Orgi, Rino, Bebe, Kiki, dan Resi — datang untuk menemani anak-anak mengenal sampah dengan cara yang menyenangkan: bermain, bercerita, dan mencoba sendiri.',
  ],
  goldenAge:
    'Anak TK dan SD bisa mulai belajar memilah lewat contoh dan latihan bersama orang dewasa. Geng Pilah membantu mereka mencoba, bukan menjanjikan kebiasaan akan menetap selamanya.',
  uxNotes: [
    'Warna cerah dan bentuk besar membantu anak mengenali tong sampah tanpa harus membaca.',
    'Tombol "Bacakan" memakai suara Bahasa Indonesia untuk anak yang belum lancar membaca.',
    'Setiap jawaban salah diberi petunjuk, bukan hukuman — anak belajar tanpa takut.',
    'Semua permainan bisa dimainkan dengan satu jari, karena banyak anak memakai ponsel orang tua.',
  ],
  attribution: {
    source: 'Waste4Change Indonesia',
    article: 'Pengertian Sampah & Jenis-Jenisnya',
    articleUrl: 'https://waste4change.com/blog/sampah-pengertian-jenis-hingga-peraturannya-di-indonesia',
    timeArticle: 'Membedakan Sampah Organik dan Anorganik Berdasarkan Waktu Terurai',
    timeUrl: 'https://waste4change.com/blog/mengapa-sampah-organik-dan-anorganik-dibedakan-berdasarkan-waktu-terurai',
    noaaUrl: 'https://marinedebris.noaa.gov/discover-marine-debris/mystery-how-long-until-it-s-gone',
    note: 'Materi jenis sampah dan perkiraan waktu terurai diadaptasi dari artikel Waste4Change. Waktu terurai bergantung pada bahan dan lingkungan; plastik dapat pecah menjadi mikroplastik, bukan hilang sepenuhnya (NOAA).',
  },
  // Peraturan yang mengikat pengelolaan sampah di Indonesia (mode orang tua & guru).
  regulasi: [
    {
      id: 'uu-18-2008',
      nama: 'UU No. 18 Tahun 2008',
      tentang: 'Pengelolaan Sampah',
      isi: 'Pengelolaan sampah dibagi menjadi dua kegiatan: pengurangan sampah (pembatasan timbulan, pendauran ulang, pemanfaatan kembali — 3R) dan penanganan sampah (pemilahan, pengumpulan, pengangkutan, pengolahan, pemrosesan akhir).',
    },
    {
      id: 'pp-81-2012',
      nama: 'PP No. 81 Tahun 2012',
      tentang: 'Pengelolaan Sampah Rumah Tangga dan Sampah Sejenis Sampah Rumah Tangga',
      isi: 'Mewajibkan produsen dan masyarakat memilah sampah sejak dari sumbernya, sebelum sampah diangkut dan diolah.',
    },
    {
      id: 'perpres-97-2017',
      nama: 'Perpres No. 97 Tahun 2017',
      tentang: 'Jakstranas — Kebijakan dan Strategi Nasional Pengelolaan Sampah',
      isi: 'Menargetkan pengurangan sampah 30% dan penanganan sampah 70% pada 2025.',
    },
  ],
  team: [
    { name: 'Laila Septiani Hidayat', role: 'UI/UX & Maskot Designer', emoji: '🎨' },
    { name: 'Ramadhan Hari Nugroho', role: 'Creative Frontend Developer', emoji: '💻' },
    { name: 'Rangga Pasha Cucu Wibisono', role: 'Game Logic & Interactive Engineer', emoji: '🎮' },
  ],
}

export const UPCYCLE = [
  {
    id: 'celengan',
    title: 'Celengan Roket',
    from: 'Botol plastik',
    emoji: '🚀',
    steps: ['Potong botol jadi dua bagian.', 'Tempel kertas warna sebagai ekor roket.', 'Buat celah koin di bagian atas.', 'Hias dengan spidol.'],
  },
  {
    id: 'pot-kucing',
    title: 'Pot Kucing',
    from: 'Kaleng susu',
    emoji: '🐱',
    steps: ['Bersihkan kaleng dan keringkan.', 'Tempel telinga dari karton.', 'Gambar wajah kucing.', 'Tanam bibit kecil di dalamnya.'],
  },
  {
    id: 'kompos',
    title: 'Kompos Mini',
    from: 'Sisa sayur & daun',
    emoji: '🌱',
    steps: ['Siapkan wadah berlubang.', 'Susun daun kering dan sisa sayur bergantian.', 'Tutup dan simpan di tempat teduh.', 'Aduk tiap minggu, tunggu 4-6 minggu.'],
  },
]
