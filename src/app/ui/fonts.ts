import { Inter } from "next/font/google";
import {Noto_Sans} from "next/font/google";
import {Roboto_Condensed} from "next/font/google";
import { Pixelify_Sans } from "next/font/google";

export const minecraftFont = Pixelify_Sans({
    variable: "--font-minecraft",
    subsets: ["latin"],
    display: "swap",
});

export const notoSans = Noto_Sans({ 
    variable: "--font-noto-sans",
    subsets: ["latin"] 
});

export const robotoCondensed = Roboto_Condensed({
    variable: "--font-roboto-condensed",
    subsets: ["latin"]
});

export const inter = Inter({ subsets: ["latin"] });

