import Image, { StaticImageData } from "next/image";

export default function PersonalInforCard({
  name,
  email,
  location,
  image,
}: {
  name: string;
  email: string;
  location: string;
  image: StaticImageData;
}) {
  return (
    <div className="max-w-sm rounded-lg border-2 border-[var(--border)] bg-[var(--card-theme)] p-6">
      <div className="mb-4 w-full overflow-hidden rounded border-2 border-[var(--border)]">
        <Image
          src={image}
          alt={`${name}'s profile picture`}
          width={400}
          height={400}
          loading="eager"
          className="h-full w-full object-cover"
        />
      </div>

      <h2 className="text-xl font-bold mb-4">{name}</h2>
      <p className="text-[var(--text-muted)]">Email: {email}</p>
      <p className="text-[var(--text-muted)]">Location: {location}</p>
    </div>
  );
}
