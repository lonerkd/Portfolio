import React, { useState, useEffect } from 'react';
import { Play, FileText, ArrowDown, ExternalLink, ChevronRight, X, Film, Pen, Eye } from 'lucide-react';

const IMG = (id, w = 800) => `https://lh3.googleusercontent.com/d/${id}=w${w}`;
const IMG_FB = (id, w = 800) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;

const VIDEOS = [
  { id:'10m', title:'10 Million', cat:'Music Video', role:'Director of Photography / Editor', desc:'High-energy visual rhythm. Every cut lands on the beat, every frame tells a story of ambition.', did:'10A2uzDxrEEgx-6tiS3M_qbhAq72dglZt', year:'2026', feat:true },
  { id:'brief', title:'The Briefcase', cat:'Short Film', role:'Writer / Cinematographer', desc:'A crime thriller about two couriers, a mysterious briefcase, and a deal that has to go right.', did:'1EM1AVe-50e6IMKL2m8teeakg6aSL3ctr', year:'2024', feat:true },
  { id:'audio', title:'The Audio Blueprint', cat:'Documentary Teaser', role:'Director / Writer / Editor', desc:'The invisible art of sound design in film — why audio is the secret weapon behind iconic movie moments.', did:'1hpS5fIfDRthOgzCD0jda5IcuHiverR8n', year:'2025' },
  { id:'psa', title:'The Grand PSA', cat:'Commercial / PSA', role:'Writer / Director / DP / Editor', desc:'A love letter to The Grand Theatre. Wrote the script, directed the shoot, graded the final cut.', did:'1Mmk_nM_WXCskja0NEIa6PlM51cul-z00', year:'2025' },
  { id:'altitude', title:'The Pursuit of Altitude', cat:'Documentary', role:'Cinematographer / Editor', desc:'Chasing elevation, both literal and metaphorical. Visual storytelling through landscape and movement.', did:'1-bPAYnQROhT9awRMEBWuDCGSw04CtBgE', year:'2024' },
  { id:'cook', title:'Live Cooking Demo', cat:'Live Multi-Cam', role:'Camera Operator / Switcher', desc:'Live multi-camera production. Real-time switching, no second takes, all precision.', did:'13fmSRFNiGZl2b57-cd0qVnjcPx9IDUUZ', year:'2025' },
  { id:'intv', title:'Live Interview Show', cat:'Live Multi-Cam', role:'Camera Operator / Director', desc:'Sit-down interview format. Directing multiple camera operators in real time.', did:'1A7dgksrR-9KJ6TyxfO6Ch3TOc2bqbL0t', year:'2025' },
  { id:'news', title:'Banded Peak News Pack', cat:'Broadcast', role:'Camera Operator / Editor', desc:'Professional broadcast news package. Technical precision under deadline pressure.', did:'1iw925ZsP2evEINyDqP6iesQYellQ4Z9u', year:'2024' },
  { id:'tiktok', title:'TikTok Addiction', cat:'Documentary Teaser', role:'Director / Editor', desc:'A short-form documentary teaser examining our relationship with infinite scroll.', did:'1o61DVHh8QhTYWKSOQOvs9P4kEoZQqygI', year:'2024' },
  { id:'fraud', title:'Fraud', cat:'Documentary Teaser', role:'Director / Editor', desc:'Deception as a system. A teaser exploring how fraud operates in plain sight.', did:'10AfFlmGp1qbqI_9BKSQnYfyTi7o_SFbp', year:'2024' },
];

