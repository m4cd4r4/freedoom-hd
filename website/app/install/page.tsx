import Link from "next/link";

export const metadata = {
  title: "Install Guide — FreeDoom HD",
  description: "How to install FreeDoom HD texture pack in GZDoom, LZDoom, and Zandronum.",
};

export default function InstallPage() {
  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-[#00ff00] font-mono transition-colors"
        >
          &larr; Back
        </Link>

        <h1 className="text-4xl font-bold mt-4 mb-8 text-[#00ff00] glow-green">
          Installation Guide
        </h1>

        {/* Prerequisites */}
        <section className="glass p-6 mb-8">
          <h2 className="text-xl font-bold text-[#ffb000] font-mono mb-4">
            Prerequisites
          </h2>
          <ol className="space-y-3 text-gray-300 list-decimal list-inside">
            <li>
              Download{" "}
              <a
                href="https://zdoom.org/downloads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ff00] hover:underline"
              >
                GZDoom
              </a>{" "}
              (or another ZDoom-based source port)
            </li>
            <li>
              Download{" "}
              <a
                href="https://freedoom.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ff00] hover:underline"
              >
                Freedoom
              </a>{" "}
              WADs (freedoom1.wad and/or freedoom2.wad)
            </li>
            <li>
              Download the{" "}
              <a
                href="https://github.com/m4cd4r4/freedoom-hd/releases/latest/download/freedoom-hd-textures.pk3"
                className="text-[#00ff00] hover:underline font-bold"
              >
                FreeDoom HD texture pack
              </a>
            </li>
          </ol>
        </section>

        {/* GZDoom */}
        <section className="glass p-6 mb-8">
          <h2 className="text-xl font-bold text-[#ffb000] font-mono mb-4">
            GZDoom (Recommended)
          </h2>

          <h3 className="text-white font-mono text-sm mb-2 mt-4">
            Option A: Drag & Drop
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Drag <code className="text-[#00ff00] bg-[#111820] px-1 rounded">freedoom-hd-textures.pk3</code>{" "}
            onto <code className="text-[#00ff00] bg-[#111820] px-1 rounded">gzdoom.exe</code>.
            GZDoom will prompt you to select a WAD — choose your Freedoom WAD.
          </p>

          <h3 className="text-white font-mono text-sm mb-2">
            Option B: Command Line
          </h3>
          <pre className="bg-[#111820] rounded-lg p-4 text-sm text-[#00ff00] overflow-x-auto mb-4">
            <code>gzdoom -iwad freedoom2.wad -file freedoom-hd-textures.pk3</code>
          </pre>

          <h3 className="text-white font-mono text-sm mb-2">
            Option C: Auto-load (Permanent)
          </h3>
          <ol className="space-y-2 text-gray-400 text-sm list-decimal list-inside">
            <li>
              Place <code className="text-[#00ff00] bg-[#111820] px-1 rounded">freedoom-hd-textures.pk3</code>{" "}
              in your GZDoom folder
            </li>
            <li>Open GZDoom, go to <strong>Options &gt; Miscellaneous Options</strong></li>
            <li>Find <strong>Autoload</strong> and add the PK3 file</li>
            <li>The texture pack will load automatically every time</li>
          </ol>
        </section>

        {/* LZDoom */}
        <section className="glass p-6 mb-8">
          <h2 className="text-xl font-bold text-[#ffb000] font-mono mb-4">
            LZDoom
          </h2>
          <p className="text-gray-400 text-sm mb-2">
            Same as GZDoom — drag & drop or command line:
          </p>
          <pre className="bg-[#111820] rounded-lg p-4 text-sm text-[#00ff00] overflow-x-auto">
            <code>lzdoom -iwad freedoom2.wad -file freedoom-hd-textures.pk3</code>
          </pre>
        </section>

        {/* Zandronum */}
        <section className="glass p-6 mb-8">
          <h2 className="text-xl font-bold text-[#ffb000] font-mono mb-4">
            Zandronum
          </h2>
          <p className="text-gray-400 text-sm mb-2">
            Use Doomseeker or the command line:
          </p>
          <pre className="bg-[#111820] rounded-lg p-4 text-sm text-[#00ff00] overflow-x-auto">
            <code>zandronum -iwad freedoom2.wad -file freedoom-hd-textures.pk3</code>
          </pre>
        </section>

        {/* FAQ */}
        <section className="glass p-6">
          <h2 className="text-xl font-bold text-[#ffb000] font-mono mb-4">
            FAQ
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-bold text-sm">
                Will this work with original DOOM WADs?
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Yes. Freedoom uses the same lump names as DOOM/DOOM II, so the
                hi-res textures will also replace textures in the original games.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">
                Does it affect performance?
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Minimally. Modern GPUs handle 256x256 textures easily. You may
                notice slightly higher VRAM usage but framerate should be unaffected.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">
                Can I use this with other mods?
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Yes. Load FreeDoom HD first, then your other mods. The texture
                pack only replaces vanilla textures — any mod-specific textures
                will override it.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">
                What AI model was used?
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Real-ESRGAN x4plus anime_6B — a model trained for stylized and
                illustrated content. It preserves the artistic style of the
                original textures while adding detail.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
