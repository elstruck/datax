'use client';

import AutoScroll from 'embla-carousel-auto-scroll';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { Heart } from "lucide-react";

const logos = [
  {
    id: "logo-1",
    description: "Logo 1",
    image: "https://www.builtwithlovellc.com/wp-content/uploads/2022/01/cropped-built-with-love-logo-5.png"
  },
  {
    id: "logo-2",
    description: "Logo 2",
    image: "https://www.shadcnblocks.com/images/block/logos/figma.svg"
  },
  {
    id: "logo-3",
    description: "Logo 3",
    image: "https://www.shadcnblocks.com/images/block/logos/nextjs.svg"
  },
  {
    id: "logo-4",
    description: "Logo 4",
    image: "https://www.shadcnblocks.com/images/block/logos/react.png"
  },
  {
    id: "logo-5",
    description: "Logo 5",
    image: "https://www.shadcnblocks.com/images/block/logos/shadcn-ui.svg"
  },
  {
    id: "logo-6",
    description: "Logo 6",
    image: "https://www.shadcnblocks.com/images/block/logos/supabase.svg"
  },
  {
    id: "logo-7",
    description: "Logo 7",
    image: "https://www.shadcnblocks.com/images/block/logos/tailwind.svg"
  },
  {
    id: "logo-8",
    description: "Logo 8",
    image: "https://www.shadcnblocks.com/images/block/logos/vercel.svg"
  }
];

const Logos3 = () => {
  return (
    <section className="py-8 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="my-6 text-pretty text-center text-2xl font-bold lg:text-4xl">
          <Heart className="inline-block w-12 h-12 text-red-500 fill-red-500" /> by these companies
        </h1>
      </div>
      <div className="pt-10 md:pt-16 lg:pt-20">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ playOnInit: true })]}
          >
            <CarouselContent className="ml-0">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="basis-1/3 pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="mx-10 flex shrink-0 items-center justify-center">
                    <div>
                      <Image
                        src={logo.image}
                        alt={logo.description}
                        width={0}
                        height={0}
                        className="w-auto h-7"
                        sizes="100vw"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Logos3;
