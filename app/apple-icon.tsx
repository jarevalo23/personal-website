import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the player crest with initials. */
export default async function AppleIcon() {
  const bebas = await readFile(join(process.cwd(), "assets/fonts/BebasNeue-Regular.ttf"));
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 0%, #123826, #04060d 70%)",
        color: "#3dff8a",
        fontFamily: "Bebas Neue",
        fontSize: 104,
        letterSpacing: 2,
      }}
    >
      {`${profile.firstName[0]}${profile.lastName[0]}`}
    </div>,
    { ...size, fonts: [{ name: "Bebas Neue", data: bebas, style: "normal", weight: 400 }] },
  );
}
