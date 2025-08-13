import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const TeamSchema = z.object({
  name: z.string(),
  mascot: z.string(),
  primary: z.string(),
  secondary: z.string()
});
const BodySchema = z.object({ team: TeamSchema });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }
  try {
    const { team } = BodySchema.parse(req.body);
    const hex = (v: string) => (v.startsWith('#') ? v : `#${v}`);
    const prompt = [
      'clean modern vector sports logo, fantasy football team',
      `team name: ${team.name}`,
      `mascot: ${team.mascot}`,
      `primary color ${hex(team.primary)}, secondary color ${hex(team.secondary)}`,
      'centered emblem, bold lines, crisp edges, high contrast,',
      'no text, transparent background'
    ].join(', ');
    const url =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
      `?width=1024&height=1024&nologo=true&enhance=true`;
    return res.status(200).json({ url });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message ?? 'Bad Request' });
  }
}
