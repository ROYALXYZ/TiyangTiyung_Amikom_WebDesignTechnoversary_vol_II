import KasihMakanGame from '../game/KasihMakanGame'
import HeroCertificate from '../certificate/HeroCertificate'

// Dua pita penutup Beranda: game 3 level, lalu sertifikat.
// Komponennya dipakai ulang apa adanya dari halaman #/main.
export function PitaGame() {
  return (
    <section className="band band-mint" id="main-game" aria-labelledby="game-title">
      <div className="band-in">
        <p className="eyebrow">Waktunya bermain</p>
        <h2 className="h2" id="game-title">
          Kasih Makan Geng Pilah
        </h2>
        <p className="lede">
          Tiga level, dari dua tong sampai lima tong. Pilih sampahnya, lalu cari teman yang tepat.
        </p>
        <div className="pita-game" data-pop>
          <KasihMakanGame />
        </div>
      </div>
    </section>
  )
}

export function PitaSertifikat() {
  return (
    <section className="band" id="sertifikat" aria-labelledby="sert-title">
      <div className="band-in">
        <p className="eyebrow">Misimu selesai</p>
        <h2 className="h2" id="sert-title">
          Kartu Pahlawan Bumi
        </h2>
        <p className="lede">Tulis namamu, pilih satu teman, lalu unduh kartunya.</p>
        <div className="pita-sert" data-pop>
          <HeroCertificate />
        </div>
      </div>
    </section>
  )
}
