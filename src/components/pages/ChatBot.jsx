import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Strands from './Strands'

// ─────────────────────────────────────────────────────────────
//  KNOWLEDGE BASE
// ─────────────────────────────────────────────────────────────
const KB = [
  { keywords: ['summary of grades', 'grades', 'sog'],
    answer: "For claiming your **Summary of Grades**, proceed to the Registrar's Window 15 at Building 1, Ground Floor.",
    location: { name: "Window 15 - Registrar", query: "Window 15 - Registrar" }, 
    windows: 'Proceed to Window 15.' },

  { keywords: ['prospectus', 'curriculum', 'evaluation', 'grade evaluation'],
    answer: "Updating Prospectus and Grade Evaluation are released and processed at the **Registrar's Window 1 & 3, Building 1 - Ground Floor**.",
    location: { name: "Window 3 - Registrar", query: "Window 3 - Registrar" }, 
    windows: 'Proceed to Window 3.' },

  { keywords: ['ctp', 'wes', 'cav', 'tesda'],
    answer: "For **CTP, WES,** and **CAV FOR TESDA**, visit the Registrar's Window 4 at Building 1, Ground Floor.",
    location: { name: "Window 4 - Registrar", query: "Window 4 - Registrar" },
    windows: 'Proceed to Window 4.' },

  { keywords: ['f137', 'tor', 'nstp serial no.'],
    answer: "**Request and submission of F137**, **TOR from other school**, **NSTP Serial #**, and **CTC (Certified True Copy)** are processed at the Registrar's Window 6, Building 1, GF.",
    location: { name: "Window 6 - Registrar", query: "Window 6 - Registrar" }, 
    windows: 'Go to Window 6.' },

  { keywords: ['graduation', 'graduation application', 'cav', 'icoc'],
    answer: "**Graduation Application**, **CAV (CHED)**, and **ICOC Submission** are processed and released at the Registrar's Window 7, Building 1, GF.",
    location: { name: "Window 7 - Registrar", query: "Window 7 - Registrar" }, 
    windows: 'Proceed to Window 7.' },
  
  { keywords: ['grade verify', 'verification', 'completion', 'class record', 'faculty clearance'],
    answer: "**Grade Verification and Completion**, and **Submission of Class Record and Faculty Clearance** are processed and released at the Registrar's Window 9, Building 1, GF.",
    location: { name: "Window 9 - Registrar", query: "Window 9 - Registrar" }, 
    windows: 'Proceed to Window 9.' },

  { keywords: ['credentials', 'ctc'],
    answer: "**Releasing of Credentials / CTC (Certified True Copy)** is processed and released at the Registrar's Window 12, Building 1, GF.",
    location: { name: "Window 12 - Registrar", query: "Window 12 - Registrar" }, 
    windows: 'Proceed to Window 12.' },

  { keywords: ['payment', 'fee'],
    answer: 'Proceed to the **Accounting - Window 1 at Building 1, Ground Floor** for payments of other fees.',
    location: { name: 'Window 1 - Accounting', query: 'Window 1 - Accounting' }, 
    windows: 'Proceed to Window 1.' },

  { keywords: ['cash', 'cash payment', 'tuition fees'],
    answer: 'Proceed to the **Accounting - Window 2, 3, or 4 at Building 1, Ground Floor** for cash payments of Tuition Fees, .',
    location: { name: 'Window 2 - Accounting', query: 'Window 2 - Accounting' }, 
    windows: 'Proceed to Window 2, 3, or 4.' },

  { keywords: ['bank', 'express', 'bank transactions'],
    answer: 'Proceed to the EXPRESS Windows **Accounting - Windows 5 or 6 at Building 1, Ground Floor** for Bank Transaction payments.',
    location: { name: 'Window 5 - Accounting', query: 'Window 5 - Accounting' }, 
    windows: 'Proceed to Window 5 or 6.' },

  { keywords: ['clearance'],
    answer: 'Proceed to the **Accounting - Window 7 or 8 at Building 1, Ground Floor** for Clearance payments.',
    location: { name: 'Window 7 - Accounting', query: 'Window 7 - Accounting' }, 
    windows: 'Proceed to Window 7 or 8.' },

  { keywords: ['refund', 'others'],
    answer: 'Proceed to the **Accounting - Window 9 at Building 1, Ground Floor** for refunds and other payments.',
    location: { name: 'Window 9 - Accounting', query: 'Window 9 - Accounting' }, 
    windows: 'Proceed to Window 9.' },

  { keywords: ['nstp', 'national service'],
    answer: 'For NSTP concerns, visit the **NSTP Office** at Building 1, Ground Floor.',
    location: { name: 'NSTP Office', query: 'NSTP Office' },},

  { keywords: ['student affairs', 'organization', 'club'],
    answer: 'For student and org concerns, visit the **Student Affairs Office** at Building 1, GF.',
    location: { name: 'Student Affairs Office', query: 'Student Affairs Office' },},

  { keywords: ['cdjp', 'discipline', 'violation'],
    answer: 'For discipline concerns, visit the **CDJP Office** at Building 1, Ground Floor.',
    location: { name: 'CDJP Office', query: 'CDJP Office' },},

  { keywords: ['admission', 'apply', 'application', 'new student', 'transferee'],
    answer: 'For admission and application, visit the **Admission Office** at Building 3, Ground Floor.',
    location: { name: 'Admission Office', query: 'Admission Office' },},

  { keywords: ['library', 'lib', 'book', 'reference', 'wifi', 'id',],
    answer: `The **Library** is at Building 2, Ground Floor.

    You can borrow books and review here, also proceed to the Library for School and Library ID processing. Open during school hours!`,
    location: { name: 'Library', query: 'Library' },},

  { keywords: ['clinic', 'nurse', 'sick', 'medicine', 'first aid', 'health'],
    answer: 'The **ICCT Family Clinic** is at Building 3, Ground Floor. The school nurse is there!',
    location: { name: 'Clinic', query: 'Clinic' },},

  { keywords: ['drug test', 'drug testing'],
    answer: 'The **Drug Testing Center** is at Building 3, Ground Floor.',
    location: { name: 'Drug Testing Center', query: 'Drug Testing' },},

  { keywords: ['comlab', 'computer laboratory', 'computer'],
    answer: `Computer Laboratories are at:
    **Building 2 — 2nd Floor**
      • Rooms B2.21 to B2.26.

    **Building 4 — 2nd Floor**
      • Room B4.21 — Cisco Networking Simulation Laboratory
      • Room B4.22 — Foreign Language / Speech Laboratory
      • Room B4.23 — Digital & Robotics Modelling Laboratory
    
    What room number of computer lab are you looking for?`,},

  {
  keywords: ['lecture', 'room', 'lec'],
  answer: `Lecture Rooms are at:
    **Building 2 — 3rd, 4th and 5th Floor** 
      • Rooms B2.31 to B2.38
      • Rooms B2.41 to B2.48
      • Rooms B2.51 to B2.58

    **Building 4 — 3rd, 4th and 5th Floor**
      • Rooms B4.31 to B4.38
      • Rooms B4.41 to B4.38
      • Rooms B4.51 to B4.58

    What lecture room number are you looking for?`,},

  { keywords: ['b2.21'],
    answer: 'The B2.21 Computer Laboratory is located at **Building 2 - Second Floor**.',
    location: { name: 'B2.21', query: 'B2.21' },},
  
  { keywords: ['b2.22'],
    answer: 'The B2.22 Computer Laboratory is located at **Building 2 - Second Floor**.',
    location: { name: 'B2.22', query: 'B2.22' },},

  { keywords: ['b2.23'],
    answer: 'The B2.23 Computer Laboratory is located at **Building 2 - Second Floor**.',
    location: { name: 'B2.23', query: 'B2.23' },},

  { keywords: ['b2.24'],
    answer: 'The B2.24 Computer Laboratory is located at **Building 2 - Second Floor**.',
    location: { name: 'B2.24', query: 'B2.24' },},

  { keywords: ['b2.25'],
    answer: 'The B2.25 Computer Laboratory is located at **Building 2 - Second Floor**.',
    location: { name: 'B2.25', query: 'B2.25' },},

  { keywords: ['b2.26'],
    answer: 'The B2.26 Computer Laboratory is located at **Building 2 - Second Floor**.',
    location: { name: 'B2.26', query: 'B2.26' },},

  { keywords: ['b2.31'],
    answer: 'The B2.31 Lecture Room is located at **Building 2 - Third Floor**.',
    location: { name: 'B2.31', query: 'B2.31' },},

  { keywords: ['b2.32'],
    answer: 'The B2.32 Lecture Room is located at **Building 2 - Third Floor**.',
    location: { name: 'B2.32', query: 'B2.32' },},

  { keywords: ['b2.33'],
    answer: 'The B2.33 Lecture Room is located at **Building 2 - Third Floor**.',
    location: { name: 'B2.33', query: 'B2.33' },},

  { keywords: ['b2.34'],
    answer: 'The B2.34 Lecture Room is located at **Building 2 - Third Floor**.',
    location: { name: 'B2.34', query: 'B2.34' },},

  { keywords: ['b2.35'],
    answer: 'The B2.35 Lecture Room is located at **Building 2 - Third Floor**.',
    location: { name: 'B2.35', query: 'B2.35' },},

  { keywords: ['b2.36'],
    answer: 'The B2.36 Lecture Room is located at **Building 2 - Third Floor**.',
    location: { name: 'B2.36', query: 'B2.36' },},

  { keywords: ['b2.37'],
    answer: 'The B2.37 Lecture Room is located at **Building 2 - Third Floor**.',
    location: { name: 'B2.37', query: 'B2.37' },},

  { keywords: ['b2.38'],
    answer: 'The B2.38 Lecture Room is located at **Building 2 - Third Floor**.',
    location: { name: 'B2.38', query: 'B2.38' },},

  { keywords: ['b2.41'],
    answer: 'The B2.41 - Lecture Room is located at **Building 2 - Fourth Floor**.',
    location: { name: 'B2.41', query: 'B2.41' },},

  { keywords: ['b2.42'],
    answer: 'The B2.42 Lecture Room is located at **Building 2 - Fourth Floor**.',
    location: { name: 'B2.42', query: 'B2.42' },},

  { keywords: ['b2.43'],
    answer: 'The B2.43 Lecture Room is located at **Building 2 - Fourth Floor**.',
    location: { name: 'B2.43', query: 'B2.43' },},

  { keywords: ['b2.44'],
    answer: 'The B2.44 Lecture Room is located at **Building 2 - Fourth Floor**.',
    location: { name: 'B2.44', query: 'B2.44' },},

  { keywords: ['b2.45'],
    answer: 'The B2.45 Lecture Room is located at **Building 2 - Fourth Floor**.',
    location: { name: 'B2.45', query: 'B2.45' },},

  { keywords: ['b2.46'],
    answer: 'The B2.46 Lecture Room is located at **Building 2 - Fourth Floor**.',
    location: { name: 'B2.46', query: 'B2.46' },},

  { keywords: ['b2.47'],
    answer: 'The B2.47 Lecture Room is located at **Building 2 - Fourth Floor**.',
    location: { name: 'B2.47', query: 'B2.47' },},

  { keywords: ['b2.48'],
    answer: 'The B2.48 Lecture Room is located at **Building 2 - Fourth Floor**.',
    location: { name: 'B2.48', query: 'B2.48' },},

  { keywords: ['b4.21', 'cisco', 'networking'],
    answer: 'The Cisco Networking Simulation Laboratory or B4.21 is located at **Building 4 — Second Floor**. This laboratory is for Networking and Cisco certification training.',
    location: { name: 'B4.21', query: 'B4.21' },},

  { keywords: ['b4.22', 'speech', 'foreign language'],
    answer: `The Foreign Language / Speech Laboratory or B4.22 is located at **Building 4 — Second Floor**.
    
    Speech laboratory is for developing communication, pronounciation, listening, and public speaking skills through guided language and speech activities.`,
    location: { name: 'B4.22', query: 'B4.22' },},

  { keywords: ['b4.23', 'drm', 'digital', 'robotics'],
    answer: `The Digital & Robotics Modelling Laboratory or B4.23 is located at **Building 4 — Second Floor**.
    
    This laboratory is for robotics and digital design coursework. This room is also used for class lectures.`,
    location: { name: 'B4.23', query: 'B4.23' },},

  { keywords: ['b4.24', 'e-learning', 'hub'],
    answer: `The E-Learning Hub or B4.24 is located at **Building 4 — Second Floor**.
    
    E-Learning Hub is for class lectures and instructor's digital/online learning.`,
    location: { name: 'B4.24', query: 'B4.24' },},

  { keywords: ['b4.25', 'senior high', 'department', 'shs', 'shs faculty'],
    answer: `The Senior High School Department or B4.25 is located at **Building 4 — Second Floor**.
    
    SHS Department is an office responsible for senior high school programs, student services, and academic concerns.`,
    location: { name: 'B4.25', query: 'B4.25' },},

  { keywords: ['gym', 'gymnasium', 'pe', 'p.e.'],
    answer: 'The **Gymnasium** is at Building 2, 6th Floor.',
    location: { name: 'P.E. Gymnasium', query: 'P.E. Gymnasium' },},

  { keywords: ['court', 'basketball'],
    answer: 'The **Basketball Court** is at Building 3, 3rd Floor.',
    location: { name: 'Basketball Court', query: 'Basketball Court' },},

  { keywords: ['volleyball', 'badminton'],
    answer: 'The **Volleyball/Badminton Court** or **Gymnasium** is at Building 1, 3rd Floor.',
    location: { name: 'Volleyball / Badminton Court', query: 'Volleyball / Badminton Court' },},

  { keywords: ['entrance', 'enter', 'main gate', 'pasok'],
    answer: 'The main **Entrance** is at Building 3, Ground Floor near the security guard.',
    location: { name: 'Entrance', query: 'Entrance' },},
    
  { keywords: ['exit', 'go out', 'out', 'labas'],
    answer: 'The **Exit** is at Building 1, Ground Floor.',
    location: { name: 'Exit', query: 'Exit' },},

  { keywords: ['food', 'food hall', 'food court', 'pagkain'],
    answer: 'The **Food Court** is at Building 3, 3rd Floor.',
    location: { name: 'Food Court', query: 'Food Court' },},

  { keywords: ['hrm', 'tools', 'equipments'],
    answer: 'The HRM Tools and Equipments is located at **Building 2, Ground Floor**.',
    location: { name: 'HRM Tools & Equipment', query: 'HRM Tools & Equipment' },},

  { keywords: ['computer hardware', 'electronics', 'electrical', 'b2.11'],
    answer: 'The B2.11 or Computer Hardware Servicing / Electronics/Electrical Room is located at **Building 2, Ground Floor**.',
    location: { name: 'B2.11', query: 'B2.11' },},

  { keywords: ['avr', 'b2.12'],
    answer: 'The B2.12 or Academic Lecture Room, AVR Extension Room-2 is located at **Building 2, Ground Floor**.',
    location: { name: 'B2.12', query: 'B2.12' },},

  { keywords: ['supply', 'uniform', 'id lace', 'jogging pants', 'tshirt', 'booklet'],
    answer: `The Supply Section is located at **Building 2, Ground Floor** beside Library. You can claim here your uniform, booklet, id lace, and etc.`,
    location: { name: 'Supply Section', query: 'Supply Section'},},

  { keywords: ['chemistry', 'chem', 'dark', 'experiment', 'b4.11'],
    answer: `Chemistry Laboratory / Dark Room or B4.11 is located at **Building 4 — Ground floor**. This laboratory is for chemistry experiments and photography development.`,
    location: { name: 'B4.11', query: 'B4.11' },},

  { keywords: ['chemistry', 'chem', 'dark', 'experiment', 'b4.11'],
    answer: `Chemistry Laboratory / Dark Room or B4.11 is located at **Building 4 — Ground floor**. This laboratory is for chemistry experiments and photography development.`,
    location: { name: 'B4.11', query: 'B4.11' },},

  { keywords: ['b4.13', 'engineering lab'],
    answer: `The Engineering Laboratory is located at **Building 4 - Ground Floor**. A hands-on space for engineering coursework and projects.`,
    location: { name: 'B4.13', query: 'B4.13'},},
  
  { keywords: ['b4.14', 'forensic lab'],
    answer: `The Forensic Laboratory is located at **Building 4 - Ground Floor**. This laboratory is for forensic science training and analysis.`,
    location: { name: 'B4.14', query: 'B4.14'},},

  { keywords: ['culinary', 'demo', 'cooking', 'b4.15'],
    answer: `Culinary Demo Room  or B4.15 is located at **Building 4 — Ground floor**. This room is for culinary instruction and cooking demonstrations.`,
    location: { name: 'B4.15', query: 'B4.15' },},

  { keywords: ['function', 'b4.16'],
    answer: `Function Room or B4.16 is located at **Building 4 — Ground floor**. This is a multi-purpose room for events and gatherings.`,
    location: { name: 'B4.16', query: 'B4.16' },},

  { keywords: ['cold', 'pastry', 'pastries', 'salad', 'b4.17'],
    answer: `Cold Kitchen or B4.17 is located at **Building 4 — Ground floor**. This kitchen is for food prep that doesn't require cooking, like salads and pastries.`,
    location: { name: 'B4.17', query: 'B4.17' },},

  { keywords: ['hot', 'cook', 'cooking', 'b4.18'],
    answer: `Hot Kitchen or B4.18 is located at **Building 4 — Ground floor**. This room is for cooking-based culinary training.`,
    location: { name: 'B4.18', query: 'B4.18' },},
  
  { keywords: ['coordinators'],
    answer: `The Office of the College Deans and Academic Coordinators is located at **Building 1 — Second Floor** beside Faculty Room & Lounge.`,
    location: { name: 'Office of the College Deans and Academic Coordinators', query: 'Office of the College Deans and Academic Coordinators'},},

  { keywords: ['faculty', 'teachers', 'professors'],
    answer: `The Faculty Room & Lounge is located at **Building 1 — Second Floor**.
    
    Faculty Room & Lounge is a private area exclusively for faculty instructors to rest or prepare for classes and other duties.`,
    location: { name: 'Faculty Room & Lounge', query: 'Faculty Room & Lounge'},},

  { keywords: ['academic affairs', 'policies', 'vice president'],
    answer: `Academic Affairs Office is located at **Building 1 — Second floor** near Office of the College Deans Office.
    
    Academic Affairs Office is responsible for managing academic programs, policies, and other academic services.`,
    location: { name: 'Academic Affairs Office', query: 'Academic Affairs Office'},},

  { keywords: ['online class', 'distance learning', 'odel'],
    answer: `Online Teaching Hub is located at **Building 1 — Second floor** beside Academic Affairs Office.
    
    Online Teaching Hub is exclusively for faculty members. This room is dedicated for online and distance learning classes.`,
    location: { name: 'Online Teaching Hub', query: 'Online Teaching Hub'},},
    
  { keywords: ['b1.21', 'judicial court'],
    answer: `Judicial Court Simulation Lab or B1.21 is located at **Building 1 — Second floor** beside Multi-Purpose Academic Hall.
    
    The Judicial Court Simulation Laboratory is a mock court room where students practice real courtroom proceedings, exclusively for criminology department.`,
    location: { name: 'B1.21', query: 'B1.21'},},

  { keywords: ['deans', 'consultation room'],
    answer: `Office of the College Deans - Academic Consultation Room 2 & 3  is located at **Building 1 — Second floor** beside Judicial Court Simulation Lab.
    
    The office of the college deans is responsible for managing academic programs, supervising faculty, and addressing student academic concerns. It is a consultation room for student-faculty academic meetings.`,
    location: { name: 'Office of the College Deans', query: 'Office of the College Deans'},},

  { keywords: ['chairman', 'consultation room'],
    answer: `Office of the Chairman is located at **Building 3 — Second floor**.
    
    Office of the Chairman is executive office responsible for institutional leadership.`,
    location: { name: 'Office of the Chairman', query: 'Office of the Chairman'},},

  { keywords: ['tba'],
    answer: 'First year? **FIRST YEAR KA NO?** Punta ka lang sa ituturo ng map, ingat ka ha HAHAHAHAHAHA!',
    location: { name: 'Exit', query: 'Exit' },},

  { keywords: ['chemistry', 'chem', 'dark', 'b4.11'],
    answer: `Chemistry Laboratory / Dark Room or B4.11 is located at **Building 1 — Ground floor**. This laboratory is for chemistry experiments and photography development.`,
    location: { name: 'B4.11', query: 'B4.11' },},

  { keywords: ['physics', 'b4.11'],
    answer: `Physics Laboratory or B4.12 is located at **Building 1 — Ground floor**. This laboratory is for physics experiments and demonstrations.`,
    location: { name: 'B4.12', query: 'B4.12' },},
]

