import { ReactNode } from "react";
import { SpriteProvider } from "./sprite-provider";
import { DetailsMobileViewProvider } from "./details-mobile-view-provider";
import TopNav from "./_components/top-nav";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="font-mono container mx-auto p-8 px-4 lg:px-27 xl:px-56">
      <DetailsMobileViewProvider>
        <SpriteProvider>
          <TopNav />
          {children}
        </SpriteProvider>
      </DetailsMobileViewProvider>
      <Toaster />
    </main>
  );
}
