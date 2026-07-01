async function check() {
  const query = `
    query {
      pokemon_v2_pokemon(where: {id: {_gt: 10000}}, order_by: {id: asc}) {
        id
        name
      }
    }
  `;
  const response = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const { data } = await response.json();
  const pokemons = data.pokemon_v2_pokemon;
  console.log("Total variants > 10000:", pokemons.length);
  console.log("Min ID:", pokemons[0].id);
  console.log("Max ID:", pokemons[pokemons.length - 1].id);
}
check();
