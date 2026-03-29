"use client";

import InspirationCard from "./InspirationCard";
import MusicBarDivider from "./MusicBarDivider";

export default function InspirationSection() {
  const inspirations = [
    {
      title: "Dribbble",
      description:
        "Design inspiration and portfolio showcase platform for designers and creatives.",
      url: "https://dribbble.com",
      category: "Design",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    },
    {
      title: "Behance",
      description:
        "Creative portfolio platform showcasing design, art, and digital projects.",
      url: "https://behance.net",
      category: "Portfolio",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    },
    {
      title: "GitHub Showcase",
      description:
        "Explore trending open-source projects and developer portfolios.",
      url: "https://github.com/trending",
      category: "Development",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    },
    {
      title: "Awwwards",
      description:
        "International website awards recognizing web design and development excellence.",
      url: "https://awwwards.com",
      category: "Web Design",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    },
    {
      title: "CSS-Tricks",
      description:
        "Daily articles about CSS, HTML, JavaScript, and web design techniques.",
      url: "https://css-tricks.com",
      category: "Learning",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    },
    {
      title: "Codesandbox",
      description:
        "Online IDE and code sharing platform for developers and designers.",
      url: "https://codesandbox.io",
      category: "Tools",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-row items-center gap-4 mb-8">
        <h2 className="text-4xl font-bold text-[var(--text-primary)] whitespace-nowrap">
          Inspiration
        </h2>
        <MusicBarDivider />
      </div>

      <p className="text-[var(--text-muted)] mb-8 max-w-2xl">
        Websites and resources that inspire my work and keep me updated with the
        latest trends in design and development.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inspirations.map((item, idx) => (
          <InspirationCard
            key={idx}
            title={item.title}
            description={item.description}
            url={item.url}
            category={item.category}
            image={item.image}
          />
        ))}
      </div>
    </section>
  );
}
