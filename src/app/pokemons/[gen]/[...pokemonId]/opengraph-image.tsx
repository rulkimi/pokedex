import { ImageResponse } from 'next/og';
import { fetchPokemonById } from '../actions';
import { formatName } from '@/lib/utils';

export const runtime = 'edge';
export const alt = 'Pokemon Stats Card';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { pokemonId: string[] } }) {
  const idStr = params.pokemonId?.[0];
  if (!idStr) return new Response('Not Found', { status: 404 });
  
  const id = parseInt(idStr);
  const pokemon = await fetchPokemonById(id);
  
  if (!pokemon) {
    return new Response('Not Found', { status: 404 });
  }

  // Pick a base color based on the first type (using static mappings since we can't easily use Tailwind classes in the same way in Satori without a plugin, but inline styles work perfectly)
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
          backgroundColor: '#0f172a', // Slate 900
          fontFamily: 'sans-serif',
        }}
      >
        {/* Left Side: Theme Color and Pokemon Image */}
        <div
          style={{
            width: '45%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: bgColor,
            padding: '40px',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Pokemon Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            alt={pokemon.name}
            style={{ width: '400px', height: '400px', objectFit: 'contain' }}
          />
        </div>

        {/* Right Side: Info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '55%',
            height: '100%',
            padding: '60px 50px',
            color: 'white',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '72px', fontWeight: 'bold', textTransform: 'capitalize', margin: 0 }}>
              {formatName(pokemon.name)}
            </h1>
            <span style={{ fontSize: '48px', fontWeight: 'bold', opacity: 0.7 }}>
              {formatId(pokemon.id)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
            {pokemon.types.map((type) => (
              <div
                key={type}
                style={{
                  padding: '10px 20px',
                  borderRadius: '30px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                {type}
              </div>
            ))}
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ fontSize: '24px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '3px', marginBottom: '10px', marginTop: 0 }}>
              Base Stats
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {pokemon.stats.map(stat => {
                const statNameMap: Record<string, string> = {
                  'hp': 'HP', 'attack': 'ATK', 'defense': 'DEF',
                  'special-attack': 'SATK', 'special-defense': 'SDEF', 'speed': 'SPD'
                };
                const shortName = statNameMap[stat.name] || stat.name;
                const percentage = Math.min(100, (stat.value / 150) * 100);
                const color = stat.value < 50 ? '#ef4444' : stat.value > 90 ? '#22c55e' : '#f59e0b';

                return (
                  <div key={stat.name} style={{ display: 'flex', alignItems: 'center', width: '45%', fontSize: '22px' }}>
                    <span style={{ width: '80px', fontWeight: 'bold', color: '#94a3b8' }}>{shortName}</span>
                    <span style={{ width: '60px', textAlign: 'right', fontWeight: 'bold', marginRight: '20px' }}>{stat.value}</span>
                    <div style={{ flex: 1, height: '12px', backgroundColor: '#334155', borderRadius: '10px', display: 'flex' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: color, borderRadius: '10px' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
