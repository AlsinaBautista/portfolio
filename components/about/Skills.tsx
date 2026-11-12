"use client";

import { motion } from "motion/react";
import Chip from "@/components/ui/Chip";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Skills en chips agrupados, sin barras de porcentaje. Los chips aparecen escalonados. */
export default function Skills({ title, groups }: { title: string; groups: { group: string; items: string[] }[] }) {
  const reduced = useReducedMotion();
  return (
    <div>
      <h3 className="label text-tinta-2">{title}</h3>
      <dl className="mt-6 space-y-6">
        {groups.map((g, gi) => (
          <div key={g.group} className="grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6">
            <dt className="label pt-1.5 text-pared">{g.group}</dt>
            <dd className="m-0 flex flex-wrap gap-2">
              {g.items.map((s, i) => (
                <motion.span
                  key={s}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.35, delay: gi * 0.06 + i * 0.045, ease: [0.2, 0, 0, 1] }}
                >
                  <Chip>{s}</Chip>
                </motion.span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
