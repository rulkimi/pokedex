export default function PokemonListingSkeleton() {
  const getRandomWidth = (min: number, max: number) =>
    `${Math.floor(Math.random() * (max - min + 1)) + min}px`;

  return (
    <ul className="space-y-1">
      {Array.from({ length: 10 }, (_, i) => i).map((num) => (
        <li
          key={num}
          className="px-4 rounded-2xl w-full h-20 animate-pulse"
        >
          <div className="flex items-center gap-2 justify-between">
            <div className="space-y-2">
              <div
                className="h-4 bg-muted rounded-md animate-pulse"
                style={{ width: getRandomWidth(60, 120) }}
              ></div>
              <div className="flex gap-1">
                {Array.from({ length: 3 }, (_, j) => (
                  <div
                    key={j}
                    className="px-2 py-0.5 rounded-xl h-6 bg-muted animate-pulse"
                    style={{ width: getRandomWidth(40, 70) }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="size-[80px] bg-muted rounded-full animate-pulse"></div>
          </div>
        </li>
      ))}
    </ul>
  );
}
