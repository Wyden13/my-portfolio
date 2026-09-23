import type { StaticImageData } from "next/image";

export interface AppImage {
  src: string | StaticImageData;
  alt: string;
  blurDataURL?: string;
}

export const IMAGES = {
  placeholder: {
    profile: {
      src: "/ado.jpg",
      alt: "Profile picture placeholder",
    },
  },
} as const;
