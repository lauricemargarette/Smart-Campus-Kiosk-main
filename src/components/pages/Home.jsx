import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FLOOR_BLOCKS, FLOOR_LABELS } from '../../data/campusData'
import icctLogo from '../../assets/icct-logo.png'
import campusPhoto from '../../assets/icct-campus.jpg'
import { useTheme } from '../../theme'

const POPULAR = ["Registrar's Office", 'Library', 'Admission Office', 'Guidance Office', 'Accounting Office', 'Student Affairs Office', 'The Theatre Room', 'TBA']
const ALL_LOCATIONS = [
  'Registrar - Window 1', 'Registrar - Window 2', 'Registrar - Window 3', 'Library', 'Canteen', 'Guidance Office', 'Accounting', 'Deans Office',
  'Registrar - Window 4', 'Registrar - Window 5', 'Registrar - Window 6', 'Registrar - Window 7', 'Registrar - Window 8', 'Registrar - Window 9',
  'Registrar - Window 12', 'Registrar - Window 14', 'Registrar - Window 15', "Registrar's Office", 'CDJP Office', 'Guidance Office', 'NSTP Office',
  'Student Affairs Office', 'The Theatre Room', 'Computer Laboratory 1', 'Exit', 'Accounting Office', 'Accounting - Window 1', 'Accounting - Window 2',
  'Accounting - Window 3', 'Accounting - Window 4', 'Accounting - Window 5', 'Accounting - Window 6', 'Accounting - Window 7', 'Accounting - Window 8',
  'Accounting - Window 9', 'HRM Tools & Equipment', 'B2.11', 'B2.12', 'Supply Section', 'Admission Office', 'Clinic', 'Testing Room', 'Drug Testing Center',
  'Social Lounge', 'B4.13', 'B4.14', 'Office of the College Deans and Academic Coordinators', 'Faculty Room & Lounge', 'Academic Affairs Office', 'Online Teaching Hub',
  'B1.21', 'Multi-Purpose Academic Hall', 'Office of the College Deans', 'B2.21', 'B2.22', 'B2.23', 'B2.24', 'B2.25', 'B2.26', 'MIS Faculty', 'MIS Department',
  'Broadcasting Room', 'Media Arts Center', 'Office of the Chairman', 'Boardroom', 'B4.21', 'B4.22', 'B4.23', 'B4.24', 'B4.25', "Men's CR (2F)", "Ladies' CR (B2-2F)",
  "Ladies' CR (B4-2F)", 'Volleyball / Badminton Court', 'Administration & Human Resources Office (AHRO)', 'Special Projects Affiliations & Marketing Office (SPAMO)',
  'B2.31', 'B2.32', 'B2.33', 'B2.34', 'B2.35', 'B2.36', 'B2.37', 'B2.38', 'Basketball Court', 'Varsity Room - Male', 'Varsity Room - Female', "Ladies' CR (B2-4F)",
  'B4.31', 'B4.32', 'B4.33', 'B4.34', 'B4.35', 'B4.36', 'B4.37', 'B4.38', "Ladies' CR (B2-3F)", "Ladies' CR (B4-3F)", "Men's CR (3F)", 'Study Hall',
  'B2.41', 'B2.42', 'B2.43', 'B2.44', 'B2.45', 'B2.46', 'B2.47', 'B2.48', 'B4.41', 'B4.42', 'B4.43', 'B4.44', 'B4.45', 'B4.46', 'B4.47', 'B4.48', "Ladies' CR (B4-4F)",
  "Men's CR (4F)", 'B2.51', 'B2.52', 'B2.53', 'B2.54', 'B2.55', 'B2.56', 'B2.57', 'B2.58', 'B4.51', 'B4.52', 'B4.53', 'B4.54', 'B4.55', 'B4.56', 'B4.57', 'B4.58',
  "Ladies' CR (B2-5F)", "Ladies' CR (B4-5F)", "Men's CR (5F)", 'Female Dressing Room', 'Male Dressing Room', 'P.E. Faculty Room', 'P.E. Gymnasium', 'ISHTM Hotel Simulation Laboratory',
  'The Theatre Room - Balcony', 'Food Court'
]
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '-', '.'],
]
const NUMBER_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

