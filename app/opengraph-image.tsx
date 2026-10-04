import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { fullName, profile } from "@/data/profile";
import { sections } from "@/data/site";

export const alt = `${fullName} — Player Profile`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const modes = [
  { label: sections.about.title, sport: sections.about.sport, color: "#3dff8a" },
  { label: sections.projects.title, sport: sections.projects.sport, color: "#ff8a1f" },
  { label: sections.fun.title, sport: sections.fun.sport, color: "#2ee6ff" },
  { label: sections.contact.title, sport: sections.contact.sport, color: "#ffd23f" },
];

/** Social preview card, generated at build time. */
export default async function OpengraphImage() {
  const bebas = await readFile(join(process.cwd(), "assets/fonts/BebasNeue-Regular.ttf"));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px",
        color: "#eef2ff",
        backgroundColor: "#04060d",
        backgroundImage:
          "radial-gradient(circle at 20% 0%, rgba(61,255,138,0.28), transparent 45%), radial-gradient(circle at 100% 100%, rgba(46,230,255,0.22), transparent 50%), repeating-linear-gradient(115deg, transparent 0px, transparent 60px, rgba(61,255,138,0.05) 60px, rgba(61,255,138,0.05) 120px)",
        fontFamily: "Bebas Neue",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            background: "#3dff8a",
            color: "#03170b",
            fontSize: 30,
            letterSpacing: 4,
            padding: "6px 16px",
            borderRadius: 8,
          }}
        >
          PLAYER PROFILE
        </div>
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#a9b4d6" }}>MAIN MENU · SELECT YOUR MODE</div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 150, lineHeight: 0.85 }}>{profile.firstName.toUpperCase()}</div>
          <div style={{ display: "flex", fontSize: 150, lineHeight: 0.85, color: "#3dff8a" }}>
            {profile.lastName.toUpperCase()}
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 36, letterSpacing: 3, color: "#a9b4d6" }}>
            {profile.tagline.toUpperCase()}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 210,
            height: 270,
            border: "5px solid #3dff8a",
            borderRadius: 24,
            background: "linear-gradient(160deg, #123826, #07140e)",
          }}
        >
          <div style={{ display: "flex", fontSize: 120, lineHeight: 0.9 }}>{profile.card.rating}</div>
          <div style={{ display: "flex", fontSize: 48, color: "#a9e8c4" }}>{profile.card.position}</div>
          <div style={{ display: "flex", fontSize: 40, color: "#3dff8a" }}>#{profile.jerseyNumber}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {modes.map((mode) => (
          <div
            key={mode.label}
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "14px 18px",
              borderRadius: 14,
              background: "rgba(12,19,40,0.9)",
              borderBottom: `6px solid ${mode.color}`,
            }}
          >
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 3, color: mode.color }}>{mode.sport.toUpperCase()}</div>
            <div style={{ display: "flex", fontSize: 44 }}>{mode.label.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>,
    { ...size, fonts: [{ name: "Bebas Neue", data: bebas, style: "normal", weight: 400 }] },
  );
}
