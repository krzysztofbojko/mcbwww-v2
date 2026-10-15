import { Brygada_1918, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

// Display serif. Italic is loaded only for the „Ryc.” figure labels.
export const fontDisplay = Brygada_1918({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-brygada",
});

// Text grotesk.
export const fontSans = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-schibsted",
});

// Data only: spec values, units, counts. Never labels or navigation.
export const fontMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const fontVariables = [fontDisplay.variable, fontSans.variable, fontMono.variable].join(" ");
