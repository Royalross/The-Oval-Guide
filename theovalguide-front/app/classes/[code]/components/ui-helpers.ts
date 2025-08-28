export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

export function fmt1(n: unknown): string {
  return isFiniteNumber(n) ? n.toFixed(1) : "—";
}

export function formatPct(n: number): string {
  return `${Math.round(n)}%`;
}
