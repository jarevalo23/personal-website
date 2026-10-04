import type { MetadataRoute } from "next";
import { fullName } from "@/data/profile";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: fullName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#04060d",
    theme_color: "#04060d",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
