import { useState } from "react";

export default function Moves({ moves }: { moves: string[] }) {
  const [showAll, setShowAll] = useState(false);
  
  // Show first 12 moves, then a button to expand
  const displayedMoves = showAll ? moves : moves.slice(0, 12);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold uppercase">Learnset</h2>
      <div className="flex flex-wrap gap-2">
        {displayedMoves.map((move, index) => (
          <span 
            key={index} 
            className="px-3 py-1 bg-muted/40 rounded-full text-xs font-medium capitalize border border-border/50 text-muted-foreground"
          >
            {move.replace('-', ' ')}
          </span>
        ))}
      </div>
      {moves.length > 12 && (
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-semibold text-primary hover:underline"
        >
          {showAll ? "Show Less" : `View All ${moves.length} Moves`}
        </button>
      )}
    </section>
  );
}
