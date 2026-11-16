// Selalu ter-mount. CSS yang menyembunyikan (dan meniadakan di touch/reduced).
// Logo memakai path milik proyek sendiri (sama dengan Navbar) dan digambar
// lewat stroke-dashoffset; pathLength="1" supaya tidak perlu getTotalLength().
export default function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <svg
        className="preloader-logo"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          pathLength="1"
          d="M19 32C8 32 6 22 9 16c4-7 13-7 18-2 6 6 2 18-8 18Z M17 22c4-9 9-13 16-14-1 9-5 15-13 17"
        />
      </svg>
      <p className="preloader-mark">Geng Pilah</p>
    </div>
  )
}