// ---- Line icons - minimalist stroke style, no fill ------------
const Icon = {
  Search: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Pin: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Columns: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6"/>
    </svg>
  ),
  Monitor: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  Building: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="7" x2="9" y2="7.01"/><line x1="15" y1="7" x2="15" y2="7.01"/>
      <line x1="9" y1="12" x2="9" y2="12.01"/><line x1="15" y1="12" x2="15" y2="12.01"/><path d="M9 22v-4h6v4"/>
    </svg>
  ),
  Flask: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2v6L3.5 18.5A2 2 0 0 0 5.3 21h13.4a2 2 0 0 0 1.8-2.5L15 8V2"/><line x1="8" y1="2" x2="16" y2="2"/><line x1="8.5" y1="13" x2="15.5" y2="13"/>
    </svg>
  ),
  Close: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Flame: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17a2.5 2.5 0 0 0 2.5-2.5c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7.5 7.5 0 1 1-15 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  ),
  Tag: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  Sun: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.5"/>
      <line x1="12" y1="2" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="22" y2="12"/>
      <line x1="4.6" y1="4.6" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.4" y2="19.4"/>
      <line x1="4.6" y1="19.4" x2="6.3" y2="17.7"/><line x1="17.7" y1="6.3" x2="19.4" y2="4.6"/>
    </svg>
  ),
  Moon: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7.2 7.2 0 0 0 9.8 9.8z"/>
    </svg>
  ),
}

// ---- Building configuration — name, color, icon, floors, and mini-map viewbox for floor plan cropping ----
const BUILDINGS = [
  { id: 'Building 1', short: 'B1', color: '#0e417b', glow: 'rgba(74,144,226,0.30)',  Icon: Icon.Building, floors: [1,2,3,4] },
  { id: 'Building 2', short: 'B2', color: '#a09363', glow: 'rgba(245,197,24,0.30)',  Icon: Icon.Building, floors: [1,2,3,4,5,6] },
  { id: 'Building 3', short: 'B3', color: '#317633', glow: 'rgba(76,175,80,0.30)',   Icon: Icon.Building, floors: [1,2,3,4] },
  { id: 'Building 4', short: 'B4', color: '#7c3785', glow: 'rgba(226,85,85,0.30)',   Icon: Icon.Building, floors: [1,2,3,4,5,6,7] },
]

const BUILDING_VIEWBOX = {
  'Building 1': { x: 11.5, y: 11, w: 10, h: 10 },
  'Building 2': { x: 11.5, y: 0,  w: 10, h: 10 },
  'Building 3': { x: 0.5,  y: 11, w: 10, h: 10 },
  'Building 4': { x: 0.5,  y: 0,  w: 10, h: 10 },
}

// ---- Theme Toggle — sliding pill switch ----
function ThemeToggle({ theme, onToggle }) {
  const isDark = theme.mode === 'dark'
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle() }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        position: 'relative',
        width: '64px', height: '34px',
        borderRadius: '20px',
        background: theme.toggleTrackBg,
        border: `1px solid ${theme.toggleTrackBorder}`,
        backdropFilter: 'blur(8px)',
        cursor: 'pointer',
        padding: 0,
        flexShrink: 0,
        transition: 'background 0.25s, border-color 0.25s',
      }}
    >
      <span style={{
        position: 'absolute', top: '3px', left: isDark ? '32px' : '3px',
        width: '26px', height: '26px', borderRadius: '50%',
        background: theme.toggleKnobBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: theme.toggleIconColor,
        transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
      }}>
        {isDark ? <Icon.Moon size={15}/> : <Icon.Sun size={15}/>}
      </span>
    </button>
  )
}

