import React from 'react'

const ink = '#1E293B'
// Satu sumber warna per tong: sama dengan data/waste.js dan public/svg/bins/*.
const palette = { organik: '#22C55E', anorganik: '#F59E0B', b3: '#EF4444', kertas: '#3B82F6', residu: '#64748B' }

function Mascot({ type, className = '', mood = 'idle' }) {
  const color = palette[type]
  return <svg className={`living-mascot living-mascot--${type} living-mascot--${mood} ${className}`} viewBox="0 0 180 200" role="img" aria-label={{organik:'Si Orgi',anorganik:'Si Rino',b3:'Si Bebe',kertas:'Si Kiki',residu:'Si Resi'}[type]}>
    <g stroke={ink} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
      <g className="mascot-arm mascot-arm--left"><path d="M43 108 Q21 93 19 113" fill="none"/><circle cx="19" cy="115" r="8" fill={color}/></g>
      <g className="mascot-arm mascot-arm--right"><path d="M137 108 Q159 93 161 113" fill="none"/><circle cx="161" cy="115" r="8" fill={color}/></g>
      <path d="M64 162 L59 183 Q57 189 72 188 L82 171 M116 162 L121 183 Q123 189 108 188 L98 171" fill={color}/>
      <g className="mascot-body"><path d="M40 67 Q40 49 58 49 H122 Q140 49 140 67 L134 153 Q131 173 110 173 H70 Q49 173 46 153Z" fill={color}/></g>
      <g className="mascot-lid"><path d="M37 66 Q35 55 49 53 H131 Q145 55 143 66 Q142 75 133 75 H47 Q38 75 37 66Z" fill={color}/></g>
      {type === 'organik' && <g className="mascot-tell"><path d="M88 50 Q56 44 65 18 Q87 19 88 50Z" fill="#95E887"/><path d="M90 48 Q94 16 119 15 Q115 42 90 48Z" fill="#78DB83"/><path d="M88 47 Q88 35 80 28" fill="none" strokeWidth="3"/></g>}
      {type === 'anorganik' && <><g className="mascot-tell"><path d="M90 50 V26" fill="none"/><circle cx="90" cy="20" r="8" fill="#EF7974"/></g><path d="M88 129 L95 129 L90 139 L98 139" fill="none" strokeWidth="4"/></>}
      {type === 'b3' && <><path d="M55 52 Q58 17 90 17 Q122 17 125 52Z" fill="#FFDB6D"/><path d="M53 44 H127" fill="none"/><g className="mascot-tell"><path d="M54 92 H126" strokeWidth="3" fill="none"/><rect x="52" y="86" width="32" height="22" rx="9" fill="#D9F1FB"/><rect x="96" y="86" width="32" height="22" rx="9" fill="#D9F1FB"/></g></>}
      {type === 'kertas' && <><g className="mascot-tell"><path d="M68 49 V20 Q80 14 90 23 Q100 14 112 20 V49 Q100 44 90 50 Q80 44 68 49Z" fill="#FFFDF7"/><path d="M90 23 V48" fill="none" strokeWidth="3"/></g><path d="M63 127 L71 138 M71 127 L63 138" fill="none" strokeWidth="3"/></>}
      {type === 'residu' && <><g className="mascot-tell"><path d="M51 51 L57 33 L69 38 L75 25 L88 35 L99 24 L107 40 L124 34 L130 51Z" fill="#B9C5CC"/></g><path d="M113 125 L122 132 L113 138" fill="none" strokeWidth="3"/></>}
      <g className="mascot-eyes" stroke="none" fill={ink}><ellipse cx="70" cy="103" rx="5" ry="8"/><ellipse cx="110" cy="103" rx="5" ry="8"/></g>
      <path d="M79 123 Q90 135 101 123" fill="none" strokeWidth="4"/>
      <circle cx="55" cy="121" r="6" fill="#FFB2A1" stroke="none"/><circle cx="125" cy="121" r="6" fill="#FFB2A1" stroke="none"/>
    </g>
  </svg>
}

export const Orgi = props => <Mascot type="organik" {...props}/>
export const Rino = props => <Mascot type="anorganik" {...props}/>
export const Bebe = props => <Mascot type="b3" {...props}/>
export const Kiki = props => <Mascot type="kertas" {...props}/>
export const Resi = props => <Mascot type="residu" {...props}/>
export const Mascots = { organik: Orgi, anorganik: Rino, b3: Bebe, kertas: Kiki, residu: Resi }

export function Earth({ className = '' }) {
  return <svg className={className} viewBox="0 0 300 300" role="img" aria-label="Bumi tersenyum"><circle cx="150" cy="150" r="123" fill="#75C8F0" stroke={ink} strokeWidth="7"/><path d="M51 88 Q79 70 96 88 L106 108 L91 125 L104 146 L85 166 L61 156 L42 137 M135 30 Q155 31 160 46 L184 47 L200 68 L187 85 L159 86 L149 104 L122 94 L113 70Z M220 84 Q270 103 269 143 Q243 155 226 135 L207 119Z M93 214 Q115 197 138 209 L148 230 L178 236 L190 260 Q132 283 93 248Z" fill="#80CF86" stroke={ink} strokeWidth="5" strokeLinejoin="round"/><path d="M105 157 Q110 144 119 157 M182 157 Q187 144 196 157 M134 183 Q151 204 169 183" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round"/><circle cx="104" cy="179" r="10" fill="#F9A9A1"/><circle cx="197" cy="179" r="10" fill="#F9A9A1"/></svg>
}
