
import { useState } from 'react';
import ColorPicker from './ColorPicker';
import Modal from './Modal';
import { Team } from '@/lib/utils';

type Props = {
  team: Team;
  onUpdate: (patch: Partial<Team>) => void;
  onGenerate: () => Promise<void>;
};

export default function TeamCard({ team, onUpdate, onGenerate }: Props){
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  async function doGenerate(){
    try { setBusy(true); await onGenerate(); } finally { setBusy(false); }
  }
  return (
    <div className="card">
      <div className="cardHeader">
        <div style={{minWidth:0}}>
          <div className="cardTitle">{team.name}</div>
          <div className="cardSub">Owner: {team.owner}</div>
        </div>
      </div>
      <div className="cardBody">
        <div className="previewWrap" onClick={()=> team.logoUrl && setOpen(true)}>
          {team.logoUrl ? <img src={team.logoUrl} alt={`${team.name} logo`} /> : <div className="help">No logo yet. Generate one!</div>}
          <div className="previewHint">{team.logoUrl ? 'Click to open' : ' '}</div>
        </div>
        <div className="controls">
          <div className="field">
            <label>Mascot</label>
            <input className="input" type="text" value={team.mascot} onChange={(e)=> onUpdate({ mascot: e.target.value })} />
          </div>
          <ColorPicker label="Primary" value={team.primary} onChange={(hex)=> onUpdate({ primary: hex })} />
          <ColorPicker label="Secondary" value={team.secondary} onChange={(hex)=> onUpdate({ secondary: hex })} />
          <div className="actions">
            <button className="primary" onClick={doGenerate} disabled={busy}>
              {busy ? 'Generating…' : 'Generate Logo (Free)'}
            </button>
          </div>
        </div>
      </div>
      <div className="footerNote">Everything stays inside this card. No overflow. ✨</div>
      <Modal open={open} onClose={()=>setOpen(false)} title={team.name}>
        {team.logoUrl && <img className="modalImg" src={team.logoUrl} alt={`${team.name} logo full`} />}
      </Modal>
    </div>
  );
}