// ---- Mini Building Map ----
function MiniBuildingMap({ buildingName, floor, color, theme }) {
  const blocks = FLOOR_BLOCKS[floor] || FLOOR_BLOCKS[1]
  const region = BUILDING_VIEWBOX[buildingName]
  if (!region) return null

  const W = 260, H = 200, PAD = 8
  const sx = x => PAD + ((x - region.x) / region.w) * (W - PAD * 2)
  const sy = y => PAD + ((y - region.y) / region.h) * (H - PAD * 2)

  const buildingBlocks = blocks.filter(b => {
    if (b.label === buildingName) return true
    if (b.type === 'building' || b.type === 'hallway') return false
    const bRight = b.x + b.w, bBottom = b.y + b.h
    const rRight = region.x + region.w, rBottom = region.y + region.h
    return b.x < rRight && bRight > region.x && b.y < rBottom && bBottom > region.y
  })

  const isDark = theme.mode === 'dark'
  // Room fills come from the shared theme module (theme.roomFillByType) so
  // this mini-map and the full CampusMap on MapPage always agree on colors.
  const typeFill = theme.roomFillByType || {}
  const labelColor = isDark ? '#3a7a8e' : '#5b7d8c'
  const gridStroke = isDark ? '#1e3a48' : '#c3d2dd'

  function roomLabel(label, bw, bh) {
    if (!label || label.trim() === '') return { lines: [], fontSize: 6, lineH: 8 }
    const fontSize = Math.max(4.5, Math.min(7, bw / 10))
    const charsPerLine = Math.max(4, Math.floor(bw / (fontSize * 0.58)))
    const maxLines = Math.max(1, Math.floor(bh / (fontSize + 2.5)))
    const words = label.split(' ')
    const lines = []
    let cur = ''
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w
      if (test.length > charsPerLine && cur) { lines.push(cur); cur = w } else cur = test
    }
    if (cur) lines.push(cur)
    return { lines: lines.slice(0, maxLines), fontSize, lineH: fontSize + 2.5 }
  }

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', background: theme.miniMapBg, borderRadius: 8 }}>
      <rect x={PAD} y={PAD} width={W-PAD*2} height={H-PAD*2} rx="4" fill={theme.miniMapBg} stroke={color} strokeWidth="1.5"/>
      {buildingBlocks.filter(b => b.label !== buildingName).map((b, i) => {
        const bx=sx(b.x), by=sy(b.y), bw=sx(b.x+b.w)-sx(b.x), bh=sy(b.y+b.h)-sy(b.y)
        if (bw < 2 || bh < 2) return null
        const fill = typeFill[b.type] || (isDark ? '#0d2030' : '#e3ecf3')
        const stroke = b.type==='stairs' ? color+'88' : b.type==='elevator' ? color : gridStroke
        const cx=bx+bw/2, cy=by+bh/2
        const {lines, fontSize, lineH} = roomLabel(b.label, bw, bh)
        const totalH=lines.length*lineH, startY=cy-totalH/2+lineH/2
        return (
          <g key={i}>
            <rect x={bx} y={by} width={bw} height={bh} rx="2" fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.95"/>
            {bw>14 && bh>8 && lines.map((line,li) => (
              <text key={li} x={cx} y={startY+li*lineH} textAnchor="middle" dominantBaseline="middle"
                style={{fontSize, fill:labelColor, fontFamily:'monospace', pointerEvents:'none', userSelect:'none'}}>{line}</text>
            ))}
          </g>
        )
      })}
      <text x={W/2} y={H/2} textAnchor="middle" dominantBaseline="middle"
        style={{fontSize:48, fill:color, fontFamily:'monospace', fontWeight:700, opacity:0.06, pointerEvents:'none', userSelect:'none'}}>
        {buildingName.replace('Building ','B')}
      </text>
      <text x={W-PAD-2} y={H-PAD-2} textAnchor="end" dominantBaseline="auto"
        style={{fontSize:8, fill:color, fontFamily:'monospace', fontWeight:700, opacity:0.7}}>
        {FLOOR_LABELS[floor] || `Floor ${floor}`}
      </text>
    </svg>
  )
}

