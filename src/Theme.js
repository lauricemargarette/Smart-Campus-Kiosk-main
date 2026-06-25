import { useState, useEffect, useCallback } from 'react'
// Single source of truth for the kiosk's light/dark theme.

export const THEME_STORAGE_KEY = 'kiosk-theme'
const THEME_CHANGE_EVENT = 'kiosk-theme-change'

export const THEMES = {
  dark: {
    mode: 'dark',
    pageBg: 'linear-gradient(135deg, #040816 0%, #07182E 50%, #04111D 100%)',
    textPrimary: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.75)',
    campusOpacity: 0.16,
    campusFilter: 'saturate(0.7) brightness(0.8)',
    campusOverlay: 'linear-gradient(135deg, rgba(4,8,22,0.88) 0%, rgba(7,24,46,0.82) 50%, rgba(4,17,29,0.92) 100%)',
    ambient1: 'rgba(91,141,239,0.10)', ambient2: 'rgba(124,124,240,0.08)', ambient3: 'rgba(167,139,250,0.07)',
    headerBg: 'rgba(7,24,46,0.55)',
    headerBorder: 'rgba(255,255,255,0.08)',
    glassBg: 'rgba(10,25,42,0.5)',
    glassBgActive: 'rgba(10,25,42,0.7)',
    glassBorder: 'rgba(255,255,255,0.1)',
    glassShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
    dropdownBg: 'rgba(7,18,32,0.92)',
    dropdownShadow: '0 16px 48px rgba(0,0,0,0.4)',
    chipBg: 'rgba(255,255,255,0.05)',
    chipBorder: 'rgba(255,255,255,0.1)',
    chipText: '#c8e0eb',
    keyboardBg: 'rgba(7,18,32,0.55)',
    keyboardBorder: 'rgba(255,255,255,0.08)',
    keyboardShadow: '0 16px 48px rgba(0,0,0,0.35)',
    keyBg: 'rgba(255,255,255,0.05)',
    keyBorder: 'rgba(255,255,255,0.1)',
    keyText: '#ffffff',
    cardBackBg: 'rgba(7,18,32,0.72)',
    cardBackBorder: 'rgba(255,255,255,0.08)',
    cardBackShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
    miniMapBg: '#081420',
    accent: '#5B8DEF', accentSoft: '#7C9CF0', accentText: '#9B9BF5',
    toggleTrackBg: 'rgba(255,255,255,0.08)',
    toggleTrackBorder: 'rgba(255,255,255,0.12)',
    toggleKnobBg: 'linear-gradient(135deg, #5B8DEF, #A78BFA)',
    toggleIconColor: '#04141f',
    mapCanvasBg: '#070d1a',
    mapCanvasBorder: '#1a2744',
    mapCanvasShadow: '0 8px 32px rgba(0,0,0,0.3)',
    mapBuildingFill: '#0d1b2e',
    mapBuildingStroke: '#1a3a5c',
    mapRoomStroke: '#1a3a5c',
    mapRoomLabel: '#ffffff',
    mapFloorLabel: '#ffffff',
    mapEdgeIdle: '#1a3a5c',
    mapEdgeOnPath: '#2c6b94',
    mapEdgeCurrent: '#38bdf8',
    mapPillBg: '#111e35',
    mapPillBgDest: '#378add',
    mapNodeFill: '#0d1b2e',
    mapNodeText: '#ffffff',
    // dark theme — roomFillByType
      roomFillByType: {
        office:      '#112240',
        facility:    '#112240',
        stairs:      '#112240',
        elevator:    '#112240',
        laboratory:  '#112240',
        room:        '#112240',
        chairs:      '#112240',
        hallway:     '#112240',
        building:    '#112240',
        library:     '#112240',
        lounge:      '#112240',
        clinic:      '#112240',
        entrance:    '#112240',
        exit:        '#112240',
        gym:         '#112240',
        theatre:     '#112240',
        faculty:     '#112240',
        registrar:   '#112240',
        accounting:  '#112240',
      },
  },
  light: {
    mode: 'light',
    pageBg: 'linear-gradient(135deg, #c7cfdb 0%, #b9c4d4 50%, #c3ccd9 100%)',
    textPrimary: '#101c2c',
    textMuted: '#46586b',
    campusOpacity: 0.30,
    campusFilter: 'saturate(0.85) brightness(0.95)',
    campusOverlay: 'linear-gradient(135deg, rgba(199,207,219,0.85) 0%, rgba(185,196,212,0.80) 50%, rgba(195,204,217,0.88) 100%)',
    ambient1: 'rgba(63,111,216,0.20)', ambient2: 'rgba(124,124,240,0.16)', ambient3: 'rgba(140,110,220,0.14)',
    headerBg: 'rgba(255,255,255,0.45)',
    headerBorder: 'rgba(16,38,58,0.14)',
    glassBg: 'rgba(255,255,255,0.38)',
    glassBgActive: 'rgba(255,255,255,0.58)',
    glassBorder: 'rgba(16,38,58,0.16)',
    glassShadow: '0 8px 32px rgba(15,28,44,0.18), inset 0 1px 0 rgba(255,255,255,0.5)',
    dropdownBg: 'rgba(225,231,240,0.95)',
    dropdownShadow: '0 16px 48px rgba(15,28,44,0.28)',
    chipBg: 'rgba(16,38,58,0.07)',
    chipBorder: 'rgba(16,38,58,0.16)',
    chipText: '#16263a',
    keyboardBg: 'rgba(255,255,255,0.42)',
    keyboardBorder: 'rgba(16,38,58,0.14)',
    keyboardShadow: '0 16px 48px rgba(15,28,44,0.22)',
    keyBg: 'rgba(255,255,255,0.5)',
    keyBorder: 'rgba(16,38,58,0.16)',
    keyText: '#101c2c',
    cardBackBg: 'rgba(225,231,240,0.85)',
    cardBackBorder: 'rgba(16,38,58,0.14)',
    cardBackShadow: '0 8px 32px rgba(15,28,44,0.22), inset 0 1px 0 rgba(255,255,255,0.5)',
    miniMapBg: '#dbe2ec',
    accent: '#2E56B8', accentSoft: '#2E56B8', accentText: '#3A4DC2',
    toggleTrackBg: 'rgba(16,38,58,0.14)',
    toggleTrackBorder: 'rgba(16,38,58,0.2)',
    toggleKnobBg: 'linear-gradient(135deg, #E8B411, #F2934A)',
    toggleIconColor: '#352405',
    mapCanvasBg: '#dde4ec',
    mapCanvasBorder: '#b9c4d4',
    mapCanvasShadow: '0 8px 32px rgba(15,28,44,0.18)',
    mapBuildingFill: '#cdd6e2',
    mapBuildingStroke: '#9fb0c4',
    mapRoomStroke: '#aab8c8',
    mapRoomLabel: '#4a6a82',
    mapFloorLabel: '#7488a0',
    mapEdgeIdle: '#aab8c8',
    mapEdgeOnPath: '#3f7ab0',
    mapEdgeCurrent: '#1d7fd1',
    mapPillBg: '#eef2f8',
    mapPillBgDest: '#2E56B8',
    mapNodeFill: '#cdd6e2',
    mapNodeText: '#335f99',
    // light theme — roomFillByType
    roomFillByType: {
      office:      '#ffffff',
      facility:    '#ffffff',
      stairs:      '#ffffff',
      elevator:    '#ffffff',
      laboratory:  '#ffffff',
      room:        '#ffffff',
      chairs:      '#ffffff',
      hallway:     '#ffffff',
      building:    '#ffffff',
      library:     '#ffffff',
      lounge:      '#ffffff',
      clinic:      '#ffffff',
      entrance:    '#ffffff',
      exit:        '#ffffff',
      gym:         '#ffffff',
      theatre:     '#ffffff',
      faculty:     '#ffffff',
      registrar:   '#ffffff',
      accounting:  '#ffffff',
    },
  },
}

function readStoredTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'dark'
  } catch {
    return 'dark'
  }
}

// Shared hook: any page can call useTheme() to get { theme, themeMode, setThemeMode }.
// All instances across the app (Home, MapPage, future pages) stay in sync:
// - same tab: via the custom 'kiosk-theme-change' event dispatched on write
// - other tabs/windows: via the native 'storage' event
export function useTheme() {
  const [themeMode, setThemeModeState] = useState(readStoredTheme)

  useEffect(() => {
    const syncFromStorage = () => setThemeModeState(readStoredTheme())

    const onCustomChange = (e) => {
      if (e.detail === 'light' || e.detail === 'dark') setThemeModeState(e.detail)
      else syncFromStorage()
    }
    const onStorage = (e) => {
      if (!e.key || e.key === THEME_STORAGE_KEY) syncFromStorage()
    }

    window.addEventListener(THEME_CHANGE_EVENT, onCustomChange)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, onCustomChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const setThemeMode = useCallback((next) => {
    setThemeModeState(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
      window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: next }))
    } catch { 
      //empty statement
     }
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark')
  }, [themeMode, setThemeMode])

  return { theme: THEMES[themeMode], themeMode, setThemeMode, toggleTheme }
}