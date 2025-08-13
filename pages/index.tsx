import { useState } from 'react';
import { Team } from '@/lib/utils';

export default function Home(){
  const [teamName, setTeamName] = useState('My Team');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  async function generate(){
    const res = await fetch('/api/generate-logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team: {
        name: teamName,
        mascot: 'Fox',
        primary: '#00B2CA',
        secondary: '#1A1A1A'
      }})
    });
    const data = await res.json();
    setLogoUrl(data.url);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Fantasy Logo Studio (Free)</h1>
      <input value={teamName} onChange={e=>setTeamName(e.target.value)} placeholder="Team name" />
      <button onClick={generate}>Generate Logo</button>
      {logoUrl && <div><img src={logoUrl} alt="logo" style={{maxWidth:300}} /></div>}
    </div>
  );
}