// ---- Flip Card — glassmorphism ----
function BuildingCard({ building, theme }) {
  const [flipped, setFlipped] = useState(false)
  const [activeFloor, setActiveFloor] = useState(1)
  const CardIcon = building.Icon
  const isDark = theme.mode === 'dark'

  return (
    <div
      style={{ width: '100%', height: '100%', perspective: '1000px', cursor: 'pointer' }}
      onClick={() => setFlipped(f => !f)}
    >
      <style>{`
        .card-inner {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-inner.flipped { transform: rotateY(180deg); }
        .card-face {
          position: absolute; inset: 0;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 20px;
          overflow: hidden;
        }
        .card-back { transform: rotateY(180deg); }
      `}</style>

      <div className={`card-inner${flipped ? ' flipped' : ''}`}>

        {/* ── Front — glass ── */}
        <div className="card-face" style={{
          background: isDark
            ? `linear-gradient(135deg, ${building.color}14 0%, rgba(7,24,46,0.65) 60%)`
            : `linear-gradient(135deg, ${building.color}10 0%, rgba(255,255,255,0.7) 60%)`,
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          border: `1px solid ${theme.glassBorder}`,
          boxShadow: `0 8px 28px ${building.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${building.color}99, transparent)` }} />
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${building.color}1a 0%, transparent 60%)`, pointerEvents: 'none' }} />

          <div style={{ marginBottom: '16px', position: 'relative', color: building.color }}>
            <CardIcon size={42}/>
          </div>
          <div style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '1px', fontFamily: "'Inter',sans-serif", color: building.color, lineHeight: 1, marginBottom: '8px', position: 'relative', textShadow: isDark ? `0 0 16px ${building.color}66` : 'none' }}>{building.short}</div>
          <div style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '500', marginBottom: '20px', position: 'relative' }}>{building.id}</div>
          <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", fontWeight: '600', color: building.color + 'cc', position: 'relative' }}>Tap to see map</div>
        </div>

        {/* ── Back — glass ── */}
        <div className="card-face card-back" style={{
          background: theme.cardBackBg,
          backdropFilter: 'blur(22px) saturate(160%)',
          WebkitBackdropFilter: 'blur(22px) saturate(160%)',
          border: `1px solid ${theme.cardBackBorder}`,
          boxShadow: theme.cardBackShadow,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${building.color}99, transparent)`, flexShrink: 0 }} />

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px 10px', borderBottom: `1px solid ${theme.glassBorder}`, flexShrink: 0,
          }}>
            <span style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.5px', fontFamily: "'Inter',sans-serif", color: building.color }}>{building.id}</span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap', justifyContent: 'flex-end', maxWidth: '160px' }}>
              {building.floors.map(f => (
                <button key={f}
                  onClick={e => { e.stopPropagation(); setActiveFloor(f) }}
                  style={{
                    background: activeFloor === f ? building.color : theme.chipBg,
                    backdropFilter: activeFloor === f ? 'none' : 'blur(4px)',
                    border: `1px solid ${activeFloor === f ? building.color : theme.glassBorder}`,
                    borderRadius: '8px',
                    color: activeFloor === f ? '#04141f' : theme.textMuted,
                    fontSize: '10px', fontWeight: '700',
                    padding: '4px 8px', cursor: 'pointer',
                    fontFamily: "'Inter',sans-serif", transition: 'all 0.15s',
                  }}
                >
                  {f === 1 ? 'GF' : `${f}F`}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, padding: '8px', minHeight: 0, overflow: 'hidden' }}>
            <MiniBuildingMap buildingName={building.id} floor={activeFloor} color={building.color} theme={theme}/>
          </div>

          <div style={{
            textAlign: 'center', padding: '6px 0 10px',
            fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
            fontFamily: "'Inter',sans-serif", fontWeight: '600', color: building.color + '99', flexShrink: 0,
          }}>
            Tap to flip back
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Main Home ──────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [time, setTime] = useState(new Date())
  const [capsOn, setCapsOn] = useState(true)
  const [showKeyboard, setShowKeyboard] = useState(false)

  // Theme: shared across pages via the theme module — dark by default,
  // persisted to localStorage, and live-synced with any other page
  // (e.g. MapPage) that's also using useTheme().
  const { theme, toggleTheme } = useTheme()

  const recommendations = useMemo(() => {
  const query = search.trim().toLowerCase()
  if (query.length < 2) return []  // need at least 2 chars
  const startsWith = ALL_LOCATIONS.filter(loc =>
    loc.toLowerCase().startsWith(query)
  )
  const contains = ALL_LOCATIONS.filter(loc =>
    !loc.toLowerCase().startsWith(query) &&
    loc.toLowerCase().includes(query)
  )
  return [...startsWith, ...contains].slice(0, 12) // max 12 results
}, [search])

  const backspacePressTimer = useRef(null)
  const backspaceHoldTimer = useRef(null)
  const isHolding = useRef(false)
  const isPressing = useRef(false)
  const longPressTimer = useRef(null)

  useEffect(() => {
    if (!document.getElementById('inter-font')) {
      const link = document.createElement('link')
      link.id = 'inter-font'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const longPressTimerId = longPressTimer.current
    const backspacePressTimerId = backspacePressTimer.current
    const backspaceHoldTimerId = backspaceHoldTimer.current

    return () => {
      clearTimeout(longPressTimerId)
      clearTimeout(backspacePressTimerId)
      clearTimeout(backspaceHoldTimerId)
    }
  }, [])

  const handleCornerPressStart = (e) => {
    e.preventDefault()
    longPressTimer.current = setTimeout(() => navigate('/admin'), 5000)
  }
  const handleCornerPressEnd = () => clearTimeout(longPressTimer.current)

  const formatTime = (date) => date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const formatDate = (date) => date.toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const handleSearch = (term) => {
    const resolved = term === 'TBA' ? 'Exit' : term
    setSearch(resolved)
    setIsSearching(false)
    setShowKeyboard(false)
    navigate(`/map?destination=${encodeURIComponent(resolved)}`)
  }

  const handleKey = (key) => {
    const char = capsOn ? key.toUpperCase() : key.toLowerCase()
    setSearch(prev => prev + char)
  }

  const handleNumber = (num) => setSearch(prev => prev + num)

  const handleBackspace = useCallback(() => {
    setSearch(prev => prev.slice(0, -1))
  }, [])

  const handleClear = () => { setSearch(''); }
  const handleOutsideClick = () => { setIsSearching(false); setShowKeyboard(false) }

  const handleBackspaceDown = (e) => {
    e.preventDefault()
    isHolding.current = false
    isPressing.current = true
    backspacePressTimer.current = setTimeout(() => {
      isHolding.current = true
      setSearch('');
    }, 600)
  }

  const handleBackspaceUp = (e) => {
    e.preventDefault()
    if (!isPressing.current) return   // ← key guard: ignore stray "up" events
    isPressing.current = false

    clearTimeout(backspacePressTimer.current)
    clearTimeout(backspaceHoldTimer.current)
    if (!isHolding.current) handleBackspace()
    isHolding.current = false
  }

  const s = getStyles(theme)

  return (
    <div style={s.page}>

      {/* Background: campus photo + dark overlay gradient — gives glass real texture */}
      <div style={s.ambientWrap}>
        <img src={campusPhoto} alt="" style={s.campusBg}/>
        <div style={s.campusOverlay}/>
        <div style={s.ambient1}/>
        <div style={s.ambient2}/>
        <div style={s.ambient3}/>
      </div>

      {/* ── Header — glass, real logo, true-centered title ── */}
      <div style={s.header}>
        <div
          onMouseDown={handleCornerPressStart} onMouseUp={handleCornerPressEnd}
          onMouseLeave={handleCornerPressEnd} onTouchStart={handleCornerPressStart}
          onTouchEnd={handleCornerPressEnd} style={s.logoBox}
        >
          <img src={icctLogo} alt="ICCT Colleges" style={s.logoImg}/>
        </div>
        <div style={s.kioskName}>
          <div style={s.kioskTextBlock}>
            <span style={s.kioskTitle}>Smart Campus Navigator</span>
            <span style={s.kioskSub}>ICCT Colleges · Cainta, Rizal</span>
          </div>
        </div>
        <div style={s.headerRight}>
          <div style={s.dateTime}>
            <span style={s.timeText}>{formatTime(time)}</span>
            <span style={s.timeDivider}>|</span>
            <span style={s.dateText}>{formatDate(time)}</span>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme}/>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={s.main} onClick={handleOutsideClick}>
        <div style={s.topSection}>
          <div style={s.headingBlock}>
            <h1 style={s.heading}>Where would you like to go?</h1>
          </div>

          {/* Search bar — glass */}
          <div
            style={{ ...s.searchBox, ...(isSearching ? s.searchBoxActive : {}) }}
            onClick={(e) => { e.stopPropagation(); setIsSearching(true); setShowKeyboard(true) }}
          >
            <span style={{ color: theme.textMuted, display: 'flex', alignItems: 'center' }}><Icon.Search size={22}/></span>
            <span style={{ flex: 1, fontSize: '20px', color: search ? theme.textPrimary : theme.textMuted, fontFamily: "'Inter',sans-serif" }}>
              {search || 'Tap here to search for a location...'}
            </span>
            {search.length > 0 && (
              <button onMouseDown={(e) => { e.preventDefault(); handleClear() }} style={s.clearBtn}><Icon.Close size={18}/></button>
            )}
          </div>

          {/* Dropdown — glass */}
          {showKeyboard && (
            <div style={s.dropdown} onClick={(e) => e.stopPropagation()}>
              {recommendations.length > 0 ? (
                <div style={s.dropSection}>
                  <p style={s.dropLabel}><Icon.Pin size={13}/> Suggestions</p>
                  <div style={s.chipRow}>
                    {recommendations.map((r) => (
                      <button key={r} onMouseDown={(e) => { e.preventDefault(); handleSearch(r) }} style={s.recoChip}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div style={s.dropSection}>
                    <p style={s.dropLabel}><Icon.Flame size={13}/> Popular Locations</p>
                    <div style={s.chipRow}>
                      {POPULAR.map((place) => (
                        <button key={place} onMouseDown={(e) => { e.preventDefault(); handleSearch(place) }} style={s.chip}>{place}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Persistent search pill */}
          {!isSearching && search.length > 0 && (
            <div style={s.persistRow}>
              <span style={s.persistLabel}>Searching for:</span>
              <span style={s.persistPill}>{search}</span>
              <button onMouseDown={(e) => { e.preventDefault(); handleClear() }} style={s.persistClear}>Clear</button>
            </div>
          )}
        </div>

        {/* ── Building Cards ── */}
        {!showKeyboard && (
          <div style={s.cardsSection} onClick={(e) => e.stopPropagation()}>
            <p style={s.cardsLabel}><Icon.Pin size={14}/> Browse by Building</p>
            <div style={s.cardsGrid}>
              {BUILDINGS.map(b => (
                <BuildingCard key={b.id} building={b} theme={theme}/>
              ))}
            </div>
          </div>
        )}

        {/* ── Virtual Keyboard — glass ── */}
        {isSearching && (
          <div style={s.keyboard} onClick={(e) => e.stopPropagation()}>
            <div style={s.keyRow}>
              {NUMBER_ROW.map((num) => (
                <button key={num} onMouseDown={(e) => { e.preventDefault(); handleNumber(num) }} style={s.key}>{num}</button>
              ))}
            </div>
            {KEYBOARD_ROWS.map((row, i) => (
              <div key={i} style={s.keyRow}>
                {row.map((key) => (
                  <button key={key} onMouseDown={(e) => { e.preventDefault(); handleKey(key) }} style={s.key}>
                    {capsOn ? key.toUpperCase() : key.toLowerCase()}
                  </button>
                ))}
              </div>
            ))}
            <div style={s.keyRow}>
              <button onMouseDown={(e) => { e.preventDefault(); setCapsOn(p => !p) }}
                style={{ ...s.key, ...s.keyCaps, ...(capsOn ? s.keyCapsActive : {}) }}>
                {capsOn ? '⬆ ABC' : '⬆ abc'}
              </button>
              <button onMouseDown={handleBackspaceDown} onMouseUp={handleBackspaceUp}
                onMouseLeave={handleBackspaceUp} onTouchStart={handleBackspaceDown} onTouchEnd={handleBackspaceUp}
                style={{ ...s.key, ...s.keyWide }}>⌫</button>
              <button onMouseDown={(e) => { e.preventDefault(); handleKey(' ') }}
                style={{ ...s.key, ...s.keySpace }}>SPACE</button>
              <button onMouseDown={(e) => { e.preventDefault(); if (search.trim()) handleSearch(search.trim()) }}
                style={{ ...s.key, ...s.keySearch, ...(search.trim() ? {} : s.keySearchDisabled) }}>
                SEARCH
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Styles are derived from the active theme so every surface in the
// page (header, search, dropdown, keyboard, cards) re-themes together. ----
const getStyles = (theme) => ({
  page: {
    background: theme.pageBg,
    height: '100vh', width: '100%', color: theme.textPrimary, display: 'flex', flexDirection: 'column',
    overflow: 'hidden', position: 'relative', fontFamily: "'Inter',system-ui,sans-serif",
    transition: 'background 0.3s, color 0.3s',
  },

  ambientWrap: { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' },
  campusBg: {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover', opacity: theme.campusOpacity, filter: theme.campusFilter,
    transition: 'opacity 0.3s, filter 0.3s',
  },
  campusOverlay: {
    position: 'absolute', inset: 0,
    background: theme.campusOverlay,
    transition: 'background 0.3s',
  },
  ambient1: { position: 'absolute', width: '480px', height: '480px', borderRadius: '50%', background: `radial-gradient(circle, ${theme.ambient1} 0%, transparent 70%)`, top: '-12%', left: '-6%', filter: 'blur(60px)' },
  ambient2: { position: 'absolute', width: '420px', height: '420px', borderRadius: '50%', background: `radial-gradient(circle, ${theme.ambient2} 0%, transparent 70%)`, bottom: '-12%', right: '8%', filter: 'blur(65px)' },
  ambient3: { position: 'absolute', width: '360px', height: '360px', borderRadius: '50%', background: `radial-gradient(circle, ${theme.ambient3} 0%, transparent 70%)`, top: '35%', right: '25%', filter: 'blur(70px)' },

  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 28px',
    background: theme.headerBg,
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    borderBottom: `1px solid ${theme.headerBorder}`,
    flexShrink: 0, position: 'relative', zIndex: 2,
    transition: 'background 0.3s, border-color 0.3s',
  },
  logoBox: { cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' },
  logoImg: { height: '72px', width: 'auto', display: 'block', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' },
  kioskName: { display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' },
  kioskTextBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  kioskTitle: { fontSize: '24px', fontWeight: '700', color: theme.textPrimary, fontFamily: "'Inter',sans-serif", letterSpacing: '-0.3px' },
  kioskSub:   { fontSize: '12px', color: theme.textMuted, marginTop: '2px', fontFamily: "'Inter',sans-serif", letterSpacing: '0.3px' },
  headerRight:{ display: 'flex', alignItems: 'center', gap: '18px' },
  dateTime:   { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px' },
  timeText:   { fontSize: '26px', fontWeight: '600', color: theme.accentSoft, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.5px', fontFamily: "'Inter',sans-serif" },
  timeDivider:{ fontSize: '18px', color: theme.headerBorder, fontWeight: '300' },
  dateText:   { fontSize: '16px', color: theme.textMuted, fontWeight: '400', fontFamily: "'Inter',sans-serif" },

  main: { flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem', overflow: 'hidden', gap: '10px', position: 'relative', zIndex: 1 },
  topSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' },
  heading: { fontSize: '48px', fontWeight: '600', textAlign: 'center', margin: 10, fontFamily: "'Inter',sans-serif", letterSpacing: '-1px', color: theme.textPrimary },
  headingBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.3rem', marginBottom: '0.5rem' },

  searchBox: {
    display: 'flex', alignItems: 'center',
    background: theme.glassBg,
    backdropFilter: 'blur(20px) saturate(160%)',
    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
    border: `1px solid ${theme.glassBorder}`,
    borderRadius: '50px', padding: '16px 28px', gap: '14px',
    width: '100%', maxWidth: '960px', cursor: 'pointer',
    marginBottom: '0.75rem', minHeight: '64px',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
    boxShadow: theme.glassShadow,
  },
  searchBoxActive: { border: `1px solid ${theme.accent}99`, background: theme.glassBgActive, boxShadow: theme.glassShadow },
  clearBtn: { background: 'transparent', border: 'none', color: theme.textMuted, cursor: 'pointer', padding: '4px 8px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  persistRow:   { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' },
  persistLabel: { fontSize: '13px', color: theme.textMuted, fontFamily: "'Inter',sans-serif" },
  persistPill:  { background: theme.accent + '26', backdropFilter: 'blur(8px)', border: `1px solid ${theme.accent}80`, borderRadius: '20px', padding: '4px 16px', fontSize: '15px', color: theme.accentText, fontFamily: "'Inter',sans-serif" },
  persistClear: { background: 'transparent', border: `1px solid ${theme.glassBorder}`, borderRadius: '20px', padding: '4px 12px', fontSize: '13px', color: theme.textMuted, cursor: 'pointer', fontFamily: "'Inter',sans-serif" },

  dropdown: {
    position: 'absolute', top: '100%', left: 0, right: 0,
    maxWidth: '960px', margin: '4px auto 0',
    background: theme.dropdownBg,
    backdropFilter: 'blur(28px) saturate(160%)',
    WebkitBackdropFilter: 'blur(28px) saturate(160%)',
    border: `1px solid ${theme.glassBorder}`,
    borderRadius: '20px', padding: '0.75rem 1.25rem',
    boxShadow: theme.dropdownShadow,
    zIndex: 10, maxHeight: '200px', overflowY: 'auto',
  },
  dropSection: { marginBottom: '0.75rem' },
  dropLabel: { fontSize: '13px', color: theme.textMuted, marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  chip: { background: theme.chipBg, backdropFilter: 'blur(8px)', border: `1px solid ${theme.chipBorder}`, borderRadius: '24px', padding: '10px 20px', color: theme.chipText, fontSize: '17px', cursor: 'pointer', minHeight: '44px', fontFamily: "'Inter',sans-serif" },
  recoChip: { background: theme.accent + '26', backdropFilter: 'blur(8px)', border: `1px solid ${theme.accent}66`, borderRadius: '24px', padding: '7px 16px', color: theme.accentText, fontSize: '15px', cursor: 'pointer', minHeight: '44px', fontFamily: "'Inter',sans-serif" },

  cardsSection: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 0, paddingTop: '0.25rem' },
  cardsLabel: { fontSize: '13px', letterSpacing: '2px', color: theme.textMuted, textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", fontWeight: '700', marginBottom: '20px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', width: '100%', flex: 1, minHeight: 0, maxHeight: '480px' },

  keyboard: {
    width: '100%',
    background: theme.keyboardBg,
    backdropFilter: 'blur(22px) saturate(160%)',
    WebkitBackdropFilter: 'blur(22px) saturate(160%)',
    border: `1px solid ${theme.keyboardBorder}`,
    borderRadius: '20px', padding: '0.85rem 1rem', flexShrink: 0, marginTop: 'auto',
    boxShadow: theme.keyboardShadow,
  },
  keyRow: { display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '6px' },
  key: {
    background: theme.keyBg, backdropFilter: 'blur(8px)',
    border: `1px solid ${theme.keyBorder}`, borderRadius: '20px', color: theme.keyText,
    fontSize: '23px', fontWeight: '600', padding: '16px 0', flex: 1, maxWidth: '180px',
    cursor: 'pointer', fontFamily: "'Inter',sans-serif", transition: 'background 0.08s, transform 0.08s',
    minHeight: '80px',
  },
  keyCaps:        { maxWidth: '106px', color: theme.textMuted },
  keyCapsActive:  { background: theme.accent + '40', border: `1px solid ${theme.accent}80`, color: theme.accentText },
  keyWide:        { maxWidth: '106px' },
  keySpace:       { maxWidth: '340px' },
  keySearch:      { maxWidth: '150px', background: 'linear-gradient(135deg, #5B8DEF, #A78BFA)', border: 'none', color: '#04141f', fontWeight: '700', backdropFilter: 'none' },
  keySearchDisabled: { background: theme.chipBg, border: `1px solid ${theme.glassBorder}`, color: theme.textMuted, cursor: 'not-allowed' },
})