const QUICK_REPLIES = [
  { label: '📚 Summary of Grades', msg: 'Where do I get Summary of Grades?' },
  { label: '📄 Prospectus',        msg: 'What window is for Prospectus?' },
  { label: '💰 Pay tuition fees',  msg: 'Where do I pay my tuition fees?' },
  { label: '🏥 Clinic',            msg: 'Where is the clinic?' },
  { label: '📖 Library',           msg: 'Where is the library?' },
  { label: '🎓 Guidance Office',   msg: 'Where is the Guidance Office?' },
  { label: '🆔 Student ID',        msg: 'Where do I get my student ID?' },
  { label: '🏫 Admission',         msg: 'Where is the Admission Office?' },
  { label: '💌 TBA',               msg: 'Where is Room TBA?' },
]

const KEYBOARD_ROWS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M','⌫'],
]

const STRANDS_COLORS = ["#6f570d","#091dae","#5a0822"]

const INITIAL_MSG = [{ from: 'bot', text: `Hi there ICCTnians! Welcome to ICCT Colleges' Smart Campus Navigation and Concierge Kiosk.

  I am BotBot, your virtual navigation assistant. How can I assist you today? Tell me your desired destination, and I will provide directions to navigate for you.`, time: new Date().toISOString() }]
const FAB_SIZE = 96
const FAB_MARGIN = 16

function getResponse(input) {
  const q = input.toLowerCase()
  for (const item of KB) {
    if (item.keywords.some(k => q.includes(k))) return item
  }
  return null
}

function formatText(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} style={{ color: '#6eb6ff' }}>{part}</strong> : part
  )
}

// ─────────────────────────────────────────────────────────────
//  CHATBOT COMPONENT
// ─────────────────────────────────────────────────────────────
export default function ChatBot() {
  const navigate = useNavigate()

  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('chatbot_messages')
      if (saved) return JSON.parse(saved).map(m => ({ ...m, time: new Date(m.time) }))
    } catch (e) {
      console.error('Failed to load chatbot messages from sessionStorage:', e)
    }
    return INITIAL_MSG.map(m => ({ ...m, time: new Date(m.time) }))
  })

  const [open,        setOpen]        = useState(false)
  const [input,       setInput]       = useState('')
  const [typing,      setTyping]      = useState(false)
  const [capsOn,      setCapsOn]      = useState(true)
  const [showKeyboard,setShowKeyboard]= useState(false)
  const messagesEndRef = useRef(null)
  const overlayRef     = useRef(null)

  // ---- Draggable FAB position ----
  const [fabPos, setFabPos] = useState(() => ({
    x: window.innerWidth - FAB_SIZE - 96,
    y: window.innerHeight - FAB_SIZE - 96,
  }))
  const dragState = useRef({ dragging: false, moved: false, startX: 0, startY: 0, origX: 0, origY: 0 })

  const clampPos = useCallback((x, y) => {
    const maxX = window.innerWidth - FAB_SIZE - FAB_MARGIN
    const maxY = window.innerHeight - FAB_SIZE - FAB_MARGIN
    return {
      x: Math.min(Math.max(x, FAB_MARGIN), Math.max(maxX, FAB_MARGIN)),
      y: Math.min(Math.max(y, FAB_MARGIN), Math.max(maxY, FAB_MARGIN)),
    }
  }, [])

  useEffect(() => {
    const onResize = () => setFabPos(p => clampPos(p.x, p.y))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [clampPos])

  const handleDragStart = (clientX, clientY) => {
    dragState.current = {
      dragging: true, moved: false,
      startX: clientX, startY: clientY,
      origX: fabPos.x, origY: fabPos.y,
      startTime: Date.now(),
    }
  }
  const handleDragMove = useCallback((clientX, clientY) => {
    if (!dragState.current.dragging) return
    const dx = clientX - dragState.current.startX
    const dy = clientY - dragState.current.startY
    if (Math.abs(dx) > 12 || Math.abs(dy) > 12) dragState.current.moved = true
    setFabPos(clampPos(dragState.current.origX + dx, dragState.current.origY + dy))
  }, [clampPos])
  const handleDragEnd = useCallback(() => {
    const elapsed = Date.now() - (dragState.current.startTime || 0)
    const wasMoved = dragState.current.moved && elapsed > 50
    dragState.current.dragging = false
    return wasMoved
  }, [])

  const onFabMouseDown = (e) => { handleDragStart(e.clientX, e.clientY) }
  const onFabTouchStart = (e) => { const t = e.touches[0]; handleDragStart(t.clientX, t.clientY) }
  const onFabClick = () => { if (!dragState.current.moved) { setOpen(p => !p); setShowKeyboard(false) } }

  useEffect(() => {
    const onMouseMove = (e) => handleDragMove(e.clientX, e.clientY)
    const onTouchMove = (e) => { if (dragState.current.dragging) { const t = e.touches[0]; handleDragMove(t.clientX, t.clientY) } }
    const onMouseUp = () => { handleDragEnd() }
    const onTouchEnd = () => { handleDragEnd() }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [handleDragMove, handleDragEnd])

  // ---- Panel position ----
  const panelStyle = (() => {
    const panelW = 600, panelH = 800
    const spaceBelow = window.innerHeight - (fabPos.y + FAB_SIZE)
    const spaceAbove = fabPos.y
    const openUp = spaceAbove > spaceBelow
    const spaceRight = window.innerWidth - fabPos.x
    const openLeft = spaceRight < panelW + 40

    const style = { position: 'fixed', width: `${Math.min(panelW, window.innerWidth - 32)}px`, height: `${Math.min(panelH, window.innerHeight - 32)}px` }
    if (openUp) style.bottom = `${window.innerHeight - fabPos.y + 12}px`
    else style.top = `${fabPos.y + FAB_SIZE + 12}px`
    if (openLeft) style.right = `${window.innerWidth - fabPos.x - FAB_SIZE}px`
    else style.left = `${fabPos.x}px`
    return style
  })()

  useEffect(() => {
    sessionStorage.setItem('chatbot_messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // Auto-close after long idle — extra WebGL safety net
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => setOpen(false), 5 * 60 * 1000)
    return () => clearTimeout(timer)
  }, [open, messages])

  const handleKey = (key) => {
    if (key === '⌫') { setInput(prev => prev.slice(0, -1)); return }
    if (key === '-' || key === '.') { setInput(prev => prev + key); return }
    const char = capsOn ? key.toUpperCase() : key.toLowerCase()
    setInput(prev => prev + char)
  }

  const handleSpace = () => setInput(prev => prev + ' ')

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = { from: 'user', text: text.trim(), time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setShowKeyboard(false)

    setTimeout(() => {
      const match = getResponse(text)
      const botMsg = match
        ? { from: 'bot', text: match.answer, windows: match.windows, location: match.location, time: new Date() }
        : { from: 'bot', text: "I'm not sure about that. Try asking about a specific office or room, or use the **Home page search** to find any location!", time: new Date() }
      setTyping(false)
      setMessages(prev => [...prev, botMsg])
    }, 800)
  }

  const handleViewOnMap = (query) => {
    setOpen(false)
    navigate(`/map?destination=${encodeURIComponent(query)}`)
  }

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      setOpen(false)
      setShowKeyboard(false)
    }
  }

  return (
    <>
      <style>{`

        * { touch-action: manipulation; }

        @keyframes dotBounce {
          0%,80%,100% { transform:translateY(0);opacity:0.4; }
          40% { transform:translateY(-5px);opacity:1; }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(30px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes fabPulse {
          0%,100% { box-shadow:0 0 8px rgba(91,141,239,0.35); }
          50%     { box-shadow:0 0 14px rgba(91,141,239,0.55); }
        }
        @keyframes fabPulseOpen {
          0%,100% { box-shadow:0 0 10px rgba(91,141,239,0.5); }
          50%     { box-shadow:0 0 18px rgba(91,141,239,0.7); }
        }
        @keyframes blink {
          0%,100% { opacity:1; }
          50%     { opacity:0; }
        }
        .chatbot-messages::-webkit-scrollbar { width:4px; }
        .chatbot-messages::-webkit-scrollbar-track { background:transparent; }
        .chatbot-messages::-webkit-scrollbar-thumb { background:#1e3a5f; border-radius:4px; }
      `}</style>

      {/* Overlay */}
      <div ref={overlayRef} onClick={handleOverlayClick} style={{ ...s.overlay, pointerEvents: open ? 'auto' : 'none' }}/>

      {/* Chat panel — anchored near FAB, flips to stay on screen ----------------------------- */}
      {open && (
        <div style={{ ...s.panel, ...panelStyle }}>

          {/* header ----------------------------- */}
          <div style={s.header}>
            <div style={s.headerRow}>
              <p style={s.botName}>CAMPUS BOTBOT</p>
            </div>
            <p style={s.botStatus}>● Online · Smart Navigator</p>
          </div>

          {/* Messages ----------------------------- */}
          <div className="chatbot-messages" style={s.messages}>
            {messages.map((msg, i) => (
              <div key={i} style={{ ...s.msgRow, justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ ...s.bubble, ...(msg.from === 'user' ? s.bubbleUser : s.bubbleBot) }}>
                  <p style={s.bubbleText}>{formatText(msg.text)}</p>
                  {msg.windows && <p style={s.windowHint}>🪟 {msg.windows}</p>}
                  {msg.location && (
                    <button style={s.mapBtn} onClick={() => handleViewOnMap(msg.location.query)}>
                      🗺️ View on Map →
                    </button>
                  )}
                  <p style={s.bubbleTime}>{formatTime(msg.time)}</p>
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ ...s.msgRow, justifyContent: 'flex-start' }}>
                <div style={{ ...s.bubble, ...s.bubbleBot }}>
                  <div style={s.typingDots}>
                    {[0,150,300].map((d,i) => <span key={i} style={{ ...s.dot, animationDelay:`${d}ms` }}/>)}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          {/* Quick replies ALWAYS visible */}
          <div style={s.quickReplies}>
            {QUICK_REPLIES.map((qr, i) => (
              <button key={i} style={s.quickBtn}
                onMouseDown={e => { e.preventDefault(); sendMessage(qr.msg) }}>
                {qr.label}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div style={s.inputRow}>
            <div style={{ ...s.inputDisplay, ...(showKeyboard ? s.inputDisplayActive : {}) }}
              onClick={() => setShowKeyboard(true)}>
              <span style={{ color: input ? 'white' : '#4a7fb5', fontSize: '15px', flex: 1 }}>
                {showKeyboard ? input : (input || 'Tap to type a message...')}
                {showKeyboard && <span style={s.cursor}>|</span>}
              </span>
              {input.length > 0 && (
                <button style={s.clearInput}
                  onMouseDown={e => { e.preventDefault(); setInput('') }}>✕</button>
              )}
            </div>
            <button
              style={{ ...s.sendBtn, ...(input.trim() ? {} : s.sendBtnDisabled) }}
              onMouseDown={e => { e.preventDefault(); if (input.trim()) sendMessage(input) }}>
              ➤
            </button>
          </div>

          {/* Keyboard inside panel */}
          {showKeyboard && (
            <div style={s.keyboard}>
              {KEYBOARD_ROWS.map((row, i) => (
                <div key={i} style={s.keyRow}>
                  {row.map(key => (
                    <button key={key}
                      style={{ ...s.key, ...(key === '⌫' ? s.keyBackspace : {}), ...(key === '-' || key === '.' ? s.keySymbol : {}) }}
                      onMouseDown={e => { e.preventDefault(); handleKey(key) }}>
                      {key === '⌫' ? '⌫' : (key === '-' || key === '.') ? key : capsOn ? key : key.toLowerCase()}
                    </button>
                  ))}
                </div>
              ))}
              <div style={s.keyRow}>
                <button style={{ ...s.key, ...s.keyCaps, ...(capsOn ? s.keyCapsOn : {}) }}
                  onMouseDown={e => { e.preventDefault(); setCapsOn(p => !p) }}>⬆</button>
                <button style={{ ...s.key, ...s.keySpace }}
                  onMouseDown={e => { e.preventDefault(); handleSpace() }}>SPACE</button>
                <button style={{ ...s.key, ...s.keySymbol }}
                  onMouseDown={e => { e.preventDefault(); handleKey('-') }}>-</button>
                <button style={{ ...s.key, ...s.keySymbol }}
                  onMouseDown={e => { e.preventDefault(); handleKey('.') }}>.</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating bubble — draggable, Strands orb */}
      <button
        style={{
          ...s.fab,
          left: `${fabPos.x}px`,
          top: `${fabPos.y}px`,
          animation: open ? 'fabPulseOpen 2s infinite' : 'fabPulse 3s infinite',
          outline: 'none', WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
        onMouseDown={onFabMouseDown}
        onTouchStart={onFabTouchStart}
        onClick={onFabClick}
      >
        <div style={{ width:'100%', height:'100%', borderRadius:'50%', overflow:'hidden', position:'relative', pointerEvents: 'none' }}>
          <Strands
            colors={STRANDS_COLORS}
            count={4} speed={0.6} amplitude={1.4} waviness={1.2}
            thickness={1.0} glow={2.0} taper={2} spread={0.8}
            intensity={0.7} saturation={2} opacity={1} scale={1.1}
            glass refraction={1.1} dispersion={1.0} glassSize={0.7} hueShift={0.1}
          />
        </div>
      </button>
    </>
  )
}

// ── Styles ────────────────────────────────────────────────────
const s = {
  overlay: { position:'fixed', inset:0, zIndex:998, background:'transparent' },

  fab: {
    position:'fixed',
    background:'transparent',
    border:'none', borderRadius:'50%',
    width:`${FAB_SIZE}px`, height:`${FAB_SIZE}px`,
    cursor:'grab', zIndex:1000,
    display:'flex', alignItems:'center', justifyContent:'center',
    overflow:'hidden', padding:0,
  },

  panel: {
    background:'#0f2040',
    border:'1px solid #1e3a5f',
    borderRadius:'20px',
    display:'flex', flexDirection:'column',
    zIndex:999,
    boxShadow:'0 8px 40px rgba(0,0,0,0.6)',
    overflow:'hidden',
    animation:'slideUp 0.25s ease',
    fontFamily:"'Segoe UI', system-ui, sans-serif",
  },

  header: {
    display:'flex', flexDirection:'column', gap:'3px',
    padding:'14px 18px',
    background:'#0a1628',
    borderBottom:'1px solid #1e3a5f',
    flexShrink:0,
  },

  headerRow: { display:'flex', alignItems:'center', gap:'8px' },
  sparkle: { fontSize:'18px' },
  botName:   { fontSize:'20px', fontWeight:'700', color:'white', margin:0 },
  botStatus: { fontSize:'14px', color:'#1d9e75', margin:0 },

  messages: {
    flex:1, overflowY:'auto',
    padding:'20px',
    display:'flex', flexDirection:'column', gap:'25px',
  },

  msgRow: { display:'flex', alignItems:'flex-end', gap:'8px' },

  bubble: { maxWidth:'78%', padding:'12px 14px', borderRadius:'16px', wordBreak:'break-word' },
  bubbleBot:  { background:'#162d55', border:'1px solid #1e3a5f', borderBottomLeftRadius:'4px' },
  bubbleUser: { background:'linear-gradient(135deg, #378add, #1d6fb5)', borderBottomRightRadius:'4px' },
  bubbleText: { fontSize:'15px', color:'white', margin:0, lineHeight:1.6, whiteSpace: 'pre-line'},
  bubbleTime: { fontSize:'13px', color:'#4a7fb5', margin:'5px 0 0', textAlign:'right' },
  windowHint: {
    fontSize:'12px', color:'#dbd668',
    margin:'8px 0 0', padding:'5px 10px',
    background:'#412525', borderRadius:'6px',
    border:'1px solid #221b27',
  },

  mapBtn: {
    marginTop:'10px', width:'100%',
    background:'#378add', border:'none',
    borderRadius:'10px', color:'white',
    fontSize:'14px', fontWeight:'600',
    padding:'9px 14px', cursor:'pointer',
    fontFamily:'inherit',
  },

  typingDots: { display:'flex', gap:'4px', padding:'2px 0' },
  dot: {
    width:'8px', height:'8px',
    background:'#4a7fb5', borderRadius:'50%',
    display:'inline-block',
    animation:'dotBounce 1s infinite',
  },

  quickReplies: {
    display:'flex', flexWrap:'wrap', gap:'6px',
    padding:'20px 14px',
    borderTop:'1px solid #1e3a5f',
    flexShrink:0,
  },

  quickBtn: {
    background:'#0a1628', border:'1px solid #1e3a5f',
    borderRadius:'20px', color:'#6eb6ff',
    fontSize:'12px', padding:'6px 12px',
    cursor:'pointer', fontFamily:'inherit',
    whiteSpace:'nowrap',
  },

  inputRow: {
    display:'flex', gap:'8px',
    padding:'10px 14px',
    borderTop:'1px solid #1e3a5f',
    flexShrink:0,
  },

  inputDisplay: {
    flex:1, background:'#0a1628',
    border:'1px solid #1e3a5f',
    borderRadius:'20px', color:'white',
    padding:'10px 16px', cursor:'pointer',
    display:'flex', alignItems:'center', gap:'8px',
    minHeight:'42px', transition:'border-color 0.2s',
  },

  inputDisplayActive: { border:'1px solid #378add' },
  clearInput: {
    background:'transparent', border:'none',
    color:'#4a7fb5', fontSize:'14px',
    cursor:'pointer', padding:'0 4px', flexShrink:0,
  },

  sendBtn: {
    background:'#378add', border:'none',
    borderRadius:'50%', color:'white',
    fontSize:'18px', width:'42px', height:'42px',
    cursor:'pointer', display:'flex',
    alignItems:'center', justifyContent:'center',
    flexShrink:0,
  },
  sendBtnDisabled: { background:'#1e3a5f', cursor:'not-allowed' },
  cursor: { color:'#6eb6ff', animation:'blink 1s infinite', marginLeft:'2px', fontWeight:'100' },

  keyboard: {
    background:'#070f1e',
    borderTop:'1px solid #1e3a5f',
    padding:'10px 8px',
    flexShrink:0,
  },

  keyRow: {
    display:'flex', justifyContent:'center',
    gap:'5px', marginBottom:'5px',
  },

  key: {
    background:'#162d55', border:'1px solid #1e3a5f',
    borderRadius:'8px', color:'white',
    fontSize:'16px', fontWeight:'600',
    padding:'11px 0', flex:1,
    maxWidth:'42px', cursor:'pointer',
    fontFamily:'inherit',
  },

  keyBackspace: { maxWidth:'48px', background:'#1a1a2e', color:'#ef4444' },
  keySymbol:    { maxWidth:'52px', background:'#0c2d48', color:'#6eb6ff', fontSize:'18px' },
  keyCaps:      { maxWidth:'50px', color:'#4a7fb5' },
  keyCapsOn:    { background:'#1e3a5f', color:'#6eb6ff' },
  keySpace:     { maxWidth:'180px' },
}
