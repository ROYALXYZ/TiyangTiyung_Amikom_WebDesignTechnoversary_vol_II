// Selalu ter-mount. CSS yang menyembunyikan (dan meniadakan di touch/reduced).
export default function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <p className="preloader-mark">Geng Pilah</p>
    </div>
  )
}
