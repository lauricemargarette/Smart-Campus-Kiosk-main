import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  LOCATIONS, EDGES, FLOOR_BLOCKS, FLOOR_LABELS,
  TYPE_META, KIOSK_NODE_ID, SCALE,
  sx, sy, findLocationByName, fetchNavigation,
} from '../../data/campusData'
import icctLogo from '../../assets/icct-logo.png'
import { useTheme } from '../../theme'

// ----Line icons ----
const Icon = {
  Home: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>
    </svg>
  ),
  Pin: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  List: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  Image: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
    </svg>
  ),
  QrCode: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><line x1="14" y1="14" x2="14" y2="14.01"/>
      <line x1="14" y1="21" x2="14" y2="21.01"/><line x1="21" y1="14" x2="21" y2="14.01"/>
      <line x1="21" y1="21" x2="21" y2="21.01"/><line x1="17.5" y1="17.5" x2="17.5" y2="17.51"/>
    </svg>
  ),
  Map: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  ),
  AlertTriangle: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Flag: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22V4a1 1 0 0 1 1-1h13.5a.5.5 0 0 1 .4.8L15 9l3.9 5.2a.5.5 0 0 1-.4.8H5"/>
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

// ---- Theme Toggle ----
function ThemeToggle({ theme, onToggle }) {
  const isDark = theme.mode === 'dark'
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        position: 'relative',
        width: '56px', height: '30px',
        borderRadius: '18px',
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
        position: 'absolute', top: '3px', left: isDark ? '28px' : '3px',
        width: '22px', height: '22px', borderRadius: '50%',
        background: theme.toggleKnobBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: theme.toggleIconColor,
        transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
      }}>
        {isDark ? <Icon.Moon size={13}/> : <Icon.Sun size={13}/>}
      </span>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
//  QR CODE
// ─────────────────────────────────────────────────────────────
function makeQR(text, size = 21) {
  const seed = text.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7)
  return Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      if (r < 7 && c < 7) return (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4))
      if (r < 7 && c > size - 8) return (r === 0 || r === 6 || c === size - 1 || c === size - 7 || (r >= 2 && r <= 4 && c >= size - 5 && c <= size - 3))
      if (r > size - 8 && c < 7) return (r === size - 1 || r === size - 7 || c === 0 || c === 6 || (r >= size - 5 && r <= size - 3 && c >= 2 && c <= 4))
      return ((seed * (r + 1) * (c + 3) + r * 7 + c * 13) % 5) < 2
    })
  )
}

function QRCode({ value, size = 80 }) {
  const grid = useMemo(() => makeQR(String(value)), [value])
  const cell = size / grid.length
  return (
    <svg width={size} height={size}
      style={{ background: 'white', borderRadius: 6, display: 'block', flexShrink: 0 }}>
      {grid.map((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c*cell} y={r*cell} width={cell} height={cell} fill="#111"/> : null
        )
      )}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
//  ROOM PHOTO PLACEHOLDER
// ─────────────────────────────────────────────────────────────
function RoomPhoto({ location, theme }) {
  const [imgError, setImgError] = useState(false)
  const hasImage = location?.image_url && !imgError
  const ps = getPhotoStyles(theme)

  return (
    <div style={ps.wrap}>
      {hasImage ? (
        <img
          src={location.image_url}
          alt={location.name}
          style={ps.img}
          onError={() => setImgError(true)}
        />
      ) : (
        <div style={ps.placeholder}>
          <div style={{ color: theme.textMuted }}><Icon.Image size={28}/></div>
          <p style={ps.placeholderName}>{location?.name}</p>
          <p style={ps.placeholderSub}>
            {location?.type === 'library'    ? 'Reference books & reading area'   :
             location?.type === 'laboratory' ? 'Computer & equipment room'        :
             location?.type === 'office'     ? 'Administrative office'            :
             location?.type === 'clinic'     ? 'Medical & first aid services'     :
             location?.type === 'lounge'     ? 'Visitor & student lounge area'    :
             'Campus room & facility'}
          </p>
          <p style={ps.placeholderNote}>Photo coming soon</p>
        </div>
      )}
    </div>
  )
}

const getPhotoStyles = (theme) => ({
  wrap: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    border: `1px solid ${theme.glassBorder}`,
    background: theme.glassBg,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
  img: {
    width: '100%',
    height: '140px',
    objectFit: 'cover',
    display: 'block',
  },
  placeholder: {
    height: '140px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    background: theme.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(7,18,32,0.4) 0%, rgba(10,25,42,0.6) 100%)'
      : 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.55) 100%)',
    padding: '12px',
  },
  placeholderName:  { fontSize: 12, fontWeight: 600, color: theme.accentText, textAlign: 'center', marginTop: 4 },
  placeholderSub:   { fontSize: 10, color: theme.textMuted, textAlign: 'center', lineHeight: 1.4 },
  placeholderNote:  { fontSize: 9,  color: theme.textMuted, marginTop: 4 },
})

