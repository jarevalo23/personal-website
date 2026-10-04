import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { Hud } from "@/components/Hud";
import { Providers } from "@/components/providers/Providers";
import { fullName } from "@/data/profile";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const display = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: `%s · ${fullName}` },
  description: site.description,
  applicationName: fullName,
  authors: [{ name: fullName }],
  creator: fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: fullName,
    title: site.title,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#04060d",
  colorScheme: "dark",
};

/*
 * Runs before first paint: skip the intro splash if it was already shown this
 * session, if the visitor landed on a sub-page, or if they prefer reduced motion.
 */
const introScript = `try{var s=sessionStorage,h=document.documentElement;if(s.getItem("intro-seen")||location.pathname!=="/"||matchMedia("(prefers-reduced-motion: reduce)").matches)h.setAttribute("data-intro-skip","");s.setItem("intro-seen","1")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-2 z-[200] rounded-md bg-fog px-4 py-2 font-semibold text-ink-950"
        >
          Skip to content
        </a>
        <Providers>
          <Hud />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
