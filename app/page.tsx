import { IntroSplash } from "@/components/menu/IntroSplash";
import { MainMenu } from "@/components/menu/MainMenu";
import { StadiumBackground } from "@/components/menu/StadiumBackground";
import { fullName } from "@/data/profile";

export default function Home() {
  return (
    <>
      <StadiumBackground />
      <IntroSplash />
      <MainMenu
        footer={
          <p>
            © {new Date().getFullYear()} {fullName}
          </p>
        }
      />
    </>
  );
}
