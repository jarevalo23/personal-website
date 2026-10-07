import { GameBackground } from "@/components/GameBackground";
import { IntroSplash } from "@/components/menu/IntroSplash";
import { MainMenu } from "@/components/menu/MainMenu";

export default function Home() {
  return (
    <>
      <GameBackground />
      <IntroSplash />
      <MainMenu />
    </>
  );
}
