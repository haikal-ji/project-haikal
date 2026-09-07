export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
        {/* Kolom kiri: headline besar + cerita */}
        <div>
          {/* TODO: ganti dengan headline besar tentang dirimu, 3-4 baris seperti judul artikel */}
          <h1 className="font-serif text-5xl leading-[1.1] md:text-6xl">
            Cerita di Balik Setiap Baris Kode
          </h1>

          {/* TODO: ganti dengan cerita 3-5 kalimat: latar belakang, kenapa tertarik web dev, apa yang lagi dipelajari */}
          <p className="mt-10 max-w-[50ch] leading-relaxed text-foreground/80">
            Tulis cerita singkat di sini — latar belakang kamu, kenapa tertarik dengan web
            development, dan apa yang sedang kamu pelajari sekarang. Bisa juga cerita soal
            perjalanan PKL ini dan apa yang paling berkesan.
          </p>
        </div>

        {/* Kolom kanan: foto potret besar */}
        <div className="overflow-hidden bg-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about.jpg"
            alt="Tentang Haikal"
            className="w-full object-cover grayscale transition duration-500 hover:grayscale-0"
          />
        </div>
      </div>

      {/* Fokus / values, 2 blok singkat */}
      <div className="mt-20 grid gap-10 border-t border-line pt-16 md:grid-cols-2">
        <div>
          <h3 className="mb-3 font-serif text-xl">Cara kerja</h3>
          {/* TODO: ganti dengan cara/prinsip kamu ngoding, misal soal detail, testing, dsb */}
          <p className="leading-relaxed text-foreground/70">
            Tulis singkat tentang bagaimana kamu biasa mengerjakan sebuah project — misalnya mulai
            dari riset kebutuhan, susun struktur dulu, baru masuk ke detail.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-serif text-xl">Yang sedang dipelajari</h3>
          {/* TODO: ganti dengan skill/teknologi yang lagi kamu dalami */}
          <p className="leading-relaxed text-foreground/70">
            Tulis singkat tentang teknologi atau skill yang sedang kamu pelajari sekarang, misalnya
            Next.js, database, atau desain UI/UX.
          </p>
        </div>
      </div>
    </div>
  )
}
