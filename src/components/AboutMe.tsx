import MusicBarDivider from "./MusicBarDivider";
export default function AboutMe() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-row items-center gap-6">
        <h1 className="text-4xl font-medium whitespace-nowrap">ABOUT ME</h1>
        <MusicBarDivider />
      </div>
      <p className="text-lg mt-4 text-[var(--text-secondary)]">
        I'm a passionate developer and designer dedicated to creating beautiful
        and functional digital experiences. With a strong background in both
        development and design, I strive to bridge the gap between aesthetics
        and functionality in every project I undertake. My goal is to craft
        innovative solutions that not only look great but also provide seamless
        user experiences.
      </p>
    </div>
  );
}
