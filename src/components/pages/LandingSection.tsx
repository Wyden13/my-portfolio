import { IMAGES } from "@/lib/images";
import PersonalInforCard from "../PersonalInforCard";
import MusicBarDivider from "../MusicBarDivider";
import AboutMe from "../AboutMe";
import ProjectGallery from "../ProjectGallery";
import MySkills from "../MySkills";

export default function LandingSection() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
          {/* Left side - Profile Card */}
          <div className="flex justify-center">
            <div className="p-8">
              <PersonalInforCard
                name="John Doe"
                email="john.doe@example.com"
                location="San Francisco, CA"
                image={IMAGES.placeholder.profile.src as any}
              />
            </div>
          </div>

          {/* Right side - Welcome Text */}
          <div className="flex flex-col justify-center space-y-6">
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
              <button className="px-8 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                View My Work
              </button>
              <button className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                Contact Me
              </button>
            </div>
          </div>

          <div className="col-span-full flex justify-center">
            <p className="animate-bounce">Scroll Down</p>
          </div>
          <div className="col-span-full flex justify-center">
            <span className="animate-[slide-in-out_3s_ease-out_infinite] bg-[var(--text-primary)] h-12 w-0.5 block"></span>
          </div>
          <AboutMe />
          <MySkills />
          <div className="col-span-full">
            <ProjectGallery username="Wyden13" />
          </div>
        </div>
      </div>
    </div>
  );
}
