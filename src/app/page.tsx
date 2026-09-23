import { IMAGES } from "@/lib/images";
import PersonalInforCard from "@/components/PersonalInforCard";
import MusicBarDivider from "@/components/ui/MusicBarDivider";
import ProjectGallery from "@/components/ProjectGallery";
import PressButton from "@/components/ui/PressButton";
import Section from "@/components/Section";
import Image from "next/image";
import Link from "next/dist/client/link";
import AudioVisualizer from "@/components/AudioVisualizer";
import ParticleRibbon from "@/components/ParticleRibbon";

const SKILLS = [
  { name: "TypeScript", icon: "/typescript-2.png" },
  { name: "Docker", icon: "/social.png" },
  { name: "React", icon: "/physics.png" },
  { name: "Next.js", icon: "/nextjs-13.svg" },
];

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
          {/* Left side - Profile Card */}
          <Section className="flex justify-center">
            <div className="p-8">
              <PersonalInforCard
                name="John Doe"
                email="john.doe@example.com"
                location="San Francisco, CA"
                image={IMAGES.placeholder.profile.src as any}
              />
            </div>
          </Section>
          {/* Right side - Welcome Text */}
          <Section className="flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-4">
                Welcome to My Portfolio
              </h1>
              <p className="text-xl text-[var(--text-secondary)] leading-relaxed mb-6">
                I'm a passionate developer and designer dedicated to creating
                beautiful and functional digital experiences.
              </p>
            </div>
            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4">
              <Link href="/projects">
                <PressButton variant="primary">View My Work</PressButton>
              </Link>
              <Link href="/resume">
                <PressButton variant="secondary">My Resume</PressButton>
              </Link>
              <AudioVisualizer />
            </div>
          </Section>
          {/* <ParticleRibbon className="w-full" density={1} /> */}
          {/* <Section className="col-span-full">
            <ParticleRibbon className="w-full" density={1} />
          </Section> */}

          {/* scroll down indicator */}
          <Section className="col-span-full flex flex-col justify-center items-center gap-4">
            <div className="text-center">
              <p className="animate-bounce">Scroll Down</p>
            </div>
            <div className="h-12 w-0.5 relative overflow-hidden">
              {/* The Moving Element */}
              <span className="absolute inset-0 bg-[var(--text-primary)] animate-[slide-in-out_3s_ease-out_infinite]"></span>
            </div>
          </Section>

          {/* About Me Section */}
          <Section className="w-full max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-row items-center gap-6">
              <h1 className="text-4xl font-medium whitespace-nowrap">
                ABOUT ME
              </h1>
              <MusicBarDivider />
            </div>
            <p className="text-lg mt-4 text-[var(--text-secondary)]">
              I'm a passionate developer and designer dedicated to creating
              beautiful and functional digital experiences. With a strong
              background in both development and design, I strive to bridge the
              gap between aesthetics and functionality in every project I
              undertake. My goal is to craft innovative solutions that not only
              look great but also provide seamless user experiences.
            </p>
          </Section>
          {/* <MySkills /> */}
          <Section className="w-full max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-row items-center gap-6">
              <h1 className="text-4xl font-medium whitespace-nowrap">SKILLS</h1>
              <MusicBarDivider />
            </div>
            <div>
              <p className="text-lg mt-4 text-[var(--text-secondary)]">
                I have a strong foundation in both development and design,
                allowing me to create seamless and visually appealing digital
                experiences. My skills include:
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
          </Section>
          <Section className="col-span-full">
            <ProjectGallery username="Wyden13" />
          </Section>
        </div>
      </div>
    </div>
  );
}
