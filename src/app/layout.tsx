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
  description: "An unofficial Pokédex application built for practicing web development using PokéAPI to showcase Pokémon. Browse through generations, view detailed information, and test your knowledge.",
  openGraph: {
    title: "Pokédex by rulkimi",
    description: "An unofficial Pokédex application built for practicing web development using PokéAPI to showcase Pokémon.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">{children}</main>
            <footer className="w-full py-4 px-6 text-center text-xs text-muted-foreground/60 border-t bg-muted/20">
              <p>
                <strong>Pokédex by rulkimi</strong> is an unofficial, non-profit web application built for educational purposes and web development practice using <a href="https://pokeapi.co/" target="_blank" rel="noreferrer" className="underline hover:text-muted-foreground">PokéAPI</a>.
              </p>
              <p className="mt-1">
                Pokémon and Pokémon character names are trademarks of Nintendo. No copyright infringement intended.
              </p>
            </footer>
          </div>
        </NuqsAdapter>
      </body>
    </html>
  );
}
