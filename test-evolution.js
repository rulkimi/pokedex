const https = require('https');

https.get('https://pokeapi.co/api/v2/evolution-chain/67/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log(JSON.stringify(json.chain.evolves_to[0].evolution_details, null, 2));
  });
});