// ─────────────────────────────────────────────────────────────
//  CAMPUS SVG MAP
// ─────────────────────────────────────────────────────────────
const BLDG_LABELS = {
  'Building 1': { short: 'B1', color: '#0e417b' },
  'Building 2': { short: 'B2', color: '#a09363' },
  'Building 3': { short: 'B3', color: '#317633' },
  'Building 4': { short: 'B4', color: '#7c3785' },
}

function roomLabel(label, bw, bh) {
  if (!label || typeof label !== 'string' || label.trim() === '') return { lines: [], fontSize: 6, lineH: 8 }
  const fontSize = Math.max(6, Math.min(8, bw / 12))
  const charsPerLine = Math.max(5, Math.floor(bw / (fontSize * 0.6)))
  const maxLines = Math.max(1, Math.floor(bh / (fontSize + 3)))
  const words = label.split(' ')
  const lines = []
  let cur = ''
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w
    if (test.length > charsPerLine && cur) { lines.push(cur); cur = w }
    else cur = test
  }
  if (cur) lines.push(cur)
  const visible = lines.slice(0, maxLines)
  return { lines: visible, fontSize, lineH: fontSize + 2.5 }
}

function CampusMap({ floor, destId, path, currentStep = 0, theme }) {
  const blocks    = FLOOR_BLOCKS[floor] || FLOOR_BLOCKS[1]
  const floorLocs = LOCATIONS.filter(l => l.floor === floor)

  const pathSet = useMemo(() => {
    const s = new Set()
    for (let i = 0; i < path.length - 1; i++) {
      s.add(`${path[i]}-${path[i+1]}`)
      s.add(`${path[i+1]}-${path[i]}`)
    }
    return s
  }, [path])

  const currentLegSet = useMemo(() => {
    const s = new Set()
    const a = path[currentStep]
    const b = path[currentStep + 1]
    if (a != null && b != null) {
      s.add(`${a}-${b}`)
      s.add(`${b}-${a}`)
    }
    return s
  }, [path, currentStep])

  const currentNodeId = path[currentStep]

  return (
    <svg
      viewBox={`0 0 ${SCALE.W} ${SCALE.H}`}
      width="100%" height="100%"
      style={{ background: theme.mapCanvasBg, borderRadius: 14, border: `1px solid ${theme.mapCanvasBorder}`, display: 'block', boxShadow: theme.mapCanvasShadow }}
    >
      {/* ── PASS 1: Building outlines ── */}
      {blocks.filter(b => b.type === 'building').map((b, i) => {
        const bx = sx(b.x), by = sy(b.y)
        const bw = sx(b.x + b.w) - sx(b.x)
        const bh = sy(b.y + b.h) - sy(b.y)
        const info = BLDG_LABELS[b.label]
        return (
          <rect key={`bldg-${i}`}
            x={bx} y={by} width={bw} height={bh} rx="4"
            fill={theme.mapBuildingFill}
            stroke={info?.color || theme.mapBuildingStroke}
            strokeWidth="2"
          />
        )
      })}

      {/* ── PASS 2: Room blocks ── */}
      {blocks.filter(b => b.type !== 'building').map((b, i) => {
        const bx = sx(b.x), by = sy(b.y)
        const bw = sx(b.x + b.w) - sx(b.x)
        const bh = sy(b.y + b.h) - sy(b.y)
        const meta = TYPE_META[b.type] || TYPE_META.facility
        const blockFill =
          theme.roomFillByType?.[b.type] ||
          theme.roomFillByType?.facility ||
          meta.fill ||
          theme.mapBuildingFill
        const cx = bx + bw / 2
        const cy = by + bh / 2
        const result = roomLabel(b.label, bw, bh)
        const { lines, fontSize, lineH } = result
        const totalH = lines.length * lineH
        const startY = cy - totalH / 2 + lineH / 2

        return (
          <g key={`room-${i}`}>
            <rect x={bx} y={by} width={bw} height={bh} rx="3"
              fill={blockFill}
              stroke={theme.mapRoomStroke} strokeWidth="1" opacity="0.9"
            />
            {bw > 20 && bh > 10 && lines.map((line, li) => (
              <text key={li}
                x={cx} y={startY + li * lineH}
                textAnchor="middle" dominantBaseline="middle"
                style={{ fontSize, fill: theme.mapRoomLabel, fontFamily: 'monospace', pointerEvents: 'none', userSelect: 'none' }}
              >
                {line}
              </text>
            ))}
          </g>
        )
      })}

      {/* ── PASS 3: Building labels ── */}
      {blocks.filter(b => b.type === 'building').map((b, i) => {
        const bx = sx(b.x), by = sy(b.y)
        const bw = sx(b.x + b.w) - sx(b.x)
        const bh = sy(b.y + b.h) - sy(b.y)
        const cx = bx + bw / 2
        const cy = by + bh / 2
        const info = BLDG_LABELS[b.label]
        if (!info) return null
        const fs = Math.min(bw / 5, bh / 3, 36)
        return (
          <g key={`blbl-${i}`} style={{ pointerEvents: 'none' }}>
            <rect
              x={cx - fs * 0.9} y={cy - fs * 0.65}
              width={fs * 1.8} height={fs * 1.2}
              rx="8"
              fill={info.color} opacity="0.12"
            />
            <text
              x={cx} y={cy}
              textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: fs, fill: info.color, fontFamily: 'monospace', fontWeight: 700, opacity: 0.75 }}
            >
              {info.short}
            </text>
          </g>
        )
      })}

      {/* ── Floor label ── */}
      <text x={sx(11)} y={sy(22.5)} textAnchor="middle"
        style={{ fontSize: 11, fill: theme.mapFloorLabel, fontFamily: 'monospace', fontWeight: 700 }}>
        {FLOOR_LABELS[floor] || `Floor ${floor}`}
      </text>

      {/* ── Edges ── */}
      {EDGES.map(([a, b], i) => {
        const la = floorLocs.find(l => l.id === a)
        const lb = floorLocs.find(l => l.id === b)
        if (!la || !lb) return null
        const onPath = pathSet.has(`${a}-${b}`)
        const isCurrentLeg = currentLegSet.has(`${a}-${b}`)
        return (
          <path key={i}
            d={`M${sx(la.x)},${sy(la.y)} L${sx(lb.x)},${sy(lb.y)}`}
            stroke={isCurrentLeg ? theme.mapEdgeCurrent : onPath ? theme.mapEdgeOnPath : theme.mapEdgeIdle}
            strokeWidth={isCurrentLeg ? 3.5 : onPath ? 1.8 : 1}
            strokeLinecap="round"
            strokeDasharray={onPath ? 'none' : '4,3'}
            fill="none"
            opacity={isCurrentLeg ? 1 : onPath ? 0.55 : 0.3}
          />
        )
      })}

      {/* ── Current-step dot + next-leg animation ── */}
      {(() => {
        const curLoc  = floorLocs.find(l => l.id === currentNodeId)
        const nextId  = path[currentStep + 1]
        const nextLoc = floorLocs.find(l => l.id === nextId)
        if (!curLoc) return null

        if (nextLoc) {
          const legD = `M${sx(curLoc.x)},${sy(curLoc.y)} L${sx(nextLoc.x)},${sy(nextLoc.y)}`
          return (
            <g>
              <path id="anim-leg" d={legD} fill="none" stroke="none"/>
              <circle r="6" fill={theme.mapEdgeCurrent}>
                <animateMotion dur="1.6s" repeatCount="indefinite">
                  <mpath href="#anim-leg"/>
                </animateMotion>
              </circle>
            </g>
          )
        }

        return (
          <circle cx={sx(curLoc.x)} cy={sy(curLoc.y)} r="6" fill={theme.mapEdgeCurrent}>
            <animate attributeName="r" values="5;8;5" dur="1.2s" repeatCount="indefinite"/>
          </circle>
        )
      })()}

      {/* ── PASS 4: Pill labels ── */}
      {floorLocs.filter(l =>
        l.type !== 'hallway' &&
        l.id !== KIOSK_NODE_ID
      ).map(loc => {
        const isDest  = loc.id === destId
        const lx = sx(loc.x)
        const ly = sy(loc.y)
        const meta = TYPE_META[loc.type] || { color: '#6eb6ff' }
        const n = (loc.name || '').toLowerCase()

        const isWindow   = n.startsWith('window')
        const isRoomCode = /^b\d+\.\d+$/i.test(loc.name.trim())
        const isEntrance = n.includes('entrance')
        const isExit     = n.includes('exit')

        if (!isWindow && !isRoomCode && !isEntrance && !isExit) return null

        const label = isWindow
          ? 'W' + loc.name.replace(/[^0-9]/g, '')
          : isEntrance ? 'Entrance'
          : isExit     ? 'Exit'
          : loc.name.trim()

        const pillW = Math.max(18, label.length * 5.2 + 8)
        const pillH = 12

        const pillFill   = isDest ? theme.mapPillBgDest : theme.mapPillBg
        const pillStroke = isDest ? '#6eb6ff' : meta.color + '88'
        const textCol    = isDest ? '#ffffff'  : meta.color

        return (
          <g key={`pill-${loc.id}`} style={{ pointerEvents: 'none' }}>
            <rect
              x={lx - pillW / 2} y={ly - pillH / 2}
              width={pillW} height={pillH}
              rx="3"
              fill={pillFill}
              stroke={pillStroke}
              strokeWidth="0.8"
              opacity="0.95"
            />
            <text
              x={lx} y={ly}
              textAnchor="middle" dominantBaseline="middle"
              style={{
                fontSize: 5.5,
                fill: textCol,
                fontFamily: 'monospace',
                fontWeight: isDest ? 700 : 400,
              }}
            >
              {label}
            </text>
          </g>
        )
      })}

      {/* ── PASS 5: Kiosk + destination nodes ── */}
      {floorLocs.filter(l =>
        l.id === KIOSK_NODE_ID || l.id === destId
      ).map(loc => {
        const isKiosk = loc.id === KIOSK_NODE_ID
        const isDest  = loc.id === destId
        const meta    = TYPE_META[loc.type] || { color: '#94a3b8' }
        const r       = isKiosk || isDest ? 7 : 6

        return (
          <g key={loc.id}>
            {(isKiosk || isDest) && (
              <circle cx={sx(loc.x)} cy={sy(loc.y)} r={r + 3}
                fill={isKiosk ? '#0ea5e922' : '#378add22'}>
                <animate attributeName="r"
                  values={`${r+2};${r+5};${r+2}`}
                  dur="2s" repeatCount="indefinite"/>
              </circle>
            )}
            <circle
              cx={sx(loc.x)} cy={sy(loc.y)} r={r}
              fill={isKiosk ? '#0c2240' : isDest ? '#0d2d4a' : theme.mapNodeFill}
              stroke={isKiosk ? '#0ea5e9' : isDest ? '#378add' : meta.color}
              strokeWidth={isKiosk || isDest ? 2.5 : 1.5}
            />
            {!isKiosk && !isDest && (
              <text x={sx(loc.x)} y={sy(loc.y)}
                textAnchor="middle" dominantBaseline="middle"
                style={{ fontSize: 6.5, fill: theme.mapNodeText, fontFamily: 'monospace', fontWeight: 700, pointerEvents: 'none' }}>
                {loc.id}
              </text>
            )}
            {(isKiosk || isDest) && (
              <text x={sx(loc.x)} y={sy(loc.y) + r + 8}
                textAnchor="middle"
                style={{ fontSize: 6, fill: isKiosk ? '#0ea5e9' : '#378add', fontFamily: 'monospace', pointerEvents: 'none', fontWeight: 600 }}>
                {loc.name.length > 16 ? loc.name.slice(0, 15) + '…' : loc.name}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
//  MAIN MAP PAGE
// ─────────────────────────────────────────────────────────────
export default function MapPage() {
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const destQuery      = searchParams.get('destination') || ''
  const [floor,        setFloor]        = useState(1)
  const [path,         setPath]         = useState([])
  const [directions,   setDirections]   = useState([])
  const [loading,      setLoading]      = useState(false)
  const [currentStep,  setCurrentStep]  = useState(0)
  const prevDestIdRef = useRef(null)
  const prevStepRef   = useRef(0)

  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (!document.getElementById('inter-font')) {
      const link = document.createElement('link')
      link.id = 'inter-font'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  const destLoc = useMemo(() => {
    if (!destQuery) return null
    const results = findLocationByName(destQuery)
    return results.length > 0 ? results[0] : null
  }, [destQuery])

  const destId = destLoc?.id ?? null

  useEffect(() => {
    if (prevDestIdRef.current !== destId) {
      prevDestIdRef.current = destId
      if (destId) {
        setTimeout(() => setFloor(destLoc?.floor || 1), 0)
      }
    }
  }, [destId, destLoc])

  useEffect(() => {
    if (!destId) return

    let mounted = true
    const loadingTimer = setTimeout(() => {
      if (mounted) setLoading(true)
    }, 0)

    fetchNavigation(destId)
      .then(data => {
        if (!mounted) return
        setPath(data.path || [])
        setDirections(data.directions || [])
        setCurrentStep(0)
      })
      .catch(() => {
        if (!mounted) return
        setDirections([{ icon: 'warn', text: 'Could not load directions.', sub: '' }])
        setCurrentStep(0)
      })
      .finally(() => {
        clearTimeout(loadingTimer)
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
      clearTimeout(loadingTimer)
    }
  }, [destId])

  const dest               = LOCATIONS.find(l => l.id === destId)
  const floorKeys          = Object.keys(FLOOR_BLOCKS).map(Number).sort((a, b) => a - b)
  const displayPath        = useMemo(() => (destId ? path : []), [destId, path])
  const displayDirections  = useMemo(() => (destId ? directions : []), [destId, directions])

  const stepFloor = useMemo(() => {
    const nodeId = displayPath[currentStep]
    if (nodeId == null) return null
    const loc = LOCATIONS.find(l => l.id === nodeId)
    return loc ? loc.floor : null
  }, [displayPath, currentStep])

  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      prevStepRef.current = currentStep
      if (stepFloor != null) {
        const t = setTimeout(() => setFloor(stepFloor), 0)
        return () => clearTimeout(t)
      }
    }
  }, [currentStep, stepFloor])

  // Human-readable floor label for top bar pills
  const floorPillLabel = (f) => {
    const label = FLOOR_LABELS[f]
    if (!label) return `Floor ${f}`
    if (label === 'Ground Floor') return 'Ground'
    // e.g. "Second Floor" → "Second", "Third Floor" → "Third"
    return label.replace(' Floor', '')
  }

  const s = getStyles(theme)

  return (
    <div style={s.page}>

      {/* Ambient glow */}
      <div style={s.ambientWrap}>
        <div style={s.ambient1}/>
        <div style={s.ambient2}/>
        <div style={s.ambient3}/>
      </div>

      {/* ── Top bar ── */}
      <div style={s.topBar}>
        {/* Left: logo */}
        <div style={s.topBarLeft}>
          <img src={icctLogo} alt="ICCT Colleges" style={s.logoImg}/>
        </div>

        {/* Center: floor pills */}
        <div style={s.floorPillsWrap}>
          <span style={s.floorPillsLabel}>FLOOR:</span>
          <div style={s.floorPills}>
            {floorKeys.map(f => {
              const isActive = floor === f
              return (
                <button
                  key={f}
                  onClick={() => setFloor(f)}
                  title={FLOOR_LABELS[f] || `Floor ${f}`}
                  style={{
                    ...s.floorPill,
                    ...(isActive ? s.floorPillActive : {}),
                  }}
                >
                  {floorPillLabel(f)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: kiosk badge + theme toggle */}
        <div style={s.topBarRight}>
          <div style={s.kioskBadge}>
            <Icon.Pin size={13}/> Kiosk · GF · Building 4
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme}/>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={s.body}>

        {/* ── Map ── */}
        <div style={s.mapWrap}>
          <CampusMap
            floor={floor}
            destId={destId}
            path={displayPath}
            currentStep={currentStep}
            theme={theme}
          />


        </div>

        {/* ── Side panel ── */}
        <div style={s.panel}>

          {/* Destination */}
          <div style={s.sec}>
            <p style={s.secLabel}><Icon.Pin size={12}/> Destination</p>
            {dest ? (
              <>
                <p style={s.destName}>{dest.name}</p>
                <p style={s.destSub}>
                  {FLOOR_LABELS[dest.floor] || `Floor ${dest.floor}`}
                  {dest.building ? ` · Building ${dest.building}` : ''}
                </p>
                {dest.desc && <p style={s.destDesc}>{dest.desc}</p>}
              </>
            ) : (
              <p style={s.muted}>No destination selected.</p>
            )}
          </div>

          {/* Directions */}
          <div style={{ ...s.sec, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <p style={s.secLabel}><Icon.List size={12}/> Directions</p>

            {loading ? (
              <p style={s.muted}>Loading directions...</p>
            ) : displayDirections.length > 0 ? (
              <>
                <div style={s.step}>
                  <div style={s.stepNum}>{currentStep + 1}</div>
                  <div>
                    <p style={s.stepText}>{displayDirections[currentStep].text}</p>
                    {displayDirections[currentStep].sub && (
                      <p style={s.stepSub}>{displayDirections[currentStep].sub}</p>
                    )}
                  </div>
                </div>

                <div style={s.stepNav}>
                  <button
                    style={{ ...s.stepNavBtn, ...(currentStep === 0 ? s.stepNavBtnDisabled : {}) }}
                    onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                    disabled={currentStep === 0}
                  >
                    ← Prev
                  </button>
                  <span style={s.stepCounter}>
                    {currentStep + 1} / {displayDirections.length}
                  </span>
                  <button
                    style={{
                      ...s.stepNavBtn,
                      ...(currentStep === displayDirections.length - 1 ? s.stepNavBtnDisabled : {}),
                    }}
                    onClick={() => setCurrentStep(s => Math.min(displayDirections.length - 1, s + 1))}
                    disabled={currentStep === displayDirections.length - 1}
                  >
                    Next →
                  </button>
                </div>
              </>
            ) : (
              <p style={s.muted}>
                {dest
                  ? 'Directions will appear here once the backend is connected.'
                  : 'Select a destination to see directions.'}
              </p>
            )}
          </div>

          {/* Room Photo */}
          {dest && (
            <div style={s.sec}>
              <p style={s.secLabel}><Icon.Image size={12}/> What it looks like</p>
              <RoomPhoto location={dest} theme={theme}/>
            </div>
          )}

          {/* QR Code */}
          {dest && (
            <div style={s.sec}>
              <p style={s.secLabel}><Icon.QrCode size={14}/> Scan to save on phone</p>
              <div style={s.qrRow}>
                <QRCode
                  value={`http://192.168.8.143:5174/directions?to=${dest.id}&name=${encodeURIComponent(dest.name)}&floor=${dest.floor || 1}&building=${dest.building || ''}`}
                  size={140}
                />
                <p style={s.muted}>Scan to save these directions on your phone.</p>
              </div>
            </div>
          )}

          {/* Home button */}
          <div style={{ ...s.sec, borderBottom: 'none', marginTop: 'auto' }}>
            <button style={s.homeBtnBottom} onClick={() => navigate('/home')}>
              <Icon.Home size={18}/> Back to Home
            </button>
          </div>

          {/* Empty state */}
          {!dest && (
            <div style={{ ...s.sec, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={s.emptyState}>
                <span style={{ color: theme.textMuted }}><Icon.Map size={44}/></span>
                <p style={{ ...s.muted, textAlign: 'center', lineHeight: 1.7 }}>
                  Search for a location on the Home page to get directions here.
                </p>
                <button style={s.goHomeBtn} onClick={() => navigate('/home')}>
                  Go to Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────────────────────
const getStyles = (theme) => ({
  page: {
    background: theme.pageBg,
    height:'100vh', width:'100%', color: theme.textPrimary, display:'flex', flexDirection:'column',
    overflow:'hidden', fontFamily:"'Inter',system-ui,sans-serif", position:'relative',
    transition: 'background 0.3s, color 0.3s',
  },

  ambientWrap: { position:'absolute', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' },
  ambient1: { position:'absolute', width:'420px', height:'420px', borderRadius:'50%', background:`radial-gradient(circle, ${theme.ambient1} 0%, transparent 70%)`, top:'-10%', right:'10%', filter:'blur(60px)' },
  ambient2: { position:'absolute', width:'380px', height:'380px', borderRadius:'50%', background:`radial-gradient(circle, ${theme.ambient2} 0%, transparent 70%)`, bottom:'-15%', left:'5%', filter:'blur(60px)' },
  ambient3: { position:'absolute', width:'320px', height:'320px', borderRadius:'50%', background:`radial-gradient(circle, ${theme.ambient3} 0%, transparent 70%)`, top:'40%', right:'30%', filter:'blur(65px)' },

  // ── Top bar — now has three zones: left logo | center floor pills | right controls ──
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 20px',
    background: theme.headerBg,
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    borderBottom: `1px solid ${theme.headerBorder}`,
    flexShrink: 0,
    gap: 12,
    position: 'relative',
    zIndex: 2,
    transition: 'background 0.3s, border-color 0.3s',
  },
  topBarLeft: { display:'flex', alignItems:'center', gap:14, flexShrink:0 },
  logoImg: { height:'40px', width:'auto', display:'block', filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' },
  topBarRight: { display:'flex', alignItems:'center', gap:12, flexShrink:0 },
  kioskBadge: {
    fontSize:13, color: theme.accentText,
    background: theme.accent + '14', backdropFilter:'blur(8px)',
    border: `1px solid ${theme.accent}4d`, borderRadius:10,
    padding:'7px 14px', flexShrink:0,
    display:'flex', alignItems:'center', gap:6,
  },

  // ── Floor pills in the top bar (center zone) ──
  floorPillsWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  floorPillsLabel: {
    fontSize: 18,
    fontWeight: 900,
    color: theme.textMuted,
    flexShrink: 0,
    letterSpacing: '0.5px',
  },
  floorPills: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  floorPill: {
    padding: '6px 14px',
    borderRadius: 13,
    border: `2px solid ${theme.glassBorder}`,
    background: theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    backdropFilter: 'blur(8px)',
    color: theme.textMuted,
    fontSize: 15,
    fontWeight: 700,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
    whiteSpace: 'nowrap',
  },
  floorPillActive: {
    background: theme.accent,
    color: '#ffffff',
    border: `1px solid ${theme.accent}`,
    fontWeight: 700,
  },

  body: { flex:1, display:'grid', gridTemplateColumns:'1fr 380px', overflow:'hidden', position:'relative', zIndex:1 },
  mapWrap: { padding:14, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' },

  panel: {
    display:'flex', flexDirection:'column',
    background: theme.mode === 'dark' ? 'rgba(7,18,32,0.45)' : 'rgba(255,255,255,0.42)',
    backdropFilter:'blur(20px) saturate(160%)',
    WebkitBackdropFilter:'blur(20px) saturate(160%)',
    borderLeft: `1px solid ${theme.headerBorder}`,
    overflow:'hidden',
    transition: 'background 0.3s, border-color 0.3s',
  },
  sec: { borderBottom: `1px solid ${theme.glassBorder}`, padding:'16px 20px', flexShrink:0 },
  secLabel: { fontSize:12, letterSpacing:'1.2px', color: theme.textMuted, textTransform:'uppercase', marginBottom:10, display:'flex', alignItems:'center', gap:7, fontWeight:600 },
  destName: { fontSize:20, fontWeight:700, color: theme.accentText, marginBottom:6, lineHeight:1.3 },
  destSub:  { fontSize:14, color: theme.textMuted, marginBottom:6 },
  destDesc: { fontSize:13, color: theme.textMuted, lineHeight:1.6 },
  muted:    { fontSize:14, color: theme.textMuted, lineHeight:1.7 },
  step:     { display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 },
  stepNum: {
    background: theme.accent + '1f', backdropFilter:'blur(4px)',
    border: `1px solid ${theme.accent}4d`, borderRadius:'50%',
    width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:14, color: theme.accentText, flexShrink:0, fontWeight:700,
  },
  stepText: { fontSize:15, color: theme.textPrimary, lineHeight:1.5, margin:0, fontWeight:500 },
  stepSub:  { fontSize:12, color: theme.textMuted, margin:0, marginTop:3 },
  stepNav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 14,
    borderTop: `1px solid ${theme.glassBorder}`,
  },
  stepNavBtn: {
    background: theme.accent + '1f', backdropFilter: 'blur(8px)', border: `1px solid ${theme.accent}4d`,
    borderRadius: 10, color: theme.accentText, fontSize: 13, fontWeight: 600, padding: '8px 16px', cursor: 'pointer',
    fontFamily: 'inherit', transition: 'opacity 0.15s',
  },
  stepNavBtnDisabled: { opacity: 0.35, cursor: 'not-allowed' },
  stepCounter: { fontSize: 13, color: theme.textMuted, fontFamily: 'monospace' },
  qrRow:    { display:'flex', alignItems:'center', gap:12 },
  emptyState: { display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:20 },
  goHomeBtn: {
    background:'linear-gradient(135deg, #5B8DEF, #A78BFA)', backdropFilter:'blur(8px)',
    border:'none', borderRadius:12, color:'#04141f', fontSize:14, fontWeight:700,
    padding:'11px 26px', cursor:'pointer', fontFamily:'inherit',
    boxShadow:'0 4px 16px rgba(124,124,240,0.35)',
  },
  homeBtnBottom: {
    width:'100%',
    background: theme.accent + '1f', backdropFilter:'blur(8px)',
    border: `1px solid ${theme.accent}4d`, borderRadius:12,
    color: theme.accentText, fontSize:15, fontWeight:600, padding:'12px 16px', cursor:'pointer',
    fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
    transition:'background 0.15s',
  },
})