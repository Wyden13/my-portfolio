import PressButton from "@/components/ui/PressButton";
import { withBasePath } from "@/lib/base-path";

export default function Resume() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 text-right">
      <a href={withBasePath("/Technical_resume.pdf")} download className="mb-4 inline-block">
        <PressButton variant="primary">Download Resume</PressButton>
      </a>
      <iframe
        src={withBasePath("/Technical_resume.pdf")}
        title="Resume"
        width="100%"
        height="800px"
      />
    </div>
  );
}
