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
    <div className="bg-var(--card-theme) rounded-lg p-6 max-w-sm border-black border-2">
      <div className="w-full border-2 border-var(--card-theme) mb-4">
        <Image
          src={image}
          alt={`${name}'s profile picture`}
          width={400}
          height={400}
          loading="eager"
        />
      </div>

      <h2 className="text-xl font-bold mb-4">{name}</h2>
      <p className="text-var(--text-muted)">Email: {email}</p>
      <p className="text-var(--text-muted)">Location: {location}</p>
    </div>
  );
}
