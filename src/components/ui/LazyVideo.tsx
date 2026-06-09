import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Video } from 'lucide-react';

interface LazyVideoProps {
  src: string;
  className?: string;
  /** How far before the viewport to start loading (CSS margin syntax) */
  rootMargin?: string;
}

/**
 * LazyVideo — only loads and plays a video when it's near the viewport.
 *
 * Strategy:
 *  1. Render a lightweight placeholder until the element is within `rootMargin`
 *     of the viewport (default 200 px ahead).
 *  2. Once intersecting, mount the <video> with `preload="metadata"` so the
 *     browser fetches just enough data to show the first frame quickly.
 *  3. Start playback once `canplay` fires (enough data buffered).
 *  4. Pause the video when it scrolls back out of view → frees bandwidth.
 */
export const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  className = '',
  rootMargin = '200px 0px',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Has the element ever entered the viewport zone?
  const [isNearViewport, setIsNearViewport] = useState(false);
  // Is the element *currently* visible?
  const [isVisible, setIsVisible] = useState(false);
  // Has enough data been buffered to play?
  const [isReady, setIsReady] = useState(false);

  /* ------------------------------------------------------------------ */
  /*  Intersection Observer                                              */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true); // triggers video mount (never resets)
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  /* ------------------------------------------------------------------ */
  /*  Play / Pause based on visibility                                   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible && isReady) {
      video.play().catch(() => {
        /* autoplay may be blocked — that's fine */
      });
    } else {
      video.pause();
    }
  }, [isVisible, isReady]);

  /* ------------------------------------------------------------------ */
  /*  Event handlers                                                     */
  /* ------------------------------------------------------------------ */
  const handleCanPlay = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Shimmer skeleton while video isn't ready */}
      {!isReady && (
        <div className="absolute inset-0 bg-secondary/50 animate-pulse flex items-center justify-center rounded-2xl overflow-hidden z-10 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 absolute inset-0" />
          <Video className="w-8 h-8 text-primary/30 animate-pulse relative z-10" />
        </div>
      )}

      {isNearViewport && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={handleCanPlay}
          className={`w-full h-auto object-cover transition-opacity duration-500 ${
            isReady ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      )}
    </div>
  );
};
