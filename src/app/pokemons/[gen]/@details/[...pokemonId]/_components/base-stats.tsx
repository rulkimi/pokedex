import { formatStat, getStatWidth, getTotalStats, Stat } from "@/lib/utils";

export default function BaseStats({
  stats
}: {
  stats: Stat[];
}) {
  return (
    <section>
      <h2 className="text-lg font-bold">Base Stats</h2>
      <ul>
        {stats.map(stat => (
          <li key={stat.name} className="flex items-center">
            <StatBar stat={stat} />
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-end mt-2 -mr-1 gap-4">
        <span className="font-semibold">TOTAL STATS: </span>
        <span className="px-2 py-1 rounded-full bg-blue-600 text-white ">
          {getTotalStats(stats)}
        </span>
      </div>
    </section>
  );
}

const StatBar = ({ stat }: { stat: Stat }) => {
  return (
    <>
      <span className="flex-none text-start text-xs w-[50px] uppercase font-semibold">
        {formatStat(stat.name)}
      </span>
      <span className="flex-grow bg-gray-200 rounded-full h-3">
        <span
          className="flex justify-center bg-blue-600 h-3 rounded-full"
          style={{ width: getStatWidth(stat) + '%' }}
        ></span>
      </span>
      <span className="w-12 flex justify-center font-semibold text-xs">
        {stat.value}
      </span>
    </>
  );
}