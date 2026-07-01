const fs = require('fs');

async function update() {
  const query = `
    query {
      pokemon_v2_pokemon {
        id
        name
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
          }
        }
      }
    }
  `;

  console.log("Fetching from PokeAPI GraphQL...");
  const response = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  const { data } = await response.json();
  const pokemons = data.pokemon_v2_pokemon;

  const GENERATION_LIMITS = {
    1: { limit: 151, offset: 0 },
    2: { limit: 100, offset: 151 },
    3: { limit: 135, offset: 251 },
    4: { limit: 107, offset: 386 },
    5: { limit: 156, offset: 493 },
    6: { limit: 72, offset: 649 },
    7: { limit: 88, offset: 721 },
    8: { limit: 96, offset: 809 },
    9: { limit: 120, offset: 905 },
    10: { limit: 326, offset: 1025 },
  };

  const getPokemonGen = (id) => {
    if (id > 10000) return 10;
    for (const [gen, config] of Object.entries(GENERATION_LIMITS)) {
      if (id > config.offset && id <= config.offset + config.limit) {
        return parseInt(gen);
      }
    }
    return 1;
  };

  const oldData = JSON.parse(fs.readFileSync('./public/pokemons.json', 'utf8'));
  const newData = {};

  for (const p of pokemons) {
    newData[p.id] = {
      name: p.name,
      types: p.pokemon_v2_pokemontypes.map(t => t.pokemon_v2_type.name),
      gen: getPokemonGen(p.id)
    };
  }

  // Retain any old data just in case
  for (const id in oldData) {
    if (!newData[id]) {
      newData[id] = {
        name: oldData[id].name,
        types: [],
        gen: getPokemonGen(parseInt(id))
      };
    }
  }

  fs.writeFileSync('./public/pokemons.json', JSON.stringify(newData, null, 2));
  console.log("pokemons.json updated successfully!");
}

update().catch(console.error);
