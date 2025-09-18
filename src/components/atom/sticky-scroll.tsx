"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface StickyScrollProps {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}

export const StickyScroll = ({ content, contentClassName }: StickyScrollProps) => {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const cardLength = content.length;

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const cardsBreakpoints = content.map((_, index) => index / cardLength);
      const active = cardsBreakpoints.findIndex((breakpoint) => breakpoint > latest) - 1;
      setActiveCard(active >= 0 ? active : cardLength - 1);
    });

    return () => unsubscribe();
  }, [scrollYProgress, cardLength, content.length]);

  const backgroundColors = [
    "from-red-500/20 to-orange-500/20",
    "from-orange-500/20 to-yellow-500/20",
    "from-yellow-500/20 to-green-500/20",
    "from-green-500/20 to-blue-500/20",
    "from-blue-500/20 to-purple-500/20",
    "from-purple-500/20 to-pink-500/20",
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden rounded-md bg-neutral-950 antialiased"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          <div className="flex h-[60vh] w-full items-center justify-center">
            <div className="relative h-full w-full overflow-hidden rounded-md">
              <motion.div
                className="sticky top-0 flex h-full w-full items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom, ${backgroundColors[activeCard % backgroundColors.length]})`,
                }}
              >
                <div className="relative z-10 text-center">
                  <h2 className="text-4xl font-bold text-white md:text-6xl">
                    {content[activeCard]?.title}
                  </h2>
                  <p className="mt-4 text-lg text-neutral-300 md:text-xl">
                    {content[activeCard]?.description}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="flex h-[60vh] w-full items-center justify-center">
            <div className="w-full max-w-md">
              {content[activeCard]?.content && (
                <div className={contentClassName}>
                  {content[activeCard].content}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
