import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Haikal',
  description: 'Tentang Haikal dan proses belajar yang sedang dijalani',
}

export default function AboutPage() {
  return (
    <main className="reference-page about-reference-page mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
        {/* Kolom kiri: headline besar + cerita */}
        <div>
          <h1 className="font-serif text-5xl leading-[1.1] md:text-6xl">
          About me and the process I am currently going through.
          </h1>

          <p className="mt-10 max-w-[50ch] leading-relaxed text-foreground/80">
            Saya adalah Muh. Haikal, seorang pelajar yang tertarik pada desain visual dan pengembangan website.
            Saat ini saya sedang menjalani PKL dan mempelajari pengembangan web, desain UI/UX, serta cara mengelola database.
            Saya menikmati proses membuat sesuatu dari nol, mulai dari menemukan ide, merancang tampilan, sampai mengembangkan fitur.
            Website ini dibuat sebagai personal project sekaligus project akhir PKL. Di dalamnya terdapat beberapa karya
            dan proses belajar yang sedang saya dokumentasikan.
          </p>
        </div>

        {/* Kolom kanan: foto potret besar */}
        <div className="overflow-hidden bg-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/whatsapp.jpeg"
            alt="Tentang Haikal"
            className="w-full object-cover [object-position:center_20%] grayscale transition duration-500 hover:grayscale-0"
          />
        </div>
      </div>

      {/* Fokus / values, 3 blok */}
      <div className="mt-20 grid gap-10 border-t border-line pt-16 md:grid-cols-3">
        <div>
          <h3 className="mb-3 font-serif text-xl">Cara kerja</h3>
          <p className="leading-relaxed text-foreground/70">
            Saya mengerjakan project secara bertahap, mulai dari memahami kebutuhan, menyusun struktur,
            merancang tampilan, lalu mengembangkan dan menguji setiap fitur.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-serif text-xl">Yang sedang dipelajari</h3>
          <p className="leading-relaxed text-foreground/70">
            Saat ini saya sedang fokus mengembangkan kemampuan dalam pengembangan website, desain UI/UX,
            serta database dan autentikasi.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-serif text-xl">Teknologi & Tools</h3>
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Prisma ORM', 'Supabase', 'PostgreSQL', 'Figma', 'Git'].map((tool) => (
              <span
                key={tool}
                className="rounded-sm border border-line bg-background/60 px-2.5 py-1 font-medium text-foreground/80"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
