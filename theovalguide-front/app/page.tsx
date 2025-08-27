import PreauthNav from "@/components/mine/preauth-nav";
import Search from "@/components/mine/search";
import LogoWordmark from "@/components/brand/LogoWordmark";

export default function Home() {
  return (
    <div className="min-h-[100svh] flex flex-col bg-background">
      <header
        className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{ paddingTop: "max(env(safe-area-inset-top), 0px)" }}
      >
        <div className="mx-auto w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-7xl flex justify-end">
          <PreauthNav />
        </div>
      </header>

      <main className="flex-1 px-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <div className="mt-[8svh] sm:mt-[10svh] w-full flex flex-col items-center gap-6 sm:gap-8">
            <LogoWordmark className="select-none" />
            <div className="w-full max-w-[680px] sm:max-w-2xl lg:max-w-3xl">
              <Search />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
