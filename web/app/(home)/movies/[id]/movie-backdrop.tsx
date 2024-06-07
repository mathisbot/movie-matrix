'use client'

import { useEffect } from 'react';

export default function Backdrop({ backdropUrl, children }: { backdropUrl: string | undefined, children?: React.ReactNode }) {
  const scrollFactor = 0.65;
  const scrollOffset = -35;

    useEffect(() => {
        const handleScroll = () => {
          const parallax = document.getElementById("parallax");
          if (parallax) {
            const scrolled = window.scrollY;
            parallax.style.transform = `translateY(${scrolled * scrollFactor + scrollOffset}px)`;
          }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, [scrollFactor, scrollOffset]);

    return (
        <div
            id="parallax"
            className="absolute top-0 left-0 w-full h-full"
            style={
                backdropUrl
                    ? {
                          backgroundImage: `url(${backdropUrl})`,
                          backgroundSize: "cover",
                          backgroundAttachment: "fixed",
                      }
                    : {}
            }
        >
            {children}
        </div>
    );
}