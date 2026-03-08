import ComparisonSlider from "../components/comparison-slider";
import Link from "next/link";
import manifest from "./manifest";

export const metadata = {
  title: "Gallery — FreeDoom HD",
  description: "Before and after comparison of all AI-upscaled Freedoom textures, flats, and sprites.",
};

export default function GalleryPage() {
  const textures = manifest.filter((m) => m.type === "textures");
  const flats = manifest.filter((m) => m.type === "flats");
  const sprites = manifest.filter((m) => m.type === "sprites");

  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back nav */}
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-[#00ff00] font-mono transition-colors"
        >
          &larr; Back
        </Link>

        <h1 className="text-4xl font-bold mt-4 mb-2 text-[#00ff00] glow-green">
          Gallery
        </h1>
        <p className="text-gray-400 mb-12">
          Drag the slider on each image to compare original vs AI-upscaled.
        </p>

        {/* Textures */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[#ffb000] font-mono">
            Wall Textures
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {textures.map((item) => (
              <ComparisonSlider
                key={item.name}
                before={`/previews/${item.before}`}
                after={`/previews/${item.after}`}
                label={item.name}
                width={300}
                height={300}
              />
            ))}
          </div>
        </section>

        {/* Flats */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[#ffb000] font-mono">
            Floor & Ceiling Flats
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {flats.map((item) => (
              <ComparisonSlider
                key={item.name}
                before={`/previews/${item.before}`}
                after={`/previews/${item.after}`}
                label={item.name}
                width={300}
                height={300}
              />
            ))}
          </div>
        </section>

        {/* Sprites */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[#ffb000] font-mono">
            Sprites
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {sprites.map((item) => (
              <ComparisonSlider
                key={item.name}
                before={`/previews/${item.before}`}
                after={`/previews/${item.after}`}
                label={item.name}
                width={300}
                height={300}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
