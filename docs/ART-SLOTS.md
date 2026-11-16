# Art slots â€” SVG drop-in

Taruh file SVG di `public/svg/art/`, lalu pasang satu baris di halaman:

```jsx
import ArtSlot from '../../lib/artSlot.jsx'
<ArtSlot name="hero-doodle" className="hero-slot" />
```

`name` = nama file tanpa `.svg`. File hilang â†’ slot hilang sendiri (`onError`),
tanpa error di konsol dan tanpa ruang kosong. Saat file muncul, slot langsung
tampil setelah reload.

## Slot yang sudah terpasang

| name           | lokasi            | CSS class    | ukuran              |
| -------------- | ----------------- | ------------ | ------------------- |
| `hero-doodle`  | kanan bawah hero  | `.hero-slot` | `clamp(56px,8vw,116px)` |

Menambah slot baru: bungkus target dengan `position: relative`, tambah class
penempatan di `src/styles/motion.css`, lalu render `<ArtSlot name="..." />`.

## Aturan file

- `viewBox` wajib ada; jangan set `width`/`height` di root SVG (slot yang atur).
- Isi dengan `currentColor` bila ingin mengikuti warna teks.
- `public/svg/art/` belum ada â€” buat saat SVG pertama dibuat.

