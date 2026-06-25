import { useMemo, useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  LOCATIONS, EDGES, FLOOR_BLOCKS, FLOOR_LABELS,
  TYPE_META, SCALE, sx, sy, KIOSK_NODE_ID,
  fetchNavigation
} from '../../data/campusData'
import icctLogo from '../../assets/icct-logo.png'

const Icon = {
  Pin: (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Map: (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  ),
  List: (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  Building: (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="7" x2="9" y2="7.01"/><line x1="15" y1="7" x2="15" y2="7.01"/>
      <line x1="9" y1="12" x2="9" y2="12.01"/><line x1="15" y1="12" x2="15" y2="12.01"/><path d="M9 22v-4h6v4"/>
    </svg>
  ),
  Lightbulb: (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.7.5 1 1.3 1 2.1V18h6v-1.2c0-.8.3-1.6 1-2.1A7 7 0 0 0 12 2z"/>
    </svg>
  ),
  Expand: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
  ),
  Close: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
}

const BLDG_LABELS = {
  'Building 1': { short: 'B1', color: '#5B8DEF' },
  'Building 2': { short: 'B2', color: '#7C7CF0' },
  'Building 3': { short: 'B3', color: '#A78BFA' },
  'Building 4': { short: 'B4', color: '#6EA8FE' },
}

function CampusMap({ floor, destId, path, currentStep }) {
  const blocks = FLOOR_BLOCKS[floor] || FLOOR_BLOCKS[1]
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
      style={{ background: '#070d1a', borderRadius: 12, display: 'block' }}
    >
      {blocks.filter(b => b.type === 'building').map((b, i) => {
        const bx = sx(b.x), by = sy(b.y)
        const bw = sx(b.x + b.w) - sx(b.x)
        const bh = sy(b.y + b.h) - sy(b.y)
        const info = BLDG_LABELS[b.label]
        return (
          <rect key={`bldg-${i}`} x={bx} y={by} width={bw} height={bh} rx="4"
            fill="#0d1b2e" stroke={info?.color || '#1a3a5c'} strokeWidth="2"/>
        )
      })}

      {blocks.filter(b => b.type !== 'building').map((b, i) => {
        const bx = sx(b.x), by = sy(b.y)
        const bw = sx(b.x + b.w) - sx(b.x)
        const bh = sy(b.y + b.h) - sy(b.y)
        const meta = TYPE_META[b.type] || TYPE_META.facility
        return (
          <rect key={`room-${i}`} x={bx} y={by} width={bw} height={bh} rx="3"
            fill={meta.fill || '#0d1b2e'} stroke="#1a3a5c" strokeWidth="1" opacity="0.9"/>
        )
      })}

      {blocks.filter(b => b.type === 'building').map((b, i) => {
        const bx = sx(b.x), by = sy(b.y)
        const bw = sx(b.x + b.w) - sx(b.x)
        const bh = sy(b.y + b.h) - sy(b.y)
        const cx = bx + bw / 2, cy = by + bh / 2
        const info = BLDG_LABELS[b.label]
        if (!info) return null
        const fs = Math.min(bw / 5, bh / 3, 36)
        return (
          <g key={`blbl-${i}`} style={{ pointerEvents: 'none' }}>
            <rect x={cx - fs * 0.9} y={cy - fs * 0.65} width={fs * 1.8} height={fs * 1.2}
              rx="8" fill={info.color} opacity="0.12"/>
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: fs, fill: info.color, fontFamily: 'monospace', fontWeight: 700, opacity: 0.75 }}>
              {info.short}
            </text>
          </g>
        )
      })}

      <text x={sx(11)} y={sy(22.5)} textAnchor="middle"
        style={{ fontSize: 11, fill: '#1e3a5f', fontFamily: 'monospace', fontWeight: 700 }}>
        {FLOOR_LABELS[floor] || `Floor ${floor}`}
      </text>

      {EDGES.map(([a, b], i) => {
        const la = floorLocs.find(l => l.id === a)
        const lb = floorLocs.find(l => l.id === b)
        if (!la || !lb) return null
        const onPath = pathSet.has(`${a}-${b}`)
        const isCurrentLeg = currentLegSet.has(`${a}-${b}`)
        return (
          <path key={i}
            d={`M${sx(la.x)},${sy(la.y)} L${sx(lb.x)},${sy(lb.y)}`}
            stroke={isCurrentLeg ? '#38bdf8' : onPath ? '#2c6b94' : '#1a3a5c'}
            strokeWidth={isCurrentLeg ? 3.5 : onPath ? 1.8 : 1}
            strokeLinecap="round"
            strokeDasharray={onPath ? 'none' : '4,3'}
            fill="none"
            opacity={isCurrentLeg ? 1 : onPath ? 0.55 : 0.3}
          />
        )
      })}

      {(() => {
        const curLoc = floorLocs.find(l => l.id === currentNodeId)
        const nextId = path[currentStep + 1]
        const nextLoc = floorLocs.find(l => l.id === nextId)
        if (!curLoc) return null
        if (nextLoc) {
          const legD = `M${sx(curLoc.x)},${sy(curLoc.y)} L${sx(nextLoc.x)},${sy(nextLoc.y)}`
          return (
            <g>
              <path id="mob-anim-leg" d={legD} fill="none" stroke="none"/>
              <circle r="6" fill="#38bdf8">
                <animateMotion dur="1.6s" repeatCount="indefinite">
                  <mpath href="#mob-anim-leg"/>
                </animateMotion>
              </circle>
            </g>
          )
        }
        return (
          <circle cx={sx(curLoc.x)} cy={sy(curLoc.y)} r="6" fill="#38bdf8">
            <animate attributeName="r" values="5;8;5" dur="1.2s" repeatCount="indefinite"/>
          </circle>
        )
      })()}

      {floorLocs.filter(l => l.id === KIOSK_NODE_ID || l.id === destId).map(loc => {
        const isKiosk = loc.id === KIOSK_NODE_ID
        const r = 7
        return (
          <g key={loc.id}>
            <circle cx={sx(loc.x)} cy={sy(loc.y)} r={r + 3}
              fill={isKiosk ? '#0ea5e922' : '#378add22'}>
              <animate attributeName="r" values={`${r+2};${r+5};${r+2}`} dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx={sx(loc.x)} cy={sy(loc.y)} r={r}
              fill={isKiosk ? '#0c2240' : '#0d2d4a'}
              stroke={isKiosk ? '#0ea5e9' : '#378add'} strokeWidth="2.5"/>
            <text x={sx(loc.x)} y={sy(loc.y) + r + 8} textAnchor="middle"
              style={{ fontSize: 6, fill: isKiosk ? '#0ea5e9' : '#378add', fontFamily: 'monospace', fontWeight: 600 }}>
              {isKiosk ? 'Kiosk' : (loc.name.length > 14 ? loc.name.slice(0,13)+'…' : loc.name)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function MobilePage() {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (!document.getElementById('inter-font')) {
      const link = document.createElement('link')
      link.id = 'inter-font'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  const destId   = searchParams.get('to')
  const destName = searchParams.get('name')
  const floor    = parseInt(searchParams.get('floor') || '1')
  const building = searchParams.get('building')

  const dest = LOCATIONS.find(l => String(l.id) === String(destId))
  const name = dest?.name || destName || 'Unknown Location'
  const floorLabel = FLOOR_LABELS[floor] || `Floor ${floor}`
  const meta = TYPE_META[dest?.type] || { color: '#9B9BF5' }

  const [path, setPath] = useState([])
  const [directions, setDirections] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [mapExpanded, setMapExpanded] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const [zoomOrigin, setZoomOrigin] = useState({ x: 0, y: 0 })
  const pinchRef = useRef({ startDist: 0, startScale: 1 })

  useEffect(() => {
    if (!dest) return

    let cancelled = false

    const loadNavigation = async () => {
      setLoading(true)
      try {
        const data = await fetchNavigation(dest.id)
        if (cancelled) return
        setPath(data.path || [])
        setDirections(data.directions || [])
        setCurrentStep(0)
      } catch {
        if (cancelled) return
        setDirections([{ icon: '⚠️', text: 'Could not load directions.', sub: '' }])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadNavigation()
    return () => { cancelled = true }
  }, [dest])

  // Auto-switch floor as step changes
  const stepFloor = useMemo(() => {
    const nodeId = path[currentStep]
    if (nodeId == null) return floor
    const loc = LOCATIONS.find(l => l.id === nodeId)
    return loc ? loc.floor : floor
  }, [path, currentStep, floor])

  const getDist = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      pinchRef.current.startDist = getDist(e.touches)
      pinchRef.current.startScale = zoomScale
      const rect = e.currentTarget.getBoundingClientRect()
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2
      setZoomOrigin({ x: ((midX - rect.left) / rect.width) * 100, y: ((midY - rect.top) / rect.height) * 100 })
    }
  }

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      const newDist = getDist(e.touches)
      if (pinchRef.current.startDist > 0) {
        const ratio = newDist / pinchRef.current.startDist
        setZoomScale(Math.min(Math.max(pinchRef.current.startScale * ratio, 1), 4))
      }
    }
  }

  const handleTouchEnd = (e) => { if (e.touches.length < 2) pinchRef.current.startDist = 0 }
  
  const handleDoubleClick = (e) => {
    if (zoomScale > 1) { setZoomScale(1); setZoomOrigin({ x: 50, y: 50 }) }
    else {
      const rect = e.currentTarget.getBoundingClientRect()
      setZoomOrigin({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
      setZoomScale(2)
    }
  }

  const floorKeys = useMemo(() => Object.keys(FLOOR_BLOCKS).map(Number).sort((a, b) => a - b), [])

  return (
    <div style={s.page}>
      <div style={s.ambientWrap}>
        <div style={s.ambient1}/><div style={s.ambient2}/>
      </div>

      <div style={s.header}>
        <div style={s.headerLogo}>
          <img src={icctLogo} alt="ICCT Colleges" style={s.logoImg}/>
          <div>
            <p style={s.headerTitle}>Smart Campus Navigator</p>
            <p style={s.headerSub}>ICCT Colleges · Cainta, Rizal</p>
          </div>
        </div>
      </div>

      <div style={s.content}>

        {/* Destination card */}
        <div style={s.card}>
          <p style={s.cardLabel}><Icon.Pin size={13}/> YOUR DESTINATION</p>
          <p style={s.destName}>{name}</p>
          <div style={s.destMeta}>
            <span style={{ ...s.destBadge, borderColor: meta.color + '55', color: meta.color }}>{floorLabel}</span>
            {building && <span style={{ ...s.destBadge, borderColor: meta.color + '55', color: meta.color }}>Building {building}</span>}
            {dest?.type && <span style={{ ...s.destBadge, borderColor: meta.color + '55', color: meta.color }}>{dest.type}</span>}
          </div>
          {dest?.desc && <p style={s.destDesc}>{dest.desc}</p>}
        </div>

        {/* Map card — shows current step's floor */}
        <div style={s.card}>
          <div style={s.mapCardHeader}>
            <p style={{ ...s.cardLabel, margin: 0 }}><Icon.Map size={13}/> LOCATION MAP</p>
            <span style={s.expandHint}><Icon.Expand size={12}/> Tap to zoom</span>
          </div>
          <div style={s.mapWrap} onClick={() => {
            setMapExpanded(true)
            setZoomScale(1)
            setZoomOrigin({ x: 0, y: 0 })
          }}>
            <CampusMap
              floor={stepFloor}
              destId={dest?.id}
              path={path}
              currentStep={currentStep}
            />
          </div>
          <p style={s.mapNote}>Blue line = your route · Highlighted = destination</p>
        </div>

        {/* Directions card with Prev/Next */}
        <div style={s.card}>
          <p style={s.cardLabel}><Icon.List size={13}/> DIRECTIONS</p>
          {loading ? (
            <p style={s.muted}>Loading directions...</p>
          ) : directions.length > 0 ? (
            <>
              <div style={s.stepBox}>
                <div style={s.stepNum}>{currentStep + 1}</div>
                <div style={{ flex: 1 }}>
                  <p style={s.stepText}>{directions[currentStep]?.text}</p>
                  {directions[currentStep]?.sub && <p style={s.stepSub}>{directions[currentStep].sub}</p>}
                </div>
              </div>
              <div style={s.stepNav}>
                <button
                  style={{ ...s.navBtn, ...(currentStep === 0 ? s.navBtnDisabled : {}) }}
                  onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                  disabled={currentStep === 0}
                >← Prev</button>
                <span style={s.stepCounter}>{currentStep + 1} / {directions.length}</span>
                <button
                  style={{ ...s.navBtn, ...(currentStep === directions.length - 1 ? s.navBtnDisabled : {}) }}
                  onClick={() => setCurrentStep(s => Math.min(directions.length - 1, s + 1))}
                  disabled={currentStep === directions.length - 1}
                >Next →</button>
              </div>
            </>
          ) : (
            <p style={s.muted}>No directions available.</p>
          )}
        </div>

        {/* Floor guide */}
        <div style={s.card}>
          <p style={s.cardLabel}><Icon.Building size={13}/> FLOOR GUIDE</p>
          <div style={s.floorGuide}>
            {floorKeys.map(f => (
              <div key={f} style={{ ...s.floorItem, ...(f === floor ? s.floorItemActive : {}) }}>
                <span style={s.floorNum}>{f === 1 ? 'GF' : `${f}F`}</span>
                <span style={s.floorName}>{f === floor ? name : FLOOR_LABELS[f]?.replace(' Floor','') || `Floor ${f}`}</span>
                {f === floor && <span style={s.floorYouAre}>HERE</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div style={s.tipsCard}>
          <p style={s.tipsTitle}><Icon.Lightbulb size={14}/> Helpful Tips</p>
          <p style={s.tipText}>Follow the directional signs inside the campus</p>
          <p style={s.tipText}>Ask any guard or staff if you need help</p>
          <p style={s.tipText}>The kiosk is located near the elevator, Building 4</p>
        </div>

        <div style={s.footer}>
          <p style={s.footerText}>ICCT Smart Campus Navigator</p>
          <p style={s.footerSub}>Cainta Campus · Directions from Kiosk</p>
        </div>
      </div>

      {/* Fullscreen map modal */}
      {mapExpanded && (
        <div style={s.modalOverlay} onClick={() => setMapExpanded(false)}>
          <div style={s.modalHeader}>
            <p style={s.modalTitle}>{name} · {FLOOR_LABELS[stepFloor] || `Floor ${stepFloor}`}</p>
            <button style={s.modalCloseBtn} onClick={() => setMapExpanded(false)}><Icon.Close size={22}/></button>
          </div>
          <div style={s.modalMapScroll} onClick={e => e.stopPropagation()}
            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd} onDoubleClick={handleDoubleClick}>
            <div style={{ ...s.modalMapInner, transform: `scale(${zoomScale})`, transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`, transition: zoomScale === 1 ? 'transform 0.2s ease' : 'none' }}>
              <CampusMap floor={stepFloor} destId={dest?.id} path={path} currentStep={currentStep}/>
            </div>
          </div>
          <p style={s.modalHint}>{zoomScale > 1 ? `Zoomed ${zoomScale.toFixed(1)}× · Double-tap to reset` : 'Pinch to zoom · Double-tap to zoom in · Tap outside to close'}</p>
        </div>
      )}
    </div>
  )
}

const s = {
  page: { background: 'linear-gradient(135deg, #040816 0%, #07182E 50%, #04111D 100%)', minHeight: '100vh', color: 'white', fontFamily: "'Inter', system-ui, sans-serif", position: 'relative', overflow: 'hidden' },
  ambientWrap: { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' },
  ambient1: { position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,141,239,0.12) 0%, transparent 70%)', top: '-8%', left: '-15%', filter: 'blur(50px)' },
  ambient2: { position: 'absolute', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 70%)', bottom: '5%', right: '-15%', filter: 'blur(55px)' },
  content: { position: 'relative', zIndex: 1, paddingBottom: '2rem' },
  header: { background: 'rgba(7,24,46,0.55)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px', position: 'relative', zIndex: 2 },
  headerLogo: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoImg: { height: '40px', width: 'auto', flexShrink: 0, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' },
  headerTitle: { fontSize: '16px', fontWeight: '700', color: 'white', margin: 0 },
  headerSub: { fontSize: '12px', color: '#7fa8bd', margin: 0, marginTop: '2px' },
  card: { background: 'rgba(7,18,32,0.5)', backdropFilter: 'blur(16px) saturate(160%)', WebkitBackdropFilter: 'blur(16px) saturate(160%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', margin: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' },
  cardLabel: { fontSize: '11px', letterSpacing: '1.5px', color: '#7fa8bd', textTransform: 'uppercase', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 },
  destName: { fontSize: '24px', fontWeight: '700', color: '#9B9BF5', margin: '0 0 12px 0', lineHeight: 1.2 },
  destMeta: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' },
  destBadge: { border: '1px solid', borderRadius: '20px', padding: '4px 12px', fontSize: '12px' },
  destDesc: { fontSize: '13px', color: '#7fa8bd', lineHeight: 1.5, margin: 0 },
  mapCardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' },
  expandHint: { fontSize: '10px', color: '#9B9BF5', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(124,124,240,0.12)', border: '1px solid rgba(124,124,240,0.3)', borderRadius: '20px', padding: '4px 10px', fontWeight: 600 },
  mapWrap: { width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' },
  mapNote: { fontSize: '11px', color: '#7fa8bd', textAlign: 'center', margin: 0 },
  muted: { fontSize: '14px', color: '#7fa8bd' },
  stepBox: { display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' },
  stepNum: { background: 'rgba(124,124,240,0.12)', border: '1px solid rgba(124,124,240,0.3)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#9B9BF5', flexShrink: 0, fontWeight: 700 },
  stepText: { fontSize: '15px', fontWeight: '600', color: '#dceaf9', margin: '0 0 4px 0' },
  stepSub: { fontSize: '12px', color: '#7fa8bd', margin: 0 },
  stepNav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  navBtn: { background: 'rgba(124,124,240,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(124,124,240,0.3)', borderRadius: 10, color: '#9B9BF5', fontSize: 13, fontWeight: 600, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s' },
  navBtnDisabled: { opacity: 0.35, cursor: 'not-allowed' },
  stepCounter: { fontSize: '13px', color: '#7fa8bd', fontFamily: 'monospace' },
  floorGuide: { display: 'flex', flexDirection: 'column', gap: '8px' },
  floorItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' },
  floorItemActive: { background: 'rgba(124,124,240,0.1)', border: '1px solid rgba(124,124,240,0.4)' },
  floorNum: { fontSize: '13px', fontWeight: '700', color: '#9B9BF5', width: '28px', flexShrink: 0 },
  floorName: { fontSize: '13px', color: '#a8c5d4', flex: 1 },
  floorYouAre: { fontSize: '11px', color: '#9B9BF5', fontWeight: '700' },
  tipsCard: { background: 'rgba(76,175,80,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(76,175,80,0.25)', borderRadius: '16px', padding: '16px 20px', margin: '0 16px 16px' },
  tipsTitle: { fontSize: '13px', fontWeight: '700', color: '#4CAF50', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' },
  tipText: { fontSize: '12px', color: '#86e092', margin: '0 0 4px 0', lineHeight: 1.5 },
  footer: { textAlign: 'center', padding: '20px' },
  footerText: { fontSize: '13px', color: '#3a5a7a', margin: '0 0 4px 0', fontWeight: '600' },
  footerSub: { fontSize: '11px', color: '#2a4560', margin: 0 },
  modalOverlay: { position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(2,5,15,0.96)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.08)' },
  modalTitle: { fontSize: '14px', fontWeight: 700, color: '#9B9BF5', margin: 0 },
  modalCloseBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', flexShrink: 0 },
  modalMapScroll: { flex: 1, overflow: 'hidden', touchAction: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' },
  modalMapInner: { width: '100%', maxWidth: '600px', aspectRatio: '4 / 3', transformOrigin: 'center center' },
  modalHint: { fontSize: '11px', color: '#5a7a8a', textAlign: 'center', padding: '12px', margin: 0, flexShrink: 0 },
}