const PHOTOS = [
  '1E_vf5yeYCtRaB8CMGIrkJu5zBNT-MRLO','1owmYc9lTuoas80z6uX68Zh5gjWc_HFzm',
  '1tfFCE5ORbHwHb_HFIS3SeYGoXcQRpdfS','1KwIxNlnl2vUuH6Wo57LToYa2b9Sj7Bhm',
  '1wcmVwR9mWMHv9WP9nWHBX9RpI5rPjXge','1VRjE0VIvLoDaOdGfPAvx8Z_5NRlzxutw',
  '1s8gA48BIhJddg-Mk2Ns_bfjb0rP5l6v5','1CfevkaSmrmpUEaetdGnM8quZAQBV6fLB',
  '1d73j2enoH-IkFGAXRG6JsX1lK2N_tWP4','1GuvBsMJ80PCEgGlhFwHerkgxJPHXgmIT',
  '1QAY4u44Ltse_FSbtj2lvSnxXon0yg0Wj','1Quwts5Lrg1rHZn-whJLkm2T_MoWTPBDB',
  '1ILTYjQTcZrHA5jXsWOcLcUVvHRUxf5_G','124P4ZdzSU_ow_CeafQjuCuLXU5kZ_sZx',
  '1s_Jvg7pOvxdgNnBXY1wVVHv7XzV5XYp9','1XldskBnYHylvXLu1Bgeaj7zsgKl7AAaQ',
  '1gHeCdlcsgxFsJY4WwgU8Br-SZl_tz1IP','1fKjkXrPXUlgGUTREDiSG7Z43kjjxVdV2',
  '1pkLE02GQm3bS0gCffbHAjQXMy6TosKAK','1LIqrIaOJwVwtViTN5a3D8Pk5b8Dm8Izo',
  '1thwuXrp_qcITKOlB6V0F5AtSnPatEBzw','1rfOxvN9ma3_U3Z8D3aQAbnQcJyJR09Mk',
  '1hMl7N5jMfEQs_tS-8kD3Zxj35NN0bYcH','1aWk5pEw7VbEblKh9McE7lpUq7KZy6Lem',
  '1hRxTsmDVsYWZANPvs6MPIq1pAX0I1zAR','1_P7XRpC8By7sNrxkmL76otVB4yypAdei',
  '1U1RwG9UiAZvYoUlHSMluCHrjFrJ4_I02',
];

function sRng(seed) { let s=seed; return ()=>{ s=(s*16807)%2147483647; return(s-1)/2147483646; }; }

function PhotoScatter({ opacity=0.08, count=22 }) {
  const rng = sRng(777);
  const items = PHOTOS.slice(0,count).map((id,i)=>({
    id, x:rng()*86+3, y:rng()*86+3, rot:(rng()-0.5)*28,
    w:85+rng()*105, z:Math.floor(rng()*15), d:i*0.05,
  }));
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',opacity}}>
      {items.map((p,i)=>(
        <div key={i} style={{
          position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
          width:p.w, height:p.w*0.7,
          transform:`rotate(${p.rot}deg)`, zIndex:p.z,
          animation:`scIn 1s ease-out ${p.d}s both`,
        }}>
          <div style={{
            width:'100%',height:'100%',background:'#141414',
            border:'3px solid rgba(240,236,228,0.22)',
            boxShadow:'3px 5px 16px rgba(0,0,0,0.8)',
            padding:3,overflow:'hidden',
          }}>
            <img src={IMG(p.id,300)} alt="" loading="lazy"
              style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
              onError={e=>{
                if(!e.target.dataset.fb){e.target.dataset.fb='1';e.target.src=IMG_FB(p.id,300);}
                else e.target.style.display='none';
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Thumb({did,alt='',style={}}) {
  return <img src={IMG(did,800)} alt={alt} loading="lazy"
    style={{objectFit:'cover',display:'block',...style}}
    onError={e=>{
      if(!e.target.dataset.fb){e.target.dataset.fb='1';e.target.src=IMG_FB(did,800);}
      else e.target.style.opacity='0';
    }}
  />;
}

function VCard({v,onClick,large}) {
  const [h,setH]=useState(false);
  return (
    <div style={{
      position:'relative',overflow:'hidden',cursor:'pointer',
      aspectRatio:large?'21/9':'16/9', background:'#0e0e0e',
      border:'1px solid rgba(255,255,255,0.04)',
      transition:'all 0.5s cubic-bezier(0.16,1,0.3,1)',
      transform:h?'scale(1.006)':'scale(1)',
      gridColumn:large?'1/-1':undefined,
    }}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      onClick={()=>onClick(v)}
    >
      <Thumb did={v.did} alt={v.title} style={{
        position:'absolute',inset:0,width:'100%',height:'100%',
        transition:'transform 0.8s cubic-bezier(0.16,1,0.3,1),opacity 0.5s',
        transform:h?'scale(1.05)':'scale(1)', opacity:h?0.55:0.4,
      }}/>
      <div style={{position:'absolute',inset:0,
        background:h?'linear-gradient(transparent 20%,rgba(0,0,0,0.88) 100%)':'linear-gradient(transparent 30%,rgba(0,0,0,0.92) 100%)',
        transition:'all 0.5s',
      }}/>
      <div style={{position:'absolute',top:14,right:14,zIndex:10,
        fontSize:9,letterSpacing:3,textTransform:'uppercase',color:'var(--accent)',fontFamily:'var(--mono)',
      }}>{v.cat}</div>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:10}}>
        <div style={{
          width:large?64:44,height:large?64:44,borderRadius:'50%',
          border:`2px solid ${h?'var(--accent)':'rgba(255,255,255,0.3)'}`,
          display:'flex',alignItems:'center',justifyContent:'center',
          transition:'all 0.4s', transform:h?'scale(1.1)':'scale(1)',
          background:h?'rgba(255,60,0,0.1)':'transparent',
        }}>
          <Play size={large?22:15} fill={h?'#ff3c00':'#fff'} color={h?'#ff3c00':'#fff'} style={{marginLeft:3}}/>
        </div>
      </div>
      <div style={{
        position:'absolute',bottom:0,left:0,padding:large?24:16,zIndex:10,width:'100%',
        transform:h?'translateY(0)':'translateY(3px)',transition:'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <h3 style={{fontFamily:'var(--display)',fontSize:large?'clamp(1.8rem,3.5vw,2.8rem)':'clamp(1rem,1.8vw,1.4rem)',letterSpacing:2,lineHeight:1,color:'var(--fg)'}}>{v.title}</h3>
        <p style={{fontSize:9,fontFamily:'var(--mono)',letterSpacing:2,color:'rgba(255,255,255,0.3)',marginTop:3,textTransform:'uppercase'}}>{v.role} · {v.year}</p>
        {large&&<p style={{fontFamily:'var(--serif)',fontSize:13,color:'rgba(255,255,255,0.4)',marginTop:6,maxWidth:480,fontStyle:'italic',
          opacity:h?1:0,transform:h?'translateY(0)':'translateY(8px)',transition:'all 0.4s 0.1s',
        }}>{v.desc}</p>}
      </div>
    </div>
  );
}

function VModal({v,onClose}) {
  useEffect(()=>{
    if(!v) return;
    const fn=e=>{if(e.key==='Escape')onClose();};
    window.addEventListener('keydown',fn);
    return()=>window.removeEventListener('keydown',fn);
  },[v,onClose]);
  
  if(!v) return null;
  
  return (
    <div style={{position:'fixed',inset:0,zIndex:9000,background:'rgba(0,0,0,0.94)',backdropFilter:'blur(20px)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={onClose}>
      <div style={{width:'100%',maxWidth:960,margin:'0 16px'}} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:'absolute',top:20,right:20,background:'none',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',padding:8}}><X size={26}/></button>
        <div style={{aspectRatio:'16/9',background:'#000',border:'1px solid rgba(255,255,255,0.06)'}}>
          <iframe src={`https://drive.google.com/file/d/${v.did}/preview`} width="100%" height="100%" allow="autoplay;encrypted-media" allowFullScreen style={{border:'none'}} title={v.title}/>
        </div>
        <div style={{marginTop:14,display:'flex',justifyContent:'space-between',alignItems:'start',flexWrap:'wrap',gap:14}}>
          <div>
            <h3 style={{fontFamily:'var(--display)',fontSize:'1.8rem',letterSpacing:2,color:'var(--fg)'}}>{v.title}</h3>
            <p style={{fontSize:9,fontFamily:'var(--mono)',letterSpacing:2,color:'var(--accent)',textTransform:'uppercase'}}>{v.cat} · {v.role} · {v.year}</p>
            <p style={{fontFamily:'var(--serif)',fontSize:13,color:'rgba(255,255,255,0.4)',marginTop:6,fontStyle:'italic',maxWidth:520}}>{v.desc}</p>
          </div>
          <a href={`https://drive.google.com/file/d/${v.did}/view`} target="_blank" rel="noopener noreferrer" className="link-btn"><ExternalLink size={11}/> Full Quality</a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [av,setAv]=useState(null);
  useEffect(()=>{
    const s=document.createElement('style');
    s.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
      :root{--display:'Bebas Neue',sans-serif;--mono:'DM Mono',monospace;--serif:'Cormorant Garamond',serif;--bg:#080808;--fg:#f0ece4;--accent:#ff3c00}
      *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{overflow-x:hidden;background:var(--bg)}
      ::selection{background:rgba(255,60,0,0.4)}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:3px}
      @keyframes scIn{from{opacity:0;transform:rotate(0deg) scale(0.4)}to{opacity:1}}
      @keyframes slideUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
      @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      @keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}30%{transform:translate(7%,-25%)}50%{transform:translate(-15%,10%)}70%{transform:translate(0%,15%)}90%{transform:translate(-10%,10%)}}
      .link-btn{font-size:9px;font-family:var(--mono);letter-spacing:3px;text-transform:uppercase;color:var(--fg);text-decoration:none;border:1px solid rgba(255,255,255,0.2);padding:10px 18px;display:inline-flex;align-items:center;gap:7px;transition:all 0.3s;flex-shrink:0;background:transparent;cursor:pointer}
      .link-btn:hover{border-color:var(--accent);color:var(--accent)}
      .cta-btn{font-size:10px;font-family:var(--mono);letter-spacing:4px;text-transform:uppercase;color:var(--fg);text-decoration:none;border:1px solid rgba(255,255,255,0.2);padding:14px 30px;transition:all 0.4s;display:inline-block}
      .cta-btn:hover{background:var(--accent);border-color:var(--accent);color:var(--bg)}
    `;
    document.head.appendChild(s);
    return()=>s.remove();
  },[]);

  const feat=VIDEOS.filter(v=>v.feat), rest=VIDEOS.filter(v=>!v.feat);

  return (
    <div style={{background:'var(--bg)',color:'var(--fg)',fontFamily:'var(--mono)',minHeight:'100vh'}}>
      <div style={{position:'fixed',inset:0,zIndex:9998,pointerEvents:'none',opacity:0.025,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,animation:'grain 0.5s steps(6) infinite'}}/>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,width:'100%',padding:'18px 32px',display:'flex',justifyContent:'space-between',alignItems:'center',zIndex:100,mixBlendMode:'difference'}}>
        <div style={{fontFamily:'var(--display)',fontSize:'1.15rem',letterSpacing:6,color:'var(--fg)'}}>PETER OLOWUDE</div>
        <div style={{display:'flex',gap:22}}>
          {['work','writing','story','contact'].map(s=>(
            <a key={s} href={`#${s}`} style={{color:'var(--fg)',textDecoration:'none',fontSize:9,letterSpacing:4,textTransform:'uppercase'}}>{s}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',position:'relative',overflow:'hidden'}}>
        <PhotoScatter opacity={0.09} count={24}/>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 40% 55%,rgba(255,60,0,0.06) 0%,transparent 55%)',zIndex:1}}/>
        <div style={{position:'relative',zIndex:2,textAlign:'center',animation:'slideUp 1s ease-out'}}>
          <div style={{fontFamily:'var(--display)',fontSize:'clamp(3.5rem,14vw,11rem)',lineHeight:0.85,letterSpacing:-2}}>
            <span style={{WebkitTextStroke:'2px var(--fg)',color:'transparent'}}>I DON'T</span><br/>
            <span style={{color:'var(--accent)'}}>JUST FILM</span>
          </div>
          <p style={{fontFamily:'var(--serif)',fontSize:'clamp(1rem,2.4vw,1.5rem)',fontWeight:300,fontStyle:'italic',letterSpacing:1,marginTop:22,opacity:0.5,animation:'slideUp 1s ease-out 0.2s both'}}>
            I build worlds. I write stories. I hold the camera like it owes me something.
          </p>
          <div style={{display:'flex',gap:18,justifyContent:'center',marginTop:32,animation:'slideUp 1s ease-out 0.35s both'}}>
            {[{i:<Film size={12}/>,l:'Cinematography'},{i:<Pen size={12}/>,l:'Writing'},{i:<Eye size={12}/>,l:'Creative Direction'}].map((t,i)=>(
              <span key={i} style={{fontSize:9,letterSpacing:3,textTransform:'uppercase',color:'rgba(240,236,228,0.28)',display:'flex',alignItems:'center',gap:5}}>{t.i} {t.l}</span>
            ))}
          </div>
        </div>
        <a href="#work" style={{position:'absolute',bottom:32,color:'var(--fg)',opacity:0.2,textDecoration:'none'}}><ArrowDown size={18}/></a>
      </section>

      {/* WORK */}
      <section id="work" style={{maxWidth:1160,margin:'0 auto',padding:'90px 18px'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:36}}>
          <div style={{width:32,height:1,background:'var(--accent)'}}/>
          <span style={{fontSize:9,letterSpacing:6,textTransform:'uppercase',color:'var(--accent)'}}>The Work — {VIDEOS.length} Projects</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3}}>
          {feat.map(v=><VCard key={v.id} v={v} onClick={setAv} large={false}/>)}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3,marginTop:3}}>
          {rest.slice(0,3).map(v=><VCard key={v.id} v={v} onClick={setAv}/>)}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,marginTop:3}}>
          {rest.slice(3,5).map(v=><VCard key={v.id} v={v} onClick={setAv}/>)}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3,marginTop:3}}>
          {rest.slice(5).map(v=><VCard key={v.id} v={v} onClick={setAv}/>)}
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{padding:'32px 0',overflow:'hidden',borderTop:'1px solid rgba(255,255,255,0.03)',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
        <div style={{display:'flex',gap:44,animation:'marquee 30s linear infinite',whiteSpace:'nowrap'}}>
          {['CINEMATOGRAPHY','DIRECTING','MUSIC VIDEOS','COLOR GRADING','CREATIVE DIRECTION','EDITING','STORYTELLING','LIGHTING','WRITING','SOUND DESIGN','LIVE MULTI-CAM','CINEMATOGRAPHY','DIRECTING','MUSIC VIDEOS','COLOR GRADING','CREATIVE DIRECTION','EDITING','STORYTELLING','LIGHTING','WRITING','SOUND DESIGN','LIVE MULTI-CAM'].map((s,i)=>(
            <span key={i} style={{fontFamily:'var(--display)',fontSize:'1.1rem',letterSpacing:6,flexShrink:0,opacity:i%2===0?1:0.12,color:i%2===0?'var(--accent)':'var(--fg)'}}>{s}</span>
          ))}
        </div>
      </div>

      {/* WRITING */}
      <section id="writing" style={{maxWidth:1000,margin:'0 auto',padding:'90px 18px'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:36}}>
          <div style={{width:32,height:1,background:'var(--accent)'}}/>
          <span style={{fontSize:9,letterSpacing:6,textTransform:'uppercase',color:'var(--accent)'}}>The Writing</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:36,border:'1px solid rgba(255,255,255,0.05)',padding:'36px 40px',marginBottom:20,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,right:0,width:260,height:260,background:'radial-gradient(circle,rgba(255,60,0,0.05) 0%,transparent 70%)'}}/>
          <div style={{position:'relative',zIndex:1}}>
            <span style={{fontSize:8,letterSpacing:5,textTransform:'uppercase',color:'var(--accent)'}}>Screenplay · Draft 9</span>
            <h3 style={{fontFamily:'var(--display)',fontSize:'2.6rem',letterSpacing:2,marginTop:5,fontStyle:'italic'}}>Femme Fatale</h3>
            <p style={{fontSize:9,letterSpacing:2,color:'rgba(255,255,255,0.22)',marginTop:5,textTransform:'uppercase'}}>133 Pages · Political Noir · Limited Series</p>
            <p style={{fontSize:9,letterSpacing:2,color:'rgba(255,255,255,0.22)',marginTop:2,textTransform:'uppercase'}}>For A24 / Proximity Media</p>
            <a href="https://drive.google.com/file/d/1cIynCQgJtWfLRpb5xZzgQw0rHMKauSO9/view" target="_blank" rel="noopener noreferrer" className="link-btn" style={{marginTop:18}}><FileText size={11}/> Read Script</a>
          </div>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{fontFamily:'var(--serif)',fontSize:'1.05rem',lineHeight:1.8,fontStyle:'italic',color:'rgba(255,255,255,0.45)',borderLeft:'2px solid var(--accent)',paddingLeft:20}}>
              A deconstruction of narrative control and the fabrication of reality. Set between Port-au-Prince in 1957 and a Parisian television studio, <span style={{color:'var(--fg)'}}>Femme Fatale</span> follows Iris Beaumont — a woman who learns to survive not with weapons, but with the stories she chooses to tell. This story asks the defining question of our time: when history is written by the winners, what is the cost of remembering the truth?
            </div>
            <div style={{marginTop:14,paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.04)',display:'flex',justifyContent:'space-between',fontSize:8,letterSpacing:4,color:'rgba(255,255,255,0.18)',textTransform:'uppercase'}}>
              <span>Series Bible Excerpt</span><span>P. Olowude</span>
            </div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3}}>
          {[
            {l:'Production Book',t:'Studio Music Video',d:'Full production book for a Frank Ocean "Chanel" music video. Shot lists, cam plans, choreography.',did:'174wk77-9dBwOoJlMvROLpIsnf-kByrC6'},
            {l:'Documentary One Sheet',t:'The Audio Blueprint',d:'Pitch doc for a 5-min documentary on sound design in film.',did:'1UvAxDRvO_6MvAAlUEFzVVTkou1ZNoxY-'},
            {l:'PSA Script',t:'A Stage for Every Story',d:'Written for The Grand Theatre, Calgary. Full shot-by-shot format sheet.',did:'1JQpQAEyNJmQlRnt2FVXDvjIZRaN_hNWf'},
            {l:'Short Film Screenplay',t:'The Briefcase',d:'Crime thriller. Two couriers, a mysterious delivery, a deal that can\'t go wrong.',did:'1ht--f7NM3X5LVPyaoA0uxoTlnAlZTMHJ'},
          ].map((w,i)=>(
            <a key={i} href={`https://drive.google.com/file/d/${w.did}/view`} target="_blank" rel="noopener noreferrer"
              style={{textDecoration:'none',color:'inherit',display:'block',border:'1px solid rgba(255,255,255,0.03)',padding:24,transition:'border-color 0.4s',background:'#0c0c0c'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,60,0,0.3)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.03)'}
            >
              <span style={{fontSize:8,letterSpacing:5,textTransform:'uppercase',color:'var(--accent)'}}>{w.l}</span>
              <h4 style={{fontFamily:'var(--display)',fontSize:'1.15rem',letterSpacing:2,marginTop:5}}>{w.t}</h4>
              <p style={{fontFamily:'var(--serif)',fontSize:12,lineHeight:1.5,color:'rgba(255,255,255,0.3)',fontStyle:'italic',marginTop:5}}>{w.d}</p>
              <span style={{display:'inline-flex',alignItems:'center',gap:4,marginTop:10,fontSize:8,letterSpacing:3,color:'rgba(255,255,255,0.2)'}}>READ <ChevronRight size={9}/></span>
            </a>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section id="story" style={{maxWidth:700,margin:'0 auto',padding:'90px 18px',position:'relative'}}>
        <PhotoScatter opacity={0.035} count={14}/>
        <div style={{position:'relative',zIndex:2}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:36}}>
            <div style={{width:32,height:1,background:'var(--accent)'}}/>
            <span style={{fontSize:9,letterSpacing:6,textTransform:'uppercase',color:'var(--accent)'}}>The Narrative</span>
          </div>
          <div style={{fontFamily:'var(--serif)',fontSize:'1.12rem',lineHeight:2,color:'rgba(255,255,255,0.5)'}}>
            <p style={{marginBottom:20}}>It began a couple months before I dropped out of film school.</p>
            <p style={{marginBottom:20}}>At 19, I was overwhelmed and realizing that the institution was a structure I no longer needed to validate my vision. I didn't drop out because it was too hard — I dropped out to prove this wasn't just a degree for me. <span style={{color:'var(--fg)',fontWeight:600}}>It was my vocation.</span></p>
            <p style={{marginBottom:20}}>From a family of Yale and Columbia grads, multinational business owners — my path was set. Business, law, or medicine. When I chose to chase a camera instead of a courtroom, the disappointment was palpable. But I embraced it.</p>
            <p style={{marginBottom:20}}>I've spent years in the dark writing scripts like <span style={{color:'var(--accent)',fontStyle:'italic'}}>Femme Fatale</span> — a 133-page screenplay submitted to A24 and Proximity Media. I've shot music videos, directed live multi-cam shows, built news packages, created documentaries. I've done every job on set because I wanted to understand the whole machine, not just one gear.</p>
            <p style={{color:'var(--fg)',fontWeight:400}}>I believe in the vision being built here. I have the work to show I can do it, and the dedication to ensure it's done right.</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{padding:'130px 18px',textAlign:'center',position:'relative'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 50%,rgba(255,60,0,0.04) 0%,transparent 55%)'}}/>
        <div style={{position:'relative',zIndex:2}}>
          <div style={{fontFamily:'var(--display)',fontSize:'clamp(3rem,10vw,7rem)',lineHeight:0.9,letterSpacing:-2}}>
            LET'S<br/><span style={{color:'var(--accent)'}}>BUILD</span><br/>SOMETHING
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:14,marginTop:40,flexWrap:'wrap'}}>
            {[{l:'Email',h:'mailto:peterolowude@gmail.com'},{l:'X / Twitter',h:'https://twitter.com/5stariah'},{l:'Full Drive',h:'https://drive.google.com/drive/folders/10kpdBuTKIWpCrARqTNSCW3OtyWzQnAg0'}].map((l,i)=>(
              <a key={i} href={l.h} target="_blank" rel="noopener noreferrer" className="cta-btn">{l.l}</a>
            ))}
          </div>
          <p style={{marginTop:32,fontFamily:'var(--serif)',fontSize:'1rem',fontStyle:'italic',opacity:0.3}}>
            Available immediately · Calgary, AB · Ready to relocate · Full time
          </p>
        </div>
      </section>

      <footer style={{textAlign:'center',padding:20,fontSize:8,letterSpacing:4,textTransform:'uppercase',opacity:0.1}}>
        © 2026 Peter Olowude · Misfits Cavern Productions
      </footer>

      <VModal v={av} onClose={()=>setAv(null)}/>
    </div>
  );
}
