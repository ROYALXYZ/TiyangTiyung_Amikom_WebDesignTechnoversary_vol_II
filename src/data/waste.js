// Sumber konten & data edukasi: Waste4Change Indonesia
// ("Sampah: Pengertian, Jenis, Hingga Peraturannya di Indonesia")

export const BINS = {
  organik: {
    id: 'organik',
    name: 'Si Orgi',
    bin: 'Tong Hijau',
    color: '#22C55E',
    soft: '#DCFCE7',
    emoji: '🍏',
    tagline: 'Tukang sihir kompos',
    kid:
      'Sampah alam yang mudah membusuk dan bisa jadi vitamin (kompos) untuk tanaman!',
    examples: 'Kulit buah, sisa sayur, daun kering',
    parent:
      'Sampah yang dapat terurai secara alami (degradable) melalui proses biologi, baik aerob maupun anaerob.',
  },
  anorganik: {
    id: 'anorganik',
    name: 'Si Rino',
    bin: 'Tong Kuning',
    color: '#F59E0B',
    soft: '#FEF3C7',
    emoji: '🤖',
    tagline: 'Robot daur ulang',
    kid:
      'Sampah buatan mesin yang sangat awet dan tidak bisa membusuk sendiri, tapi bisa disulap jadi barang baru!',
    examples: 'Botol plastik, kaleng minuman, gelas plastik',
    parent:
      'Sampah yang tidak membusuk (undegradable) dan membutuhkan waktu puluhan hingga ratusan tahun untuk terurai, namun bernilai daur ulang tinggi.',
  },
  b3: {
    id: 'b3',
    name: 'Si Bebe',
    bin: 'Tong Merah',
    color: '#EF4444',
    soft: '#FEE2E2',
    emoji: '⚠️',
    tagline: 'Penjaga zat berbahaya',
    kid:
      'Awas bahaya! Sampah ini punya zat beracun atau tajam. Jangan dipegang sendiri ya, minta tolong Ayah atau Ibu!',
    examples: 'Baterai bekas, lampu pecah, kaleng obat nyamuk',
    parent:
      'Sisa kegiatan yang mengandung bahan berbahaya dan/atau beracun yang dapat mencemarkan lingkungan dan membahayakan kesehatan.',
  },
  kertas: {
    id: 'kertas',
    name: 'Si Kiki',
    bin: 'Tong Biru',
    color: '#3B82F6',
    soft: '#DBEAFE',
    emoji: '📘',
    tagline: 'Kutu buku pintar',
    kid:
      'Semua sampah kertas dan kardus bersih! Bisa dibuat jadi buku gambar baru, jadi kita tidak perlu menebang pohon lagi!',
    examples: 'Kardus bekas, koran lama, kertas tulis',
    parent:
      'Dipisahkan khusus dari anorganik agar serat selulosanya tidak terkontaminasi minyak/air dan mudah masuk industri daur ulang kertas.',
  },
  residu: {
    id: 'residu',
    name: 'Si Resi',
    bin: 'Tong Abu-abu',
    color: '#64748B',
    soft: '#F1F5F9',
    emoji: '🪨',
    tagline: 'Penjaga terakhir',
    kid:
      'Sampah yang sudah kotor sekali dan tidak bisa didaur ulang lagi. Kita harus kurangi pemakaiannya ya!',
    examples: 'Tisu bekas, popok, bungkus permen',
    parent:
      'Sampah yang sangat sulit atau tidak ekonomis untuk didaur ulang sehingga berakhir di TPA (Tempat Pemrosesan Akhir).',
  },
}

export const MASCOTS = Object.values(BINS)

export const ITEMS = [
  { id: 'kulit-pisang', name: 'Kulit Pisang', emoji: '🍌', type: 'organik', fact: 'Hancur dalam 2 minggu - 1 bulan.' },
  { id: 'apel-sisa', name: 'Sisa Apel', emoji: '🍎', type: 'organik', fact: 'Hancur dalam 2 bulan.' },
  { id: 'daun-kering', name: 'Daun Kering', emoji: '🍂', type: 'organik', fact: 'Hancur dalam 2 - 4 minggu.' },
  { id: 'botol-plastik', name: 'Botol Plastik', emoji: '🥤', type: 'anorganik', fact: 'Baru hancur 450 tahun lagi!' },
  { id: 'kaleng-susu', name: 'Kaleng Susu', emoji: '🥫', type: 'anorganik', fact: 'Butuh 80 - 100 tahun untuk hancur.' },
  { id: 'gelas-plastik', name: 'Gelas Plastik', emoji: '🧋', type: 'anorganik', fact: 'Butuh 50 - 80 tahun untuk hancur.' },
  { id: 'baterai-bekas', name: 'Baterai Bekas', emoji: '🔋', type: 'b3', fact: 'Zat kimianya bisa mencemari tanah dan air.' },
  { id: 'lampu-pecah', name: 'Lampu Pecah', emoji: '💡', type: 'b3', fact: 'Pecahannya tajam dan mengandung merkuri.' },
  { id: 'obat-nyamuk', name: 'Kaleng Obat Nyamuk', emoji: '🦟', type: 'b3', fact: 'Berisi bahan kimia beracun.' },
  { id: 'kardus-bekas', name: 'Kardus Bekas', emoji: '📦', type: 'kertas', fact: 'Hancur 2 - 6 minggu, bisa jadi kertas baru.' },
  { id: 'koran-lama', name: 'Koran Lama', emoji: '📰', type: 'kertas', fact: 'Butuh 2 - 6 minggu untuk hancur.' },
  { id: 'tisu-kotor', name: 'Tisu Kotor', emoji: '🧻', type: 'residu', fact: 'Terlalu kotor untuk didaur ulang.' },
  { id: 'bungkus-permen', name: 'Bungkus Permen', emoji: '🍬', type: 'residu', fact: 'Lapisan aluminiumnya sulit didaur ulang.' },
]

export const LEVELS = [
  {
    id: 1,
    title: 'Tingkat TK',
    subtitle: 'Mudah',
    stars: '🌱',
    bins: ['organik', 'anorganik'],
    items: ['kulit-pisang', 'apel-sisa', 'daun-kering', 'botol-plastik', 'kaleng-susu', 'gelas-plastik'],
  },
  {
    id: 2,
    title: 'SD Kelas 1-3',
    subtitle: 'Sedang',
    stars: '⭐',
    bins: ['organik', 'anorganik', 'b3'],
    items: [
      'kulit-pisang', 'apel-sisa', 'daun-kering', 'botol-plastik', 'kaleng-susu', 'gelas-plastik',
      'baterai-bekas', 'lampu-pecah', 'obat-nyamuk',
    ],
  },
  {
    id: 3,
    title: 'SD Kelas 4-6',
    subtitle: 'Mahir',
    stars: '👑',
    bins: ['organik', 'anorganik', 'b3', 'kertas', 'residu'],
    items: [
      'kulit-pisang', 'apel-sisa', 'daun-kering', 'botol-plastik', 'kaleng-susu', 'gelas-plastik',
      'baterai-bekas', 'lampu-pecah', 'obat-nyamuk',
      'kardus-bekas', 'koran-lama', 'tisu-kotor', 'bungkus-permen',
    ],
  },
]

export const itemById = (id) => ITEMS.find((i) => i.id === id)
