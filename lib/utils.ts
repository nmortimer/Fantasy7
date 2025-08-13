
export type Team = {
  id: string;
  name: string;
  owner: string;
  mascot: string;
  primary: string;
  secondary: string;
  seed: number;
  logoUrl?: string | null;
};

export function randomSeed(): number {
  return Math.floor(Math.random() * 1_000_000_000);
}

export function sanitizeHex(input: string) {
  const x = input.trim().replace(/[^0-9a-fA-F]/g, '').slice(0,6);
  return `#${x.padEnd(6,'0')}`;
}
