import type { StaticImageData } from "next/image";
import { withBasePath } from "@/lib/base-path";

export interface AppImage {
  src: string | StaticImageData;
  alt: string;
  blurDataURL?: string;
}

export const IMAGES = {
  placeholder: {
    profile: {
      src: withBasePath("/ado.jpg"),
      alt: "Profile picture placeholder",
    },
  },
} as const;
