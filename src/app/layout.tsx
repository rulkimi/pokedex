import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokédex by rulkimi",
  description: "An unofficial, non-profit Pokédex built for educational purposes. Explore Pokémon stats, abilities, and evolutions.",
  openGraph: {
    title: "Pokédex by rulkimi",
    description: "An unofficial, non-profit Pokédex built for educational purposes. Explore Pokémon stats, abilities, and evolutions.",
    type: "website",
    url: "https://pokedex.rulkimi.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pokédex",
      },
    ],
  },
  metadataBase: new URL("https://pokedex.rulkimi.com"),
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <NuqsAdapter>
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">{children}</main>
              <footer className="w-full py-4 px-6 text-center text-xs text-muted-foreground/60 border-t bg-muted/20">
                <p>
                  <strong>Pokédex by rulkimi</strong> is an unofficial, non-profit web app<span className="hidden sm:inline">lication built for educational purposes and web development practice</span> using <a href="https://pokeapi.co/" target="_blank" rel="noreferrer" className="underline hover:text-muted-foreground">PokéAPI</a>.
                </p>
                <p className="mt-1">
                  <span className="hidden sm:inline">Pokémon and Pokémon character names are trademarks of Nintendo. </span>No copyright infringement intended.
                </p>
              </footer>
            </div>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
