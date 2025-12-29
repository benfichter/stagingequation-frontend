"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import FullHouseLogo from "@/components/FullHouseLogo";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${
      189 + i * 6
    } -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${
      343 - i * 6
    }C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${
      875 - i * 6
    } ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
    opacity: 0.08 + i * 0.02,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-primary/60" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={Math.min(path.opacity, 0.85)}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.25, 0.6, 0.25],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths({ title = "Background Paths" }: { title?: string }) {
  const words = title.split(" ");

  return (
    <div className="relative min-h-[80vh] w-full flex items-start justify-center overflow-hidden bg-white pt-12 sm:pt-16">
      <div className="absolute inset-0 -translate-y-8">
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-white/70 to-white" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10 mt-6 sm:mt-8">
            <FullHouseLogo className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-[1.2] overflow-visible pb-6 text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-800 to-primary">
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>
          </div>

          <div className="relative inline-flex group mt-16 sm:mt-20">
            <span className="pointer-events-none absolute -inset-4 rounded-[28px] bg-primary/30 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100 group-focus-within:opacity-100" />
            <span className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/60 via-indigo-400/40 to-primary/60 opacity-0 blur-lg transition duration-500 group-hover:opacity-100 group-focus-within:opacity-100" />
            <Button
              variant="ghost"
              className="relative rounded-[1.15rem] px-9 py-6 text-lg font-semibold backdrop-blur-md bg-white/95 hover:bg-white text-neutral-900 transition-all duration-300 border border-primary/30 shadow-[0_12px_30px_rgba(95,78,255,0.2)] hover:shadow-[0_25px_70px_rgba(95,78,255,0.45)] hover:-translate-y-1"
              asChild
            >
              <a href="#auth">
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                  Start staging
                </span>
                <span className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
                  -&gt;
                </span>
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
