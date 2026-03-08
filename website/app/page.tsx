import ComparisonSlider from "./components/comparison-slider";
import DownloadButton from "./components/download-button";
import StatsBar from "./components/stats-bar";
import Link from "next/link";

const GITHUB_RELEASE_URL =
  "https://github.com/m4cd4r4/freedoom-hd/releases/latest/download/freedoom-hd-textures.pk3";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e14]/90 backdrop-blur-md border-b border-[#00ff00]/10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-mono font-bold text-[#00ff00] text-lg">
            FreeDoom HD
          </span>
          <div className="flex gap-6 text-sm">
            <Link
              href="/gallery"
              className="text-gray-400 hover:text-[#00ff00] transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/install"
              className="text-gray-400 hover:text-[#00ff00] transition-colors"
            >
              Install
            </Link>
            <a
              href="https://github.com/m4cd4r4/freedoom-hd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00ff00] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="text-[#00ff00] glow-green">FreeDoom</span>{" "}
            <span className="text-[#ffb000]">HD</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Every texture, sprite, and flat from Freedoom — AI-upscaled 4x with
            Real-ESRGAN. Free. Open source. Drop it in GZDoom and play.
          </p>

          <div className="flex justify-center mb-12">
            <DownloadButton
              filename={GITHUB_RELEASE_URL}
              size="384 MB"
              version="1.0"
            />
          </div>

          {/* Hero comparison */}
          <div className="flex justify-center mb-12">
            <ComparisonSlider
              before="/previews/textures-GRNMEN-before.webp"
              after="/previews/textures-GRNMEN-after.webp"
              label="GRNMEN"
              width={512}
              height={512}
            />
          </div>

          <StatsBar />
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#00ff00]">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Extract",
                desc: "All 2,553 visual assets extracted from Freedoom WADs — 963 textures, 240 flats, 1,350 sprites.",
              },
              {
                step: "02",
                title: "Upscale",
                desc: "Each asset 4x upscaled with Real-ESRGAN (anime_6B model) on GPU. Original 64px textures become 256px.",
              },
              {
                step: "03",
                title: "Package",
                desc: "Packed into a GZDoom-compatible PK3. Drop it in your source port folder and play — zero configuration.",
              },
            ].map((item) => (
              <div key={item.step} className="glass p-6 scanline-overlay">
                <div className="text-[#ffb000] font-mono text-sm mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#00ff00]">
            Before & After
          </h2>
          <p className="text-center text-gray-400 mb-8">
            Drag the slider to compare original vs AI-upscaled.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {[
              { name: "SKINSYMB", type: "textures" },
              { name: "SWATER3", type: "flats" },
              { name: "FATTR0", type: "sprites" },
              { name: "SKY4", type: "textures" },
              { name: "FLOOR7_1", type: "flats" },
              { name: "CYBRE3E7", type: "sprites" },
            ].map((item) => (
              <ComparisonSlider
                key={`${item.type}-${item.name}`}
                before={`/previews/${item.type}-${item.name}-before.webp`}
                after={`/previews/${item.type}-${item.name}-after.webp`}
                label={`${item.name} (${item.type})`}
                width={300}
                height={300}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/gallery"
              className="text-[#ffb000] hover:text-[#ffb000]/80 font-mono transition-colors"
            >
              View full gallery &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Compatibility */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#00ff00]">
            Compatibility
          </h2>
          <div className="glass p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-mono text-[#ffb000] mb-3">Source Ports</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  {["GZDoom (recommended)", "LZDoom", "Zandronum", "Any ZDoom-based port"].map((port) => (
                    <li key={port} className="flex items-center gap-2">
                      <span className="text-[#00ff00]">&#10003;</span> {port}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-mono text-[#ffb000] mb-3">Works With</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  {["Freedoom Phase 1 & 2", "DOOM (shareware & full)", "DOOM II", "Community WADs & mods"].map((wad) => (
                    <li key={wad} className="flex items-center gap-2">
                      <span className="text-[#00ff00]">&#10003;</span> {wad}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#00ff00]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div>
            Built with{" "}
            <a
              href="https://github.com/xinntao/Real-ESRGAN"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00ff00]/60 hover:text-[#00ff00]"
            >
              Real-ESRGAN
            </a>{" "}
            &middot; Assets from{" "}
            <a
              href="https://freedoom.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00ff00]/60 hover:text-[#00ff00]"
            >
              Freedoom
            </a>{" "}
            (BSD licensed)
          </div>
          <div className="font-mono text-[#00ff00]/40">
            FreeDoom HD &middot; Open Source
          </div>
        </div>
      </footer>
    </main>
  );
}
