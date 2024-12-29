'use client';

import { useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { motion } from "framer-motion";
import Autoplay from 'embla-carousel-autoplay'
import React from 'react'

interface HeroCarouselProps {
  images: string[];
  title: string;
  subtitle?: string;
  description?: string;
}

export function HeroCarousel({ images, title, subtitle, description }: HeroCarouselProps) {
  const plugin = React.useMemo(
    () => Autoplay({ delay: 5000, stopOnInteraction: false }),
    []
  );

  return (
    <div className="relative h-screen">
      <Carousel 
        opts={{ loop: true, align: 'start' }}
        plugins={[plugin]}
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {images.map((image, index) => (
            <CarouselItem 
              key={index} 
              className="relative h-full"
            >
              <div className="absolute inset-0">
                <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={`Hero image ${index + 1}`}
                    fill
                    className="object-cover object-center"
                    priority={index === 0}
                    sizes="100vw"
                    quality={85}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 h-6 w-6 md:h-8 md:w-8" />
        <CarouselNext className="right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 h-6 w-6 md:h-8 md:w-8" />
      </Carousel>
      
      <motion.div 
        className="absolute inset-0 flex items-center justify-center text-center text-white p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">{title}</h1>
          {subtitle && <p className="text-2xl mb-4">{subtitle}</p>}
          {description && <p className="text-lg">{description}</p>}
        </div>
      </motion.div>
    </div>
  );
}
