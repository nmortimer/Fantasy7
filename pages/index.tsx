
'use client';
import { useState } from 'react';
import TeamCard from '@/components/TeamCard';
import { Team } from '@/lib/utils';

type SleeperUser = { user_id: string; display_name: string };

export default function Home(){
  const [leagueId, setLeagueId] = useState('');
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  async function loadLeague(){
    if(!leagueId) return;
    try{
      setLoading(true);
      const [rRosters, rUsers] = await Promise.all([
        fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
        fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`),
      ]);
      if(!rRosters.ok || !rUsers.ok) throw new Error('Failed to fetch league');
      const rosters = await rRosters.json();
      const users = await rUsers.json() as SleeperUser[];
      const userMap = new Map(users.map(u => [u.user_id, u.display_name]));
      const mapped: Team[] = (rosters as any[]).map((r, i) => ({
        id: String(r.roster_id ?? i),
        name: r.settings?.team_name || `Team ${i+1}`,
        owner: userMap.get(r.owner_id) || 'Unknown',
        mascot: 'Fox',
        primary: '#00B2CA',
        secondary: '#1A1A1A',
        seed: Math.floor(Math.random()*1_000_000_000),
        logoUrl: null
      }));
      setTeams(mapped);
    } catch (e:any){
      alert(e.message);
    } finally { setLoading(false); }
  }

  function patchTeam(id: string, patch: Partial<Team>){
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  }

  async function generateLogo(team: Team){
    const res = await fetch('/api/generate-logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team })
    });
    if(!res.ok){ throw new Error(await res.text()); }
    const data = await res.json();
    patchTeam(team.id, { logoUrl: data.url });
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Fantasy Logo Studio (Free)</h1>
        <div className="tools">
          <input className="input" placeholder="Enter Sleeper League ID" value={leagueId} onChange={(e)=> setLeagueId(e.target.value)} />
          <button className="primary" onClick={loadLeague} disabled={loading}>
            {loading ? 'Loading…' : 'Load League'}
          </button>
        </div>
      </div>
      {teams.length === 0 && <p className="help">Load a league to begin. Click “Generate Logo (Free)” to create logos—no API keys.</p>}
      <div className="grid">
        {teams.map(t => (
          <TeamCard
            key={t.id}
            team={t}
            onUpdate={(patch)=> patchTeam(t.id, patch)}
            onGenerate={()=> generateLogo(t)}
          />
        ))}
      </div>
    </div>
  );
}
