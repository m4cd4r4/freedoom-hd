"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

interface ComparisonSliderProps {
  before: string;
  after: string;
  label: string;
  width?: number;
  height?: number;
}

export default function ComparisonSlider({
  before,
  after,
  label,
  width = 512,
  height = 512,
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border border-doom-green/20 cursor-ew-resize select-none"
        style={{ width, height }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* After (full, behind) */}
        <Image
          src={after}
          alt={`${label} - AI upscaled`}
          width={width}
          height={height}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          unoptimized
        />

        {/* Before (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <Image
            src={before}
            alt={`${label} - original`}
            width={width}
            height={height}
            className="w-full h-full object-cover"
            style={{ width, height }}
            draggable={false}
            unoptimized
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-doom-gold z-10"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-doom-gold flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-doom-bg"
            >
              <path
                d="M5 3L2 8L5 13M11 3L14 8L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-xs font-mono text-doom-red z-10">
          ORIGINAL
        </div>
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded text-xs font-mono text-doom-green z-10">
          AI 4x
        </div>
      </div>
      <span className="text-xs font-mono text-doom-green/60">{label}</span>
    </div>
  );
}
