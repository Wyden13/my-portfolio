import PressButton from "@/components/ui/PressButton";

export default function Resume() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 text-right">
      <a href="/resume.pdf" download className="mb-4 inline-block">
        <PressButton variant="primary">Download Resume</PressButton>
      </a>
      <iframe
        src="/Technical_resume.pdf"
        title="Resume"
        width="100%"
        height="800px"
      />
    </div>
  );
}
