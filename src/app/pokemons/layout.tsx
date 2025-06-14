import { ReactNode } from "react";
import { SpriteProvider } from "./[gen]/sprite-provider";
import TopNav from "./_components/top-nav";

export default function Layout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <main className="font-mono container space-y-4 mx-auto p-8 px-4 lg:px-27 xl:px-56">
      <SpriteProvider>
        <TopNav />
        {children}
      </SpriteProvider>
    </main>
  );
}