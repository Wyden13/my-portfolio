import MusicBarDivider from "./MusicBarDivider";
import Image from "next/image";

const SKILLS = [
  { name: "TypeScript", icon: "/typescript-2.png" },
  { name: "Docker", icon: "/social.png" },
  { name: "React", icon: "/physics.png" },
  { name: "Next.js", icon: "/nextjs-13.svg" },
  //   { name: "Tailwind CSS", icon: "/tailwind.png" },
  // Add more skills here easily:
  // { name: "React", icon: "/react.png" },
  // { name: "Next.js", icon: "/nextjs.png" },
  // { name: "Tailwind", icon: "/tailwind.png" },
];

export default function MySkills() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-row items-center gap-6">
        <h1 className="text-4xl font-medium whitespace-nowrap">SKILLS</h1>
        <MusicBarDivider />
      </div>
      <div>
        <p className="text-lg mt-4 text-[var(--text-secondary)]">
          I have a strong foundation in both development and design, allowing me
          to create seamless and visually appealing digital experiences. My
          skills include:
        </p>
        <div className="flex flex-row gap-4 mt-6 flex-wrap">
          {SKILLS.map((skill) => (
            <div
              key={skill.name}
              className="flex flex-col items-center gap-2 group"
            >
              <Image
                src={skill.icon}
                alt={skill.name}
                width={50}
                height={50}
                className="object-cover w-12 h-12 items-center transition-transform group-hover:scale-110"
              />
              <span className="text-sm text-[var(--text-secondary)] text-center">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
