"use client";

interface DownloadButtonProps {
  filename: string;
  size: string;
  version: string;
}

export default function DownloadButton({
  filename,
  size,
  version,
}: DownloadButtonProps) {
  return (
    <a
      href={`/${filename}`}
      download
      className="inline-flex items-center gap-3 bg-doom-gold hover:bg-doom-gold/90 text-doom-bg font-mono font-bold text-lg px-8 py-4 rounded-lg transition-all glow-gold hover:scale-105"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7,10 12,15 17,10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      FREE DOWNLOAD
      <span className="text-sm font-normal opacity-75">
        {size} &middot; v{version}
      </span>
    </a>
  );
}
