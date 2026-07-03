import { ImageResponse } from 'next/og';
import { fetchPokemonById } from '../../pokemons/[gen]/actions';
import { formatName } from '@/lib/utils';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    
    if (!idStr) {
      return new Response('Missing id', { status: 400 });
    }
    
    const id = parseInt(idStr);
    const pokemon = await fetchPokemonById(id);
    
    if (!pokemon) {
      return new Response('Not Found', { status: 404 });
    }

    const typeColors: Record<string, string> = {
      normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
      grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
      ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
      rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705898',
      steel: '#B7B7CE', fairy: '#D685AD'
    };
    
    const mainType = pokemon.types[0] || 'normal';
    const bgColor = typeColors[mainType] || '#A8A77A';
    const formatId = (num: number) => `#${num.toString().padStart(4, '0')}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            backgroundColor: bgColor,
            fontFamily: 'sans-serif',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Background Pokeball */}
          <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.15)" 
            strokeWidth="6" 
            style={{ 
              position: 'absolute', 
              width: '800px', 
              height: '800px', 
              transform: 'rotate(15deg)',
              right: '-100px',
              top: '-100px',
            }}
          >
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="12" />
            <path d="M10 50 H38" />
            <path d="M62 50 H90" />
          </svg>

          {/* Pokémon Asset */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
              alt={pokemon.name}
              style={{ width: '450px', height: '450px', objectFit: 'contain', filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.3))' }}
            />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginTop: '20px' }}>
              <span style={{ fontSize: '64px', fontWeight: 'bold', color: 'white', textTransform: 'capitalize', letterSpacing: '-1px' }}>
                {formatName(pokemon.name)}
              </span>
              <span style={{ fontSize: '42px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.7)' }}>
                {formatId(pokemon.id)}
              </span>
            </div>
          </div>

          {/* Footer Text */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '0',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              padding: '12px 32px',
              borderRadius: '100px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '24px',
              fontWeight: '600',
              letterSpacing: '1px',
              backdropFilter: 'blur(10px)',
            }}>
              Pokédex by rulkimi
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation failed:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
