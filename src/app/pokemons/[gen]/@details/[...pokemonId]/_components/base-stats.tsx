"use client"

import { formatStat, getStatWidth, getTotalStats, Stat } from "@/lib/utils";
import { motion } from "motion/react";

export default function BaseStats({
  stats
}: {
  stats: Stat[];
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-bold uppercase">Base Stats</h2>
      <ul>
        {stats.map(stat => (
          <li key={stat.name} className="flex items-center">
            <StatBar stat={stat} />
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-end mt-2 -mr-1 gap-4">
        <span className="font-semibold">TOTAL STATS: </span>
        <motion.span 
          layoutId="total-stats"
          className="px-2 py-1 rounded-full bg-primary text-white"
        >
          {getTotalStats(stats)}
        </motion.span>
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
      <span className="flex-grow bg-muted rounded-full h-3">
        <motion.span
          layoutId={`stat-${stat.name}`}
          className="flex justify-center bg-primary h-3 rounded-full"
          initial={{ width: getStatWidth(stat) + '%' }}
          animate={{ width: getStatWidth(stat) + '%' }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </span>
      <motion.span 
        layoutId={`stat-value-${stat.name}`}
        className="w-12 flex justify-center font-semibold text-xs"
      >
        {stat.value}
      </motion.span>
    </>
  );
}