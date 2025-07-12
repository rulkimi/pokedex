# Pokédex

A responsive and modern Pokédex built with Next.js. It pulls data from PokéAPI and presents it in a clean UI with smooth interactions, optimized for both desktop and mobile.

🌐 Live site: [pokedex.rulkimi.com](https://pokedex.rulkimi.com/pokemons/1/0)

## Features

- View Pokémon by generation
- Detailed stats, types, and evolution info
- Who's That Pokemon (Guess tab)

## Tech Stack

- **Next.js (App Router)**
- **Tailwind CSS + Shadcn UI**
- **nuqs** (for URL query state)
- **Framer Motion**
- **PokéAPI** (data source)

## Getting Started

```bash
git clone https://github.com/rulkimi/pokedex.git
cd pokedex
npm install
npm dev
```

## Project Structure
```bash
app/
  pokemons/
    [gen]/         → Pokémon list by generation
    [gen]/[id]/    → Detail view for each Pokémon
  components/      → Reusable UI components
  lib/             → Utility functions (e.g. cry player, search utils)
```

## Credit
- Data from [PokéAPI](https://pokeapi.co/)
- UI inspired by classic Pokédex, reimagined with a modern stack
