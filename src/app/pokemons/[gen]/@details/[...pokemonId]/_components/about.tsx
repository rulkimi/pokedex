import { PokemonDetail } from "../../../actions";

export default function About({ pokemon }: { pokemon: PokemonDetail }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">About</h3>
      
      {pokemon.description && (
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          {pokemon.description}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Physical Stats Box */}
        <div className="bg-muted/30 rounded-2xl p-4 flex justify-between text-sm shadow-sm border border-border/50">
          <div className="flex flex-col items-center gap-1 w-full border-r border-border/50">
            <span className="text-muted-foreground font-medium text-xs">Height</span>
            <span className="font-semibold">{(pokemon.height / 10).toFixed(1)} m</span>
          </div>
          <div className="flex flex-col items-center gap-1 w-full">
            <span className="text-muted-foreground font-medium text-xs">Weight</span>
            <span className="font-semibold">{(pokemon.weight / 10).toFixed(1)} kg</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <span className="text-muted-foreground font-medium col-span-1">Abilities</span>
          <div className="col-span-2 flex flex-col gap-1">
            {pokemon.abilities.map((ability, idx) => (
              <span key={idx} className={`capitalize ${ability.is_hidden ? 'text-muted-foreground text-xs' : 'font-medium'}`}>
                {ability.name.replace('-', ' ')} {ability.is_hidden && '(Hidden)'}
              </span>
            ))}
          </div>
        </div>

        {pokemon.base_experience > 0 && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium col-span-1">Base Exp.</span>
            <span className="col-span-2 font-medium">{pokemon.base_experience}</span>
          </div>
        )}

        {pokemon.habitat && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium col-span-1">Habitat</span>
            <span className="col-span-2 font-medium capitalize">{pokemon.habitat.replace('-', ' ')}</span>
          </div>
        )}

        {pokemon.egg_groups && pokemon.egg_groups.length > 0 && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium col-span-1">Egg Groups</span>
            <span className="col-span-2 font-medium capitalize">{pokemon.egg_groups.join(', ').replace('-', ' ')}</span>
          </div>
        )}

        {pokemon.gender_rate !== undefined && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium col-span-1">Gender</span>
            <span className="col-span-2 font-medium">
              {pokemon.gender_rate === -1 ? (
                "Genderless"
              ) : (
                <div className="flex gap-4">
                  <span className="text-blue-500">♂ {((8 - pokemon.gender_rate) / 8 * 100).toFixed(1)}%</span>
                  <span className="text-pink-500">♀ {(pokemon.gender_rate / 8 * 100).toFixed(1)}%</span>
                </div>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
