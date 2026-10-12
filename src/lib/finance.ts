export const fcfa = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

/** Compact amounts for tight UI: 1,2 M FCFA, 350 k FCFA. */
export function fcfaShort(v: number) {
  if (Math.abs(v) >= 1_000_000)
    return `${(v / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M FCFA`;
  if (Math.abs(v) >= 10_000) return `${Math.round(v / 1000).toLocaleString("fr-FR")} k FCFA`;
  return fcfa.format(v);
}

export type GrowthPoint = { year: number; paid: number; total: number };

/** Monthly-compounded savings plan, sampled to a fixed number of points so charts can morph. */
export function simulateGrowth(
  initial: number,
  monthly: number,
  years: number,
  ratePct: number,
  samples = 64,
): GrowthPoint[] {
  const months = Math.max(1, Math.round(years * 12));
  const r = ratePct / 100 / 12;
  const byMonth: GrowthPoint[] = [{ year: 0, paid: initial, total: initial }];
  let total = initial;
  let paid = initial;
  for (let m = 1; m <= months; m++) {
    total = total * (1 + r) + monthly;
    paid += monthly;
    byMonth.push({ year: m / 12, paid, total });
  }
  return Array.from({ length: samples }, (_, i) => byMonth[Math.round((i / (samples - 1)) * months)]);
}

/** Monthly deposit needed to reach `goal` in `months`, given money already saved and a yearly rate. */
export function monthlyForGoal(goal: number, months: number, already = 0, ratePct = 0) {
  const r = ratePct / 100 / 12;
  const remaining = goal - already * Math.pow(1 + r, months);
  if (remaining <= 0) return 0;
  if (r === 0) return remaining / months;
  return (remaining * r) / (Math.pow(1 + r, months) - 1);
}
