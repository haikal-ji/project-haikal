'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'

const PixelTransition = dynamic(() => import('@/components/PixelTransition'), {
  ssr: false,
  loading: () => (
    <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px] rounded-full overflow-hidden aspect-square">
      <Image
        src="/haikal-hero.jpg"
        alt="Muhammad Haikal"
        width={380}
        height={380}
        priority
        fetchPriority="high"
        quality={80}
        sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 380px"
        className="w-full h-full object-cover [object-position:center_58%] pointer-events-none select-none rounded-full"
      />
    </div>
  ),
})

export default function HeroAvatar() {
  return (
    <PixelTransition
      firstContent={
        <Image
          src="/haikal-hero.jpg"
          alt="Muhammad Haikal"
          width={380}
          height={380}
          priority
          fetchPriority="high"
          quality={80}
          sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 380px"
          className="w-full h-full object-cover [object-position:center_58%] pointer-events-none select-none rounded-full"
        />
      }
      secondContent={
        <div className="w-full h-full grid place-items-center bg-[#111] text-white select-none rounded-full">
          <p className="font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight select-none">
            Meow!
          </p>
        </div>
      }
      gridSize={8}
      pixelColor="#ffffff"
      once={false}
      animationStepDuration={0.4}
      className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px] rounded-full border-none cursor-pointer aspect-square"
    />
  )
}
