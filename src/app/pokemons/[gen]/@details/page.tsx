export default function EmptyDetails() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh] text-center p-6 bg-background rounded-3xl relative overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03]">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" className="w-[150%] h-[150%]">
          <circle cx="50" cy="50" r="40" />
          <circle cx="50" cy="50" r="12" />
          <path d="M10 50 H38" />
          <path d="M62 50 H90" />
        </svg>
      </div>
      
      <div className="z-10 flex flex-col items-center space-y-6 max-w-sm">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center shadow-inner border border-border/50">
          <svg className="w-10 h-10 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">No Pokémon Selected</h3>
          <p className="text-muted-foreground leading-relaxed">
            Select a Pokémon from the list to view its complete Pokédex data, stats, and evolutions.
          </p>
        </div>
      </div>
    </div>
  );
}
