// ─────────────────────────────────────────────────────────────
//  ICCT Cainta Campus — Map Data
//
//  This file contains:
//  1. LOCATIONS  — all nodes (rooms, hallways, kiosk)
//  2. EDGES      — walkable connections between nodes
//  3. FLOOR_BLOCKS — visual room rectangles for SVG drawing
//
//  A* pathfinding → handled by Django backend API
//  When backend is ready, replace fetchNavigation() with
//  a real fetch() call to /api/navigate/
//
//  Coordinate system: grid units (22 wide × 22 tall)
//  Campus layout:
//    [Building 4][Building 2]  ← top    (y: 0–10)
//    [Building 3][Building 1]  ← bottom (y: 11–21)
// ─────────────────────────────────────────────────────────────

export const KIOSK_NODE_ID = "kiosk"
export const SCALE = { W: 640, H: 480, PAD: 24, xM: 22, yM: 22 }

// ── Scale helpers (grid units → SVG pixels) ──────────────────
export const sx = x => SCALE.PAD + (x / SCALE.xM) * (SCALE.W - SCALE.PAD * 2)
export const sy = y => SCALE.PAD + (y / SCALE.yM) * (SCALE.H - SCALE.PAD * 2)

export const LOCATIONS = [
  // ── Kiosk ───────────────────────────────────────────────────
  { id:"kiosk", name: "Kiosk (You Are Here)", floor:1, x:6.3, y:9.5, type:"kiosk", desc:"Smart Campus Navigation Kiosk — beside the elevator." },

  // ── Building 1 — Ground Floor ──────────────────────────────
  { id:15, name:"Registrar - Window 1",   floor:1, building:1, x:15,   y:11,   type:'registrar', desc:'Registrar Office - Window 1' },
  { id:16, name:"Registrar - Window 2",   floor:1, building:1, x:13.8, y:11,   type:'registrar', desc:'Registrar Office - Window 2' },
  { id:17, name:'Registrar - Window 3',   floor:1, building:1, x:12.5, y:11,   type:'registrar', desc:'Registrar Office - Window 3' },
  { id:18, name:'Registrar - Window 4',   floor:1, building:1, x:11.5, y:11.4, type:'registrar', desc:'Registrar Office - Window 4' },
  { id:19, name:'Registrar - Window 5',   floor:1, building:1, x:11.5, y:12.5, type:'registrar', desc:'Registrar Office - Window 5' },
  { id:20, name:'Registrar - Window 6',   floor:1, building:1, x:11.5, y:13.6, type:'registrar', desc:'Registrar Office - Window 6' },
  { id:21, name:'Registrar - Window 7',   floor:1, building:1, x:11.5, y:14.7, type:'registrar', desc:'Registrar Office - Window 7' },
  { id:22, name:'Registrar - Window 8',   floor:1, building:1, x:11.5, y:15.9, type:'registrar', desc:'Registrar Office - Window 8' },
  { id:23, name:'Registrar - Window 9',   floor:1, building:1, x:11.5, y:17.1, type:'registrar', desc:'Registrar Office - Window 9' },
  { id:24, name:'Registrar - Window 12',  floor:1, building:1, x:11.5, y:18.3, type:'registrar', desc:'Registrar Office - Window 12' },
  { id:25, name:'Registrar - Window 14',  floor:1, building:1, x:11.5, y:19.4, type:'registrar', desc:'Registrar Office - Window 14' },
  { id:26, name:'Registrar - Window 15',  floor:1, building:1, x:11.5, y:20.6, type:'registrar', desc:'Registrar Office - Window 15' },
  { id:27, name:"Registrar's Office",     floor:1, building:1, x:15.5, y:13,   type:'office', desc:'Registrar Office' },
  { id:28, name:'Student Affairs Office', floor:1, building:1, x:15.5, y:18,   type:'office',    desc:'Student Affairs Office.' },
  { id:29, name:'CDJP Office',            floor:1, building:1, x:15.5, y:20,   type:'office',    desc:'CDJP office.' },
  { id:30, name:'Exit',                   floor:1, building:1, x:16.5, y:21,   type:'exit',      desc:'Exit.' },
  { id:31, name:'Guidance Office',        floor:1, building:1, x:17.5, y:20,   type:'office',    desc:'Guidance office.' },
  { id:32, name:'NSTP Office',            floor:1, building:1, x:17.5, y:17,   type:'office',    desc:'NSTP office.' },
  { id:33, name:'Accounting Office',      floor:1, building:1, x:17.5, y:13,   type:'accounting',desc:'Accounting Office' },
  { id:34, name:'Accounting - Window 1',  floor:1, building:1, x:17.7, y:11,   type:'accounting',desc:'Accounting Office - Window 1' },
  { id:35, name:'Accounting - Window 2',  floor:1, building:1, x:18.3, y:11,   type:'accounting',desc:'Accounting Office - Window 2' },
  { id:36, name:'Accounting - Window 3',  floor:1, building:1, x:18.9, y:11,   type:'accounting',desc:'Accounting Office - Window 3' },
  { id:37, name:'Accounting - Window 4',  floor:1, building:1, x:19.5, y:11,   type:'accounting',desc:'Accounting Office - Window 4' },
  { id:38, name:'Accounting - Window 5',  floor:1, building:1, x:20.1, y:11,   type:'accounting',desc:'Accounting Office - Window 5' },
  { id:39, name:'Accounting - Window 6',  floor:1, building:1, x:20.5, y:12.1, type:'accounting',desc:'Accounting Office - Window 6' },
  { id:40, name:'Accounting - Window 7',  floor:1, building:1, x:20.5, y:13.2, type:'accounting',desc:'Accounting Office - Window 7' },
  { id:41, name:'Accounting - Window 8',  floor:1, building:1, x:20.5, y:14.3, type:'accounting',desc:'Accounting Office - Window 8' },
  { id:42, name:'Accounting - Window 9',  floor:1, building:1, x:20.5, y:15.4, type:'accounting',desc:'Accounting Office - Window 9' },

  // ── Building 2 — Ground Floor ──────────────────────────────
  { id:10, name:'HRM Tools & Equipment',  floor:1, building:2, x:11.5, y:4,    type:'laboratory',desc:'HRM Tools and Equipment.' },
  { id:11, name:'B2.11',                  floor:1, building:2, x:17,   y:8,    type:'laboratory',desc:'Computer Hardware Servicing, Electronics/Electrical Room.' },
  { id:12, name:'B2.12',                  floor:1, building:2, x:15,   y:8,    type:'room',      desc:'Academic Lecture Room, AVR Extension Room-2.' },
  { id:13, name:'Supply Section',         floor:1, building:2, x:20.5, y:4,    type:'facility',  desc:'Handles procurement and inventory management for the college.' },
  { id:14, name:'Library',                floor:1, building:2, x:20.5, y:1.5,  type:'library',   desc:'Provides study resources and study area for student research and reading.' },

  // ── Building 3 — Ground Floor ──────────────────────────────
  { id:1,  name:'Entrance',               floor:1, building:3, x:5.5,  y:21,   type:'entrance',  desc:'Security gate, visitor logbook & entrance.' },
  { id:2,  name:'Admission Office',       floor:1, building:3, x:6.5,  y:19.8, type:'office',    desc:'Admission office for enrolees and students.' },
  { id:3,  name:'Clinic',                 floor:1, building:3, x:4.5,  y:18.5, type:'clinic',    desc:'School nurse, first aid.' },
  { id:4,  name:'Testing Room',           floor:1, building:3, x:6.5,  y:17.5, type:'office',    desc:'Testing room.' },
  { id:5,  name:'Social Lounge',          floor:1, building:3, x:6.5,  y:13.5, type:'lounge',    desc:'Lounge area for visitors.' },
  { id:6,  name:'Drug Testing Center',    floor:1, building:3, x:4.5,  y:12,   type:'clinic',    desc:'Drug testing services.' },

  // ── Building 4 — Ground Floor ──────────────────────────────
  { id:8,  name:'B4.13',                  floor:1, building:4, x:10.5, y:6.5,  type:'laboratory',desc:'Engineering Laboratory.' },
  { id:9,  name:'B4.14',                  floor:1, building:4, x:10.5, y:4,    type:'laboratory',desc:'Criminology/Forensic Laboratory.' },

  // ── Building 1 — 2nd Floor ─────────────────────────────────
  { id:48, name:"Office of the College Deans and Academic Coordinators", floor:2, building:1, x:16.5, y:12, type:"office", desc:'College deans and coordinators office.'},
  { id:49, name:"Faculty Room & Lounge",                                 floor:2, building:1, x:15.3, y:13.3, type:"facility", desc:"Academic Teacher's Faculty Room."},
  { id:50, name:"Academic Affairs Office",                               floor:2, building:1, x:14.8, y:17, type:"office", desc:"Office of the Vice President."},
  { id:51, name:"Online Teaching Hub",                                   floor:2, building:1, x:14.8, y:18.8, type:"facility", desc:"ODEL / Open & Distance E-Learning."},
  { id:52, name:"B1.21",                                                 floor:2, building:1, x:17.8, y:13.3, type:"laboratory", desc:"Judicial Court Simulation Laboratory."},
  { id:53, name:"Multi-Purpose Academic Hall",                           floor:2, building:1, x:17.8, y:15.5, type:"office", desc:"Multi-Purpose Academic Hall."},
  { id:54, name:"B1.21",                                                 floor:2, building:1, x:17.8, y:17.5, type:"laboratory", desc:"Judicial Court Simulation Laboratory."},
  { id:55, name:"Office of the College Deans",                           floor:2, building:1, x:17.8, y:18.8, type:"laboratory", desc:"Academic Consultation Room 2 & 3."},

  // ── Building 2 — 2nd Floor ─────────────────────────────────
  { id:"C1",  name:"B2.21",               floor:2, building: 2, x:15.5, y:6.5, type:"laboratory", desc:"Computer Laboratory 21." },
  { id:"C2",  name:"B2.22",               floor:2, building: 2, x:15.5, y:3.8, type:"laboratory", desc:"Computer Laboratory 22." },
  { id:"C3",  name:"B2.23",               floor:2, building: 2, x:15.5, y:2,   type:"laboratory", desc:"Computer Laboratory 23." },
  { id:"C4",  name:"B2.24",               floor:2, building: 2, x:17.5, y:6.5, type:"laboratory", desc:"Computer Laboratory 24." },
  { id:"C5",  name:"B2.25",               floor:2, building: 2, x:17.5, y:3.8, type:"laboratory", desc:"Computer Laboratory 25." },
  { id:"C6",  name:"B2.26",               floor:2, building: 2, x:17.5, y:2,   type:"laboratory", desc:"Computer Laboratory 26." },
  { id:"MIS", name:"MIS Faculty",         floor:2, building: 2, x:16.5, y:1.5, type:"faculty",    desc:"Management Information Systems Room." },

  // ── Building 3 — 2nd Floor ─────────────────────────────────
  { id:56, name:"MIS Department",         floor:2, building:3,  x:7,    y:13.3, type:"office",    desc:"Technical office of MIS Employees."},
  { id:57, name:"Broadcasting Room",      floor:2, building:3,  x:7,    y:17.5, type:"room",      desc:"For broadcasting."},
  { id:58, name:"Media Arts Center",      floor:2, building:3,  x:7,    y:19.3, type:"room",      desc:"For media arts."},
  { id:59, name:"Office of the Chairman", floor:2, building:3,  x:4,    y:19.3, type:"office",    desc:"For chairman."},
  { id:60, name:"Boardroom",              floor:2, building:3,  x:4,    y:16,   type:"facility",  desc:"For board."},
  { id:61, name:"Boardroom",              floor:2, building:3,  x:4,    y:13.3, type:"facility",  desc:"For board."},

  // ── Building 4 — 2nd Floor ─────────────────────────────────
  { id:43, name:"B4.21",                  floor:2, building: 4, x:4.5,  y:6,   type:"laboratory", desc:"Cisco Networking Simulation Laboratory." },
  { id:44, name:"B4.22",                  floor:2, building: 4, x:4.5,  y:2,   type:"laboratory", desc:"Foreign Language / Speech Laboratory." },
  { id:45, name:"B4.23",                  floor:2, building: 4, x:6.5,  y:6.5, type:"laboratory", desc:"Digital & Robotics Modeling Laboratory." },
  { id:46, name:"B4.24",                  floor:2, building: 4, x:6.5,  y:3.8, type:"laboratory", desc:"E-Learning Hub." },
  { id:47, name:"B4.25",                  floor:2, building: 4, x:6.5,  y:1.3, type:"facility",   desc:"Senior High School Department." },

  // ── Restrooms — 2nd Floor ───────────────────────────────────
  { id:"B-M2",  name:"Men's CR (2F)",      floor:2, building: 4, x:11,  y:9.8, type:"facility", desc:"Boys' restroom with 3 stalls and 2 sinks." },
  { id:"B2-F2", name:"Ladies' CR (B2-2F)", floor:2, building: 2, x:20,  y:9.8, type:"facility", desc:"Ladies' restroom with 3 stalls and 2 sinks." },
  { id:"B4-F2", name:"Ladies' CR (B4-2F)", floor:2, building: 4, x:1.5, y:9.8, type:"facility", desc:"Ladies' restroom with 3 stalls and 2 sinks." },

  // ── Building 1 — 3rd Floor ─────────────────────────────────
  { id:"B1-GYM", name:"Volleyball / Badminton Court",                             floor:3, building:1, x:16.5, y:10,   type:"gym",    desc:"Gymnasium for Volleyball, Badminton, and P.E. Classes."},
  { id:"AHRO",   name:"Administration & Human Resources Office (AHRO)",           floor:3, building:1, x:20,   y:18.5, type:"office", desc:"Office for enrollment & records, ID & credentials, and HR for employees."},
  { id:"SPAMO",  name:"Special Projects Affiliations & Marketing Office (SPAMO)", floor:3, building:1, x:12.5, y:18.5, type:"office", desc:"Office for OJT/Internship, Job Placement, Almni relations, and Industry linkages."},

  // ── Building 2 — 3rd Floor ─────────────────────────────────
  { id:62, name:"B2.31", floor:3, building:2, x:15.5, y:7, type:"room", desc:"Lecture room for classes."},
  { id:63, name:"B2.32", floor:3, building:2, x:15.5, y:5, type:"room", desc:"Lecture room for classes."},
  { id:64, name:"B2.33", floor:3, building:2, x:15.5, y:3, type:"room", desc:"Lecture room for classes."},
  { id:65, name:"B2.34", floor:3, building:2, x:15.5, y:1, type:"room", desc:"Lecture room for classes."},
  { id:66, name:"B2.35", floor:3, building:2, x:17.5, y:7, type:"room", desc:"Lecture room for classes."},
  { id:67, name:"B2.36", floor:3, building:2, x:17.5, y:5, type:"room", desc:"Lecture room for classes."},
  { id:68, name:"B2.37", floor:3, building:2, x:17.5, y:3, type:"room", desc:"Lecture room for classes."},
  { id:69, name:"B2.38", floor:3, building:2, x:17.5, y:1, type:"room", desc:"Lecture room for classes."},

  // ── Building 3 — 3rd Floor ─────────────────────────────────
  { id:"B3-GYM", name:"Basketball Court",      floor:3, building:3, x:7,   y:10,   type:"gym",      desc:"Gymnasium for Basketball and P.E. Classes." },
  { id:"VR-M",   name:"Varsity Room - Male",   floor:3, building:3, x:2.5, y:18.5, type:"facility", desc:"Locker room for male varsity players." },
  { id:"VR-F",   name:"Varsity Room - Female", floor:3, building:3, x:8.5, y:18.5, type:"facility", desc:"Locker room for female varsity players." },

  // ── Building 4 — 3rd Floor ─────────────────────────────────
  { id:70, name:"B4.31", floor:3, building:4, x:4.5, y:7, type:"room", desc:"Lecture room for classes." },
  { id:71, name:"B4.32", floor:3, building:4, x:4.5, y:5, type:"room", desc:"Lecture room for classes." },
  { id:72, name:"B4.33", floor:3, building:4, x:4.5, y:3, type:"room", desc:"Lecture room for classes." },
  { id:73, name:"B4.34", floor:3, building:4, x:4.5, y:1, type:"room", desc:"Lecture room for classes." },
  { id:74, name:"B4.35", floor:3, building:4, x:6.5, y:7, type:"room", desc:"Lecture room for classes." },
  { id:75, name:"B4.36", floor:3, building:4, x:6.5, y:5, type:"room", desc:"Lecture room for classes." },
  { id:76, name:"B4.37", floor:3, building:4, x:6.5, y:3, type:"room", desc:"Lecture room for classes." },
  { id:77, name:"B4.38", floor:3, building:4, x:6.5, y:1, type:"room", desc:"Lecture room for classes." },

  // ── Restrooms — 3rd Floor ───────────────────────────────────
  { id:"B2-F3", name:"Ladies' CR (B2-3F)", floor:3, building: 2,  x:20,   y:9.8, type:"facility", desc:"Ladies' restroom with 3 stalls and 2 sinks." },
  { id:"B4-F3", name:"Ladies' CR (B4-3F)", floor:3, building: 4,  x:1.5,  y:9.8, type:"facility", desc:"Ladies' restroom with 3 stalls and 2 sinks." },
  { id:"B-M3",  name:"Men's CR (3F)",   floor:3, building:4,   x:11,   y:9.8, type:"facility", desc:"Boys' restroom with 3 stalls and 2 sinks." },

  // ── Building 1 — 4th Floor ─────────────────────────────────
  { id:"SH", name:"Study Hall",    floor:4, building:1,   x:11.5, y:19,  type:"facility", desc:"Study hall for group of students." },

  // ── Building 2 — 4th Floor ─────────────────────────────────
  { id:78, name:"B2.41", floor:4, building:2, x:15.5, y:7, type:"room", desc:"Lecture room for classes."},
  { id:79, name:"B2.42", floor:4, building:2, x:15.5, y:5, type:"room", desc:"Lecture room for classes."},
  { id:80, name:"B2.43", floor:4, building:2, x:15.5, y:3, type:"room", desc:"Lecture room for classes."},
  { id:81, name:"B2.44", floor:4, building:2, x:15.5, y:1, type:"room", desc:"Lecture room for classes."},
  { id:82, name:"B2.45", floor:4, building:2, x:17.5, y:7, type:"room", desc:"Lecture room for classes."},
  { id:83, name:"B2.46", floor:4, building:2, x:17.5, y:5, type:"room", desc:"Lecture room for classes."},
  { id:84, name:"B2.47", floor:4, building:2, x:17.5, y:3, type:"room", desc:"Lecture room for classes."},
  { id:85, name:"B2.48", floor:4, building:2, x:17.5, y:1, type:"room", desc:"Lecture room for classes."},
  
  // ── Building 3 — 4th Floor ─────────────────────────────────
  { id:"FC", name:"Food Court", floor:4, building:3, x:7, y:11, type:"facility", desc:"Food stalls inside the campus." },

  // ── Building 4 — 4th Floor ─────────────────────────────────
  { id:86, name:"B4.41", floor:4, building:4, x:4.5, y:7, type:"room", desc:"Lecture room for classes." },
  { id:87, name:"B4.42", floor:4, building:4, x:4.5, y:5, type:"room", desc:"Lecture room for classes." },
  { id:88, name:"B4.43", floor:4, building:4, x:4.5, y:3, type:"room", desc:"Lecture room for classes." },
  { id:89, name:"B4.44", floor:4, building:4, x:4.5, y:1, type:"room", desc:"Lecture room for classes." },
  { id:90, name:"B4.45", floor:4, building:4, x:6.5, y:7, type:"room", desc:"Lecture room for classes." },
  { id:91, name:"B4.46", floor:4, building:4, x:6.5, y:5, type:"room", desc:"Lecture room for classes." },
  { id:92, name:"B4.47", floor:4, building:4, x:6.5, y:3, type:"room", desc:"Lecture room for classes." },
  { id:93, name:"B4.48", floor:4, building:4, x:6.5, y:1, type:"room", desc:"Lecture room for classes." },

  // ── Restrooms — 4th Floor ───────────────────────────────────
  { id:"B2-F4", name:"Ladies' CR (B2-4F)", floor:4, building: 2,  x:20,   y:9.8, type:"facility", desc:"Ladies' restroom with 3 stalls and 2 sinks." },
  { id:"B4-F4", name:"Ladies' CR (B4-4F)", floor:4, building: 4,  x:1.5,  y:9.8, type:"facility", desc:"Ladies' restroom with 3 stalls and 2 sinks." },
  { id:"B-M4",  name:"Men's CR (4F)",   floor:4, building:4,   x:11,   y:9.8, type:"facility", desc:"Boys' restroom with 3 stalls and 2 sinks." },

  // ── Building 2 — 5th Floor ─────────────────────────────────
  { id:94,  name:"B2.51", floor:5, building:2, x:15.5, y:7, type:"room", desc:"Lecture room for classes."},
  { id:95,  name:"B2.52", floor:5, building:2, x:15.5, y:5, type:"room", desc:"Lecture room for classes."},
  { id:96,  name:"B2.53", floor:5, building:2, x:15.5, y:3, type:"room", desc:"Lecture room for classes."},
  { id:97,  name:"B2.54", floor:5, building:2, x:15.5, y:1, type:"room", desc:"Lecture room for classes."},
  { id:98,  name:"B2.55", floor:5, building:2, x:17.5, y:7, type:"room", desc:"Lecture room for classes."},
  { id:99,  name:"B2.56", floor:5, building:2, x:17.5, y:5, type:"room", desc:"Lecture room for classes."},
  { id:100, name:"B2.57", floor:5, building:2, x:17.5, y:3, type:"room", desc:"Lecture room for classes."},
  { id:152, name:"B2.58", floor:5, building:2, x:17.5, y:1, type:"room", desc:"Lecture room for classes."},

  // ── Building 4 — 5th Floor ─────────────────────────────────
  { id:153, name:"B4.51", floor:5, building:4, x:4.5, y:7, type:"room", desc:"Lecture room for classes." },
  { id:154, name:"B4.52", floor:5, building:4, x:4.5, y:5, type:"room", desc:"Lecture room for classes." },
  { id:155, name:"B4.53", floor:5, building:4, x:4.5, y:3, type:"room", desc:"Lecture room for classes." },
  { id:156, name:"B4.54", floor:5, building:4, x:4.5, y:1, type:"room", desc:"Lecture room for classes." },
  { id:157, name:"B4.55", floor:5, building:4, x:6.5, y:7, type:"room", desc:"Lecture room for classes." },
  { id:158, name:"B4.56", floor:5, building:4, x:6.5, y:5, type:"room", desc:"Lecture room for classes." },
  { id:159, name:"B4.57", floor:5, building:4, x:6.5, y:3, type:"room", desc:"Lecture room for classes." },
  { id:160, name:"B4.58", floor:5, building:4, x:6.5, y:1, type:"room", desc:"Lecture room for classes." },

  // ── Restrooms — 5th Floor ───────────────────────────────────
  { id:"B2-F5", name:"Ladies' CR (B2-5F)", floor:5, building: 2,  x:20,   y:9.8, type:"facility", desc:"Ladies' restroom with 3 stalls and 2 sinks." },
  { id:"B4-F5", name:"Ladies' CR (B4-5F)", floor:5, building:4,   x:1.5,  y:9.8, type:"facility", desc:"Ladies' restroom with 3 stalls and 2 sinks." },
  { id:"B-M5",  name:"Men's CR (5F)",   floor:5, building:4,   x:11,   y:9.8, type:"facility", desc:"Boys' restroom with 3 stalls and 2 sinks." },

  // ── Building 2 — 6th Floor ─────────────────────────────────
  { id:"B2-F6", name:"Female Dressing Room", floor:6, building:2, x:20,   y:9.5, type:"facility", desc:"Female dressing room with 3 stalls." },
  { id:"B-M6",  name:"Male Dressing Room",   floor:6, building:2, x:12,   y:9.5, type:"facility", desc:"Male dressing room with 3 stalls." },
  { id:"P.E.",  name:"P.E. Faculty Room",    floor:6, building:2, x:17.5, y:7,   type:"facility",  desc:"Faculty room of P.E. teachers." },
  { id:"GYM",   name:"P.E. Gymnasium",            floor:6, building:2, x:16,   y:7,   type:"gym",      desc:"Gymnasium for p.e. classes." },

  // ── Building 4 — 6th Floor ─────────────────────────────────
  { id:"ISHTM", name:"ISHTM Hotel Simulation Laboratory", floor:6, building:4, x:5.8, y:7.3, type:"laboratory", desc:"Laboratory for simulating hotel experiences or training and classes for ISHTM students." },  
  { id:"Theatre", name:"The Theatre Room", floor:6, building:4, x:8, y:7.8, type:"theatre", desc:"Theatre room for school events, seminars, and orientations." },

  // ── Building 4 — 7th Floor ─────────────────────────────────
  { id:"Balcony", name:"The Theatre Room - Balcony", floor:7, building:4, x:7.6, y:8, type:"theatre", desc:"Balcony of theatre room for school events, seminars, and orientations." },

  // ── Hallway nodes — Ground Floor ────────────────────────────
  { id:101, name: "Building 3 Hallway",          floor:1, x:5.5,  y:19.8, type: "hallway", desc:"Corridor near admission office." },
  { id:102, name: "Building 3 Hallway",          floor:1, x:5.5,  y:18.5, type: "hallway", desc:"Corridor in front of clinic." },
  { id:103, name: "Building 3 Hallway",          floor:1, x:5.5,  y:17.5, type: "hallway", desc:"Corridor in front of testing room." },
  { id:105, name: "Building 3 Hallway",          floor:1, x:5.5,  y:13.5, type: "hallway", desc:"Corridor in front of social lounge." },
  { id:106, name: "Building 3 Hallway",          floor:1, x:5.5,  y:12,   type: "hallway", desc:"Corridor in front of drug testing center." },
  { id:107, name: "Building 3 & 4 Hallway",      floor:1, x:5.5,  y:10.5, type: "hallway", desc:"Hallway at Elevator/Building 4." },
  { id:108, name: "Building 4 Hallway",          floor:1, x:8,    y:10.5, type: "hallway", desc:"Hallway at Right Stairs." },
  { id:109, name: "Building 4 - Right Stairs",   floor:1, x:8,    y:9,    type: "hallway", desc:"Building 4 Right Stairs." },
  { id:110, name: "Center Hallway",              floor:1, x:11,   y:10.5, type: "hallway", desc:"Center hallway connecting different buildings." },
  { id:111, name: "Building 2 & 4 Mid-Hallway",  floor:1, x:11,   y:6.5,  type: "hallway", desc:"Corridor in front of B4.13." },
  { id:112, name: "Building 2 & 4 Mid-Hallway",  floor:1, x:11,   y:4,    type: "hallway", desc:"Corridor in front of B4.14." },
  { id:113, name: "Registrar Windows' Hallway",  floor:1, x:15,   y:10.5, type: "hallway", desc:"In front of Window 1." },
  { id:114, name: "Registrar Windows' Hallway",  floor:1, x:13.8, y:10.5, type: "hallway", desc:"In front of Window 2." },
  { id:115, name: "Registrar Windows' Hallway",  floor:1, x:12.5, y:10.5, type: "hallway", desc:"In front of Window 3." },
  { id:116, name: "Building 1 & 2 Hallway",      floor:1, x: 16.5,y: 10.5,type: "hallway", desc: "Corridor at Building 1 & 2."},
  { id:117, name: "Building 1 & 2 Side Hallway", floor:1, x: 21,  y: 10.5,type: "hallway", desc: "Side Hallway at Building 1 & 2."},
  { id:118, name: "Building 2 - Side Hallway",   floor:1, x: 21,  y: 4,   type: "hallway", desc: "In front of Supply Section."},
  { id:119, name: "Building 2 - Side Hallway",   floor:1, x: 21,  y: 1.5, type: "hallway", desc: "In front of Library."},
  { id:120, name: "Registrar Windows' Hallway",  floor:1, x: 11,  y:11.4, type: "hallway", desc: "In front of Window 4."},
  { id:121, name: "Registrar Windows' Hallway",  floor:1, x: 11,  y:12.5, type: "hallway", desc: "In front of Window 5."},
  { id:122, name: "Registrar Windows' Hallway",  floor:1, x: 11,  y:13.6, type: "hallway", desc: "In front of Window 6."},
  { id:123, name: "Registrar Windows' Hallway",  floor:1, x: 11,  y:14.7, type: "hallway", desc: "In front of Window 7."},
  { id:124, name: "Registrar Windows' Hallway",  floor:1, x: 11,  y:15.9, type: "hallway", desc: "In front of Window 8."},
  { id:125, name: "Registrar Windows' Hallway",  floor:1, x: 11,  y:17.1, type: "hallway", desc: "In front of Window 9."},
  { id:126, name: "Registrar Windows' Hallway",  floor:1, x: 11,  y:18.3, type: "hallway", desc: "In front of Window 12."},
  { id:127, name: "Registrar Windows' Hallway",  floor:1, x: 11,  y:19.4, type: "hallway", desc: "In front of Window 14."},
  { id:128, name: "Registrar Windows' Hallway",  floor:1, x: 11,  y:20.6, type: "hallway", desc: "In front of Window 15."},
  { id:129, name: "Building 1 Hallway",          floor:1, x: 16.5,y:13,   type: "hallway", desc: "In front of Registrar & Accounting Office."},
  { id:130, name: "Building 1 Hallway",          floor:1, x: 16.5,y:18,   type: "hallway", desc: "In front Student Affairs Office."},
  { id:131, name: "Building 1 Hallway",          floor:1, x: 16.5,y:20,   type: "hallway", desc: "In front of CDJP & Guidance Office."},
  { id:132, name: "Building 1 Hallway",          floor:1, x: 16.5,y:17,   type: "hallway", desc: "In front NSTP Office."},
  { id:133, name: "Building 4 Hallway",          floor:1, x: 3.5, y:10.5, type: "hallway", desc: "Building 4 Hallway."},
  { id:134, name: "Building 4 - Left Stairs",    floor:1, x: 3.5, y:9.5,  type: "hallway", desc: "Building 4 - Left Stairs."},
  { id:135, name: "Building 2 Hallway",          floor:1, x:14,   y:10.5, type: "hallway", desc:"Building 2 Hallway." },
  { id:136, name: "Building 2 - Left Stairs",    floor:1, x:14,   y:9.5,  type: "hallway", desc:"Building 2 - Left Stairs." },
  { id:137, name: "Accounting Windows' Hallway", floor:1, x: 17.7,y: 10.5,type: "hallway", desc: "Accounting - Window 1."},
  { id:138, name: "Accounting Windows' Hallway", floor:1, x: 18.3,y: 10.5,type: "hallway", desc: "Accounting - Window 2."},
  { id:139, name: "Accounting Windows' Hallway", floor:1, x: 18.9,y: 10.5,type: "hallway", desc: "Accounting - Window 3."},
  { id:140, name: "Accounting Windows' Hallway", floor:1, x: 19.5,y: 10.5,type: "hallway", desc: "Accounting - Window 4."},
  { id:141, name: "Accounting Windows' Hallway", floor:1, x: 20.1,y: 10.5,type: "hallway", desc: "Accounting - Window 5."},
  { id:142, name: "Building 1 - Side Hallway",   floor:1, x: 21,  y: 12.1,type: "hallway", desc: "In front of Window 6."},
  { id:143, name: "Building 1 - Side Hallway",   floor:1, x: 21,  y: 13.2,type: "hallway", desc: "In front of Window 7."},
  { id:144, name: "Building 1 - Side Hallway",   floor:1, x: 21,  y: 14.3,type: "hallway", desc: "In front of Window 8."},
  { id:145, name: "Building 1 - Side Hallway",   floor:1, x: 21,  y: 15.4,type: "hallway", desc: "In front of Window 9."},
  { id:146, name: "Building 2 Hallway",          floor:1, x: 18,  y: 10.5,type: "hallway", desc: "Building 2 Hallway."},
  { id:147, name: "Building 2 - Right Stairs",   floor:1, x: 18,  y: 9.5, type: "hallway", desc: "Building 2 Right Stairs."},
  { id:148, name: "Building 1 Hallway",          floor:1, x: 16.5,y: 14.5,type: "hallway", desc: "Building 1 Hallway to Stairs."},  
  { id:149, name: "Building 1 Stairs",           floor:1, x: 15.5,y: 14.5,type: "hallway", desc: "Building 1 Stairs."},
  { id:150, name: "Building 3 Hallway",          floor:1, x: 5.5, y: 16,  type: "hallway", desc: "To Building 3 Stairs."},
  { id:151, name: "Building 3 Stairs",           floor:1, x: 8,   y: 16,  type: "hallway", desc: "Building 3 Stairs to 2nd Floor."},
  { id:200, name: "Kiosk",                       floor:1, x:6.3,  y:10.5, type: "hallway", desc: "Kiosk path." },

  // ── Hallway nodes — 2nd Floor ────────────────────────────────
  { id:"B4-2R", name: "Building 4 - Right Stairs",   floor:2, x:8,     y:8.5,  type: "hallway", desc: "Building 4 Right Stairs."},
  { id:"B2-2R", name: "Building 2 - Right Stairs",   floor:2, x: 18,   y:8.5,  type: "hallway", desc: "Building 2 - Right Stairs."},
  { id:201,     name: "Men's Restroom",              floor:2, x:8,     y:9.8,  type: "hallway", desc: "Building 2 & 4 Men's Restroom."},
  { id:202,     name: "Building 4 - Center Hallway", floor:2, x:5.5,   y:8.5,  type: "hallway", desc: "Building 4 - Center Hallway."},
  { id:203,     name: "Building 4 Hallway",          floor:2, x:5.5,   y:6,    type: "hallway", desc: "CISCO Room."},
  { id:204,     name: "Building 4 Hallway",          floor:2, x:5.5,   y:2,    type: "hallway", desc: "Speech Laboratory."},
  { id:205,     name: "Building 4 Hallway",          floor:2, x:5.5,   y:6.5,  type: "hallway", desc: "DRM Laboratory."},
  { id:206,     name: "Building 4 Hallway",          floor:2, x:5.5,   y:3.8,  type: "hallway", desc: "E-Learning Hub."},
  { id:207,     name: "Building 4 Hallway",          floor:2, x:5.5,   y:1.3,  type: "hallway", desc: "SHS Department."},
  { id:208,     name: "Building 4 Hallway",          floor:2, x:3.9,   y:8.5,  type: "hallway", desc: "Building 4 Hallway."},
  { id:209,     name: "Building 4 - Ladies Restroom",floor:2, x:3.9,   y:9.8,  type: "hallway", desc: "Building 4 - Ladies Restroom."},
  { id:210,     name: "Men's Restroom",              floor:2, x:14.5,  y:9.8,  type: "hallway", desc: "Building 2 & 4 Men's Restroom."},
  { id:212,     name: "Building 2 - Center Hallway", floor:2, x:16.5,  y:8.5,  type: "hallway", desc: "Building 2 - Center Hallway."},
  { id:213,     name: "Building 2 Hallway",          floor:2, x:16.5,  y:6.5,  type: "hallway", desc: "Computer Laboratory 21 & 24."},
  { id:214,     name: "Building 2 Hallway",          floor:2, x:16.5,  y:3.8,  type: "hallway", desc: "Computer Laboratory 22 & 25."},
  { id:215,     name: "Building 2 Hallway",          floor:2, x:16.5,  y:2,    type: "hallway", desc: "Computer Laboratory 23 & 26."},
  { id:216,     name: "Building 2 - Ladies Restroom",floor:2, x:18,    y:9.8,  type: "hallway", desc: "Building 2 - Ladies Restroom."},
  { id:217,     name: "Building 2 Hallway",          floor:2, x:14.5,  y:8.5,  type: "hallway", desc: "Building 2 Hallway."},
  { id:218,     name: "Building 1 Stairs",           floor:2, x: 15.5, y:15.5, type: "hallway", desc: "Building 1 Stairs."},
  { id:219,     name: "Building 1 Hallway",          floor:2, x: 16.5, y:15.5, type: "hallway", desc: "Building 1 Hallway."},
  { id:220,     name: "Building 1 Hallway",          floor:2, x: 16.5, y:13.3, type: "hallway", desc: "In front of Faculty Room and B1.21."},
  { id:221,     name: "Building 1 Hallway",          floor:2, x: 16.5, y:13.3, type: "hallway", desc: "Building 1 Hallway."},
  { id:222,     name: "Building 1 Hallway",          floor:2, x: 16.5, y:17,   type: "hallway", desc: "Building 1 Hallway."},
  { id:223,     name: "Building 1 Hallway",          floor:2, x: 16.5, y:17.5, type: "hallway", desc: "In front of B2.21."},
  { id:224,     name: "Building 1 Hallway",          floor:2, x: 16.5, y:18.8, type: "hallway", desc: "In front of ODEL & Deans Office."},
  { id:225,     name: "Building 3 Stairs",           floor:2, x: 8,    y:16,   type: "hallway", desc: "Building 3 Stairs - 2nd Floor."},
  { id:226,     name: "Building 3 Hallway",          floor:2, x: 5.5,  y:16,   type: "hallway", desc: "Building 3 Hallway."},
  { id:227,     name: "Building 3 Hallway",          floor:2, x: 5.5,  y:13.3, type: "hallway", desc: "In front of Board Room and MIS Department."},
  { id:228,     name: "Building 3 Hallway",          floor:2, x: 5.5,  y:17.5, type: "hallway", desc: "In front of Broadcasting Room."},
  { id:229,     name: "Building 3 Hallway",          floor:2, x: 5.5,  y:19.3, type: "hallway", desc: "In front of Chairman's Office and Media and Arts Center."},
  { id:230,     name: "Building 2 - Right Stairs",   floor:2, x:18,    y:9,    type: "hallway", desc:"Stairs to Building 2 - Third Floor." },
  { id:231,     name: "Building 4 - Right Stairs",   floor:2, x:8,     y:9,    type: "hallway", desc: "Stairs to Building 4 - Third Floor."},

  // ── Hallway nodes — 3rd Floor ────────────────────────────────
  { id:301, name: "Building 2 - Right Stairs",    floor:3, x:18,   y:8.5, type:"hallway", desc:"Building 2 - Right Stairs." },
  { id:302, name: "Building 2 - Center Hallway",  floor:3, x:16.5, y:8.5, type:"hallway", desc:"Building 2 - Center Hallway."},
  { id:303, name: "Building 2 Hallway",           floor:3, x:16.5, y:7,   type:"hallway", desc:"In front of B2.31 and B2.35." },
  { id:304, name: "Building 2 Hallway",           floor:3, x:16.5, y:5,   type:"hallway", desc:"In front of B2.32 and B2.36." },
  { id:305, name: "Building 2 Hallway",           floor:3, x:16.5, y:3,   type:"hallway", desc:"In front of B2.33 and B2.37." },
  { id:306, name: "Building 2 Hallway",           floor:3, x:16.5, y:1,   type:"hallway", desc:"In front of B2.34 and B2.38." },
  { id:307, name: "Building 2 - Ladies Restroom", floor:3, x:18,   y:9.8, type:"hallway", desc:"Building 2 - Ladies Restroom."},
  { id:308, name: "Building 2 Hallway",           floor:3, x:14.5, y:8.5, type:"hallway", desc:"Building 2 Hallway."},
  { id:309, name: "Men's Restroom",               floor:3, x:14.5, y:9.8, type:"hallway", desc:"Building 2 & 4 Men's Restroom."},
  { id:310, name: "Building 4 - Right Stairs",    floor:3, x:8,    y:8.5, type:"hallway", desc:"Building 4 - Right Stairs."},
  { id:311, name: "Building 4 - Center Hallway",  floor:3, x:5.5,  y:8.5, type:"hallway", desc:"Building 4 - Center Hallway."},
  { id:312, name: "Building 4 Hallway",           floor:3, x:5.5,  y:7,   type:"hallway", desc:"In front of B4.31 & B4.35." },
  { id:313, name: "Building 4 Hallway",           floor:3, x:5.5,  y:5,   type:"hallway", desc:"In front of B4.32 & B4.36." },
  { id:314, name: "Building 4 Hallway",           floor:3, x:5.5,  y:3,   type:"hallway", desc:"In front of B4.33 & B4.37." },
  { id:315, name: "Building 4 Hallway",           floor:3, x:5.5,  y:1,   type:"hallway", desc:"In front of B4.34 & B4.38." },
  { id:316, name: "Building 4 Hallway",           floor:3, x:3.9,  y:8.5, type:"hallway", desc:"Building 4 Hallway."},
  { id:317, name: "Building 4 - Ladies Restroom", floor:3, x:3.9,  y:9.8, type:"hallway", desc:"Building 4 - Ladies Restroom."},
  { id:318, name: "Men's Restroom",               floor:3, x:8,    y:9.8, type:"hallway", desc:"Building 2 & 4 Men's Restroom."},
  { id:319, name: "Court Hallway",                floor:3, x:11.3, y:18.5,type:"hallway", desc:"Hallway to Study Hall." },
  { id:320, name: "Building 2 - Right Stairs",    floor:3, x:18,   y:9,   type:"hallway", desc:"Stairs to Building 2 - Fourth Floor." },
  { id:321, name: "Building 4 - Right Stairs",    floor:3, x:8,    y:9,   type:"hallway", desc:"Stairs to Building 4 - Fourth Floor."},

  // ── Hallway nodes — 4th Floor ────────────────────────────────
  { id:401, name: "Building 2 - Right Stairs",    floor:4, x:18,   y:8.5, type:"hallway", desc:"Building 2 - Right Stairs." },
  { id:402, name: "Building 2 - Center Hallway",  floor:4, x:16.5, y:8.5, type:"hallway", desc:"Building 2 - Center Hallway."},
  { id:403, name: "Building 2 Hallway",           floor:4, x:16.5, y:7,   type:"hallway", desc:"In front of B2.41 and B2.45." },
  { id:404, name: "Building 2 Hallway",           floor:4, x:16.5, y:5,   type:"hallway", desc:"In front of B2.42 and B2.46." },
  { id:405, name: "Building 2 Hallway",           floor:4, x:16.5, y:3,   type:"hallway", desc:"In front of B2.43 and B2.47." },
  { id:406, name: "Building 2 Hallway",           floor:4, x:16.5, y:1,   type:"hallway", desc:"In front of B2.44 and B2.48." },
  { id:407, name: "Building 2 - Ladies Restroom", floor:4, x:18,   y:9.8, type:"hallway", desc:"Building 2 - Ladies Restroom."},
  { id:408, name: "Building 2 Hallway",           floor:4, x:14.5, y:8.5, type:"hallway", desc:"Building 2 Hallway."},
  { id:409, name: "Men's Restroom",               floor:4, x:14.5, y:9.8, type:"hallway", desc:"Building 2 & 4 Men's Restroom."},
  { id:410, name: "Building 4 - Right Stairs",    floor:4, x:8,    y:8.5, type:"hallway", desc:"Building 4 - Right Stairs."},
  { id:411, name: "Building 4 - Center Hallway",  floor:4, x:5.5,  y:8.5, type:"hallway", desc:"Building 4 - Center Hallway."},
  { id:412, name: "Building 4 Hallway",           floor:4, x:5.5,  y:7,   type:"hallway", desc:"In front of B4.41 & B4.45." },
  { id:413, name: "Building 4 Hallway",           floor:4, x:5.5,  y:5,   type:"hallway", desc:"In front of B4.42 & B4.46." },
  { id:414, name: "Building 4 Hallway",           floor:4, x:5.5,  y:3,   type:"hallway", desc:"In front of B4.43 & B4.47." },
  { id:415, name: "Building 4 Hallway",           floor:4, x:5.5,  y:1,   type:"hallway", desc:"In front of B4.44 & B4.48." },
  { id:416, name: "Building 4 Hallway",           floor:4, x:3.9,  y:8.5, type:"hallway", desc:"Building 4 Hallway."},
  { id:417, name: "Building 4 - Ladies Restroom", floor:4, x:3.9,  y:9.8, type:"hallway", desc:"Building 4 - Ladies Restroom."},
  { id:418, name: "Men's Restroom",               floor:4, x:8,    y:9.8, type:"hallway", desc:"Building 2 & 4 Men's Restroom."},
  { id:419, name: "Stairs to Study Hall",         floor:4, x:11.3, y:20.5,type:"hallway", desc:"Hallway to Study Hall." },
  { id:420, name: "Building 2 - Right Stairs",    floor:4, x:18,   y:9,   type:"hallway", desc:"Stairs to Building 2 - Fifth Floor." },
  { id:421, name: "Building 4 - Right Stairs",    floor:4, x:8,    y:9,   type:"hallway", desc:"Stairs to Building 4 - Fifth Floor."},

  // ── Hallway nodes — 5th Floor ────────────────────────────────
  { id:501, name: "Building 2 - Right Stairs",    floor:5, x:18,   y:8.5, type:"hallway", desc:"Building 2 - Right Stairs." },
  { id:502, name: "Building 2 - Center Hallway",  floor:5, x:16.5, y:8.5, type:"hallway", desc:"Building 2 - Center Hallway."},
  { id:503, name: "Building 2 Hallway",           floor:5, x:16.5, y:7,   type:"hallway", desc:"In front of B2.51 and B2.55." },
  { id:504, name: "Building 2 Hallway",           floor:5, x:16.5, y:5,   type:"hallway", desc:"In front of B2.52 and B2.56." },
  { id:505, name: "Building 2 Hallway",           floor:5, x:16.5, y:3,   type:"hallway", desc:"In front of B2.53 and B2.57." },
  { id:506, name: "Building 2 Hallway",           floor:5, x:16.5, y:1,   type:"hallway", desc:"In front of B2.54 and B2.58." },
  { id:507, name: "Building 2 - Ladies Restroom", floor:5, x:18,   y:9.8, type:"hallway", desc:"Building 2 - Ladies Restroom."},
  { id:508, name: "Building 2 Hallway",           floor:5, x:14.5, y:8.5, type:"hallway", desc:"Building 2 Hallway."},
  { id:509, name: "Men's Restroom",               floor:5, x:14.5, y:9.8, type:"hallway", desc:"Building 2 & 4 Men's Restroom."},
  { id:510, name: "Building 4 - Right Stairs",    floor:5, x:8,    y:8.5, type:"hallway", desc:"Building 4 - Right Stairs."},
  { id:511, name: "Building 4 - Center Hallway",  floor:5, x:5.5,  y:8.5, type:"hallway", desc:"Building 4 - Center Hallway."},
  { id:512, name: "Building 4 Hallway",           floor:5, x:5.5,  y:7,   type:"hallway", desc:"In front of B4.51 & B4.55." },
  { id:513, name: "Building 4 Hallway",           floor:5, x:5.5,  y:5,   type:"hallway", desc:"In front of B4.52 & B4.56." },
  { id:514, name: "Building 4 Hallway",           floor:5, x:5.5,  y:3,   type:"hallway", desc:"In front of B4.53 & B4.57." },
  { id:515, name: "Building 4 Hallway",           floor:5, x:5.5,  y:1,   type:"hallway", desc:"In front of B4.54 & B4.58." },
  { id:516, name: "Building 4 Hallway",           floor:5, x:3.9,  y:8.5, type:"hallway", desc:"Building 4 Hallway."},
  { id:517, name: "Building 4 - Ladies Restroom", floor:5, x:3.9,  y:9.8, type:"hallway", desc:"Building 4 - Ladies Restroom."},
  { id:518, name: "Men's Restroom",               floor:5, x:8,    y:9.8, type:"hallway", desc:"Building 2 & 4 Men's Restroom."},
  { id:519, name: "Building 2 - Right Stairs",    floor:5, x:18,   y:9,   type:"hallway", desc:"Stairs to Building 2 - Sixth Floor." },
  { id:520, name: "Building 4 - Right Stairs",    floor:5, x:8,    y:9,   type:"hallway", desc:"Stairs to Building 4 - Sixth Floor."},

  // ── Hallway nodes — 6th Floor ────────────────────────────────
  { id:601, name: "Building 2 - Right Stairs",   floor:6, x:18,   y:8.5, type: "hallway", desc: "Building 2 - Right Stairs." },
  { id:602, name: "Building 2 Hallway",          floor:6, x:17.5, y:8.5, type: "hallway", desc: "Building 2 - Center Hallway."},
  { id:603, name: "Ladies' Dressing Room",       floor:6, x:18,   y:9.5, type: "hallway", desc: "Building 2 Ladies Dressing Room."},
  { id:604, name: "Men's Dressing Room",         floor:6, x:14.5, y:9.5, type: "hallway", desc: "Building 2 Men's Dressing Room."},
  { id:605, name: "Building 4 - Right Stairs",   floor:6, x:8,    y:8.5, type: "hallway", desc: "Building 4 - Right Stairs."},
  { id:606, name: "Building 4 - Center Hallway", floor:6, x:5.8,  y:8.5, type: "hallway", desc: "Building 4 - Center Hallway."},
  { id:607, name: "Building 4 - Right Stairs",   floor:6, x:8,    y:9,   type: "hallway", desc: "Stairs to Building 4 - Sixth Floor."},

  // ── Hallway nodes — 7th Floor ────────────────────────────────
  { id:701, name: "Building 4 - Right Stairs",   floor:7, x:8,    y:8.5, type: "hallway", desc: "Building 4 - Right Stairs."},
]

// ─────────────────────────────────────────────────────────────
//  EDGES — walkable connections between nodes
// ─────────────────────────────────────────────────────────────
export const EDGES = [
  // Building 1 - Ground Floor Edges
  [200,113],[200,114],[200,115],[113,15],[114,16],[115,17],[116,129],[116,130],[116,131],[116,132],
  [116,148],[117,142],[117,143],[117,144],[117,145],[129,27],[129,30],[130,28],[131,29],[131,31],
  [132,32],[129,33],[116,137],[116,138],[116,139],[116,140],[116,141],[137,34],[138,35],[139,36],
  [140,37],[141,38],[142,39],[143,40],[144,41],[145,42],[148,149],[149,218],

  // Building 2 - Ground Floor Edges
  [200,116],[200,117],[200,146],[112,10],[113,12],[114,116],[116,117],[116,11],[117,118],[118,13],
  [117,119],[119,14],[110,120],[110,121],[110,122],[110,123],[110,124],[110,125],[110,126],[110,127],
  [110,128],[110,135],[110,146],[120,18],[121,19],[122,20],[123,21],[124,22],[125,23],[126,24],
  [127,25],[128,26],[135,136],[146,147],

  // Building 3 - Ground Floor Edges
  [1,101],[1,102],[1,103],[101,102],[101,103],[101,2],[102,104],[102,3],[103,4],[103,105],
  [103,104],[103,107],[104,106],[104,7],[105,5],[103,106],[106,6],[102,103],[105,106],[106,107],
  [200,108],[107,150],[108,109],[150,151],

  // Building 4 - Ground Floor Edges
  ["kiosk",200],[200,110],[107,200],["kiosk",109],[200,133],[109,"B4-2R"],[200,110],[110,111],[110,112],[111,112],
  [111,8],[112,9],[133,134],

  //Building 1 - Second Floor Edges
  [218,219],[219,48],[219,53],[219,220],[219,223],[219,224],[220,49],[220,52],[219,222],[222,50],
  [223,54],[224,51],[224,55],
  
  //Building 2 - Second Floor Edges
  [147,"B2-2R"],["B2-2R",212],[212,213],[212,214],[212,215],[213,"C1"],[213,"C4"],[214,"C2"],[214,"C5"],[215,"C3"],
  [215,"C6"],[213,"MIS"],["B2-2R",216],[216,"B2-F2"],[212,217],[217,210],[210,"B-M2"],
  
  //Building 3 - Second Floor Edges
  [151,225],[225,226],[226,227],[226,60],[226,228],[226,229],[227,56],[227,61],[228,57],[229,58],[229,59],
  
  //Building 4 - Second Floor Edges
  [109,"B4-2R"],[134,"B4-2L"],["B4-2R",202],[202,203],[202,204],[202,205],[202,206],[202,207],[202,208],[203,43],
  [204,44],[205,45],[206,46],[207,47],[208,209],[209,"B4-F2"],["B4-2R",201],[201,"B-M2"],["B4-2R",231],

  //Building 1 - Third Floor Edges
  ["B1-GYM","SPAMO"],["B1-GYM","AHRO"],["B1-GYM",319],
  
  //Building 2 - Third Floor Edges
  ["B2-2R",230],[230,301],[301,302],[301,307],[302,303],[302,304],[302,305],[302,306],[303,62],[303,66],
  [304,63],[304,67],[305,64],[305,68],[306,65],[306,69],[307,"B2-F3"],[301,"B1-GYM"],[302,308],[308,309],
  [309,"B-M3"],[301,320],
  
  //Building 3 - Third Floor Edges
  ["B3-GYM","VR-M"],["B3-GYM","VR-F"],
  
  //Building 4 - Third Floor Edges
  [231,310],[310,311],[310,"B3-GYM"],[311,312],[311,313],[311,314],[311,315],[312,70],[312,74],[313,71],
  [313,75],[314,72],[314,76],[315,73],[315,77],[311,316],[316,317],[317,"B4-F3"],[310,318],[318,"B-M3"],[310,321],

  //Building 1 - Fourth Floor Edges
  [319,419],[419,"SH"],
  
  //Building 2 - Fourth Floor Edges
  [320,401],[401,402],[401,407],[402,403],[402,404],[402,405],[402,406],[402,408],[403,78],[403,82],
  [404,79],[404,83],[405,80],[405,84],[406,81],[406,85],[407,"B2-F4"],[408,409],[409,"B-M4"],[401,420],
  
  //Building 3 - Fourth Floor
  [410,"FC"],
  
  //Building 4 - Fourth Floor
  [321,410],[410,411],[411,412],[411,413],[411,414],[411,415],[412,86],[412,90],[413,87],[413,91],
  [414,88],[414,92],[415,89],[415,93],[410,418],[418,"B-M4"],[411,416],[416,417],[417,"B4-F4"],[410,421],

  //Building 2 - Fifth Floor
  [420,501],[501,502],[501,507],[502,503],[502,504],[502,505],[502,506],[503,94],[503,98],[504,95],
  [504,99],[505,96],[505,100],[506,97],[506,152],[507,"B2-F5"],[502,508],[508,509],[509,"B-M5"],[501,519],
  
  //Building 4 - Fifth Floor
  [421,510],[510,511],[511,512],[511,513],[511,514],[511,515],[512,153],[512,157],[513,154],[513,158],
  [514,155],[514,159],[515,156],[515,160],[511,516],[516,517],[517,"B4-F5"],[510,518],[518,"B-M5"],[510,520],

  //Building 2 - Sixth Floor
  [501,519],[519,601],[601,602],[602,"GYM"],[602,"P.E."],[601,603],[603,"B2-F6"],[601,"B-M6"],
  //Building 4 - Sixth Floor
  [510,520],[520,605],[605,606],[606,"ISHTM"],[605,"Theatre"],

  //Building 4 - Seventh Floor
  [607,701],[701,"Balcony"],
]

// ─────────────────────────────────────────────────────────────
//  FLOOR BLOCKS — visual room rectangles for SVG drawing
// ─────────────────────────────────────────────────────────────
export const FLOOR_BLOCKS = {
  1: [
    // Building outlines
    { x:11.5, y:11, w:10, h:10, label:'Building 1', type:'building' },
    { x:11.5, y:0,  w:10, h:10, label:'Building 2', type:'building' },
    { x:0.5,  y:11, w:10, h:10, label:'Building 3', type:'building' },
    { x:0.5,  y:0,  w:10, h:10, label:'Building 4', type:'building' },
    // Hallways
    { x:0.5,  y:10, w:21, h:1,  label:'Hallway', type:'hallway' },
    { x:10.5, y:0,  w:1,  h:10, label:'Hallway', type:'hallway' },
    { x:10.5, y:11, w:1,  h:10, label:'Hallway', type:'hallway' },
    // Building 1 rooms
    { x:11.5, y:11,   w:4,   h:3,   label:"Registrar's Office",    type:'office' },
    { x:11.5, y:14,   w:1.5, h:7,   label:"Registrar's Office",    type:'office' },
    { x:17.5, y:18.5, w:4,   h:2.5, label:'Guidance Office',       type:'office' },
    { x:17.5, y:16,   w:4,   h:2.5, label:'NSTP Office',           type:'office' },
    { x:17.5, y:11,   w:3,   h:5,   label:'Accounting Office',     type:'office' },
    { x:13,   y:19,   w:2.5, h:2,   label:'CDJP Office',           type:'office' },
    { x:13,   y:17,   w:2.5, h:2,   label:'Student Affairs Office',type:'office' },
    { x:13,   y:15.5, w:1.5, h:1.5, label:'Male Restroom',         type:'facility' },
    { x:13,   y:14,   w:2.5, h:1.5, label:'Female Restroom',       type:'facility' },
    { x:15.5, y:14,   w:0.8, h:0.7, label:'Stairs',                type:'stairs' },
    // Building 2 rooms
    { x:11.5, y:0,   w:9,   h:3,   label:'Library',              type:'library' },
    { x:16,   y:3,   w:4.5, h:2.5, label:'Supply Section',       type:'office' },
    { x:11.5, y:3,   w:4.5, h:2.5, label:'HRM Tools & Equipment',type:'facility' },
    { x:16,   y:5.5, w:4.5, h:2.5, label:'Laboratory',           type:'laboratory' },
    { x:12.5, y:5.5, w:3.5, h:2.5, label:'Multi-Purpose',        type:'facility' },
    { x:11.5, y:5.5, w:1,   h:2.5, label:'Electrical Room',      type:'facility' },
    { x:11.5, y:8,   w:2,   h:1.5, label:'',                     type:'facility' },
    { x:18.5, y:8,   w:2,   h:1.5, label:'',                     type:'facility' },
    { x:12,   y:8.5, w:2,   h:1,   label:'Stairs',               type:'stairs' },
    { x:18,   y:8.5, w:2,   h:1,   label:'Stairs',               type:'stairs' },
    // Building 3 rooms
    { x:0.5, y:17.5, w:4,   h:3.5, label:'Clinic',           type:'facility' },
    { x:0.5, y:11,   w:4,   h:3.3, label:'Drug Testing Room',type:'facility' },
    { x:6.5, y:18.5, w:4,   h:2.5, label:'Admission Office', type:'office' },
    { x:6.5, y:16.5, w:4,   h:2,   label:'Testing Room',     type:'office' },
    { x:6.5, y:11,   w:4,   h:4.5, label:'Social Lounge',    type:'facility' },
    { x:7.5, y:15.5, w:3,   h:1,   label:'Stairs',           type:'stairs' },
    { x:2.8, y:16,   w:1.7, h:1.5, label:'♿ Restroom',      type:'facility' },
    { x:0.5, y:16,   w:2.3, h:1.5, label:'Restroom',         type:'facility' },
    { x:0.5, y:14.3, w:1.3, h:1.7, label:'Restroom',         type:'facility' },
    // Building 4 rooms
    { x:0.5, y:8,   w:2,   h:1.5, label:'',          type:'facility' },
    { x:8.5, y:8,   w:2,   h:1.5, label:'',          type:'facility' },
    { x:0.5, y:0,   w:5,   h:8,   label:'',          type:'building' },
    { x:5.5, y:0,   w:5,   h:2.6, label:'',          type:'building' },
    { x:5.5, y:2.6, w:5,   h:2.7, label:'Laboratory',type:'laboratory' },
    { x:5.5, y:5.3, w:5,   h:2.7, label:'Laboratory',type:'laboratory' },
    { x:5,   y:9,   w:1,   h:1,   label:'Elevator',  type:'elevator' },
    { x:1.5, y:8.5, w:2,   h:1,   label:'Stairs',    type:'stairs' },
    { x:8,   y:8.5, w:2,   h:1,   label:'Stairs',    type:'stairs' },
  ],

  2: [
    // Building outlines
    { x:11.5, y:11,  w:10,  h:10,  label:'Building 1', type:'building' },
    { x:11.5, y:0,   w:10,  h:10,  label:'Building 2', type:'building' },
    { x:0.5,  y:11,  w:10,  h:10,  label:'Building 3', type:'building' },
    { x:0.5,  y:0,   w:10,  h:10,  label:'Building 4', type:'building' },
    { x:4.4,  y:9.5, w:2.3, h:0.5, label:'',           type:'hallway' },
    { x:10.5, y:9.5, w:1,   h:0.5, label:'',           type:'hallway' },
    // Restrooms
    { x:10,   y:8,  w:2,   h:1.5, label:'Restroom', type:'facility' },
    { x:20,   y:8,  w:1.5,   h:2,   label:'Restroom', type:'facility' },
    //Building 1 rooms
    {x:17.8,  y:18.3, w:3.7, h:2.7, label:'Office of the College Deans',                           type:'office'},
    {x:17.8,  y:16.8, w:3.7, h:1.5, label:'Judicial Court Simulation Lab',                         type:'laboratory'},
    {x:17.8,  y:12.8, w:3.7, h:1.5, label:'Judicial Court Simulation Lab',                         type:'laboratory'},
    {x:17.8,  y:14.3, w:3.7, h:2.5, label:'Multi-Purpose Academic Hall',                           type:'office'},
    {x:11.5,  y:11,   w:10,  h:1,   label:'Office of the College Deans and Academic Coordinators', type:'office'},
    {x:11.5,  y:12,   w:3.3, h:3,   label:'Faculty Room & Lounge',                                 type:'facility'},
    {x:11.5,  y:18,   w:3.3, h:3,   label:'Online Teaching Hub',                                   type:'facility'},
    {x:11.5,  y:15,   w:3.3, h:3,   label:'Academic Affairs Office',                               type:'office'},
    {x:14.8,  y:14,   w:1.2, h:2,   label:'Stairs',                                                type:'stairs'},
    {x:15.6,  y:19.7, w:1.4, h:1.3, label:'Stairs',                                                type:'stairs'},
    // Building 2 rooms
    { x:11.5, y:0,   w:4,   h:2.6, label:'Computer Laboratory', type:'laboratory' },
    { x:11.5, y:2.6, w:4,   h:2.7, label:'Computer Laboratory', type:'laboratory' },
    { x:11.5, y:5.3, w:4,   h:2.7, label:'Computer Laboratory', type:'laboratory' },
    { x:17.5, y:0,   w:4,   h:2.6, label:'Computer Laboratory', type:'laboratory' },
    { x:17.5, y:2.6, w:4,   h:2.7, label:'Computer Laboratory', type:'laboratory' },
    { x:17.5, y:5.3, w:4,   h:2.7, label:'Computer Laboratory', type:'laboratory' },
    { x:15.5, y:0,   w:2,   h:1.5, label:'MIS Room',            type:'office' },
    { x:12,   y:8,   w:2,   h:1.5, label:'Stairs',              type:'stairs' },
    { x:18,   y:8,   w:2,   h:1.5, label:'Stairs',              type:'stairs' },
    // Building 3 rooms
    {x:0.5, y:11,   w:3.5, h:3.3, label:'Board Room',             type:'facility'},
    {x:0.5, y:14.3, w:3.5, h:3.3, label:'Board Room',             type:'facility'},
    {x:0.5, y:17.6, w:3.5, h:3.4, label:'Office of the Chairman', type:'office'},
    {x:7,   y:16.5, w:3.5, h:2.3, label:'Broadcasting Room',      type:'room'},
    {x:7,   y:18.8, w:3.5, h:2.2, label:'Media Arts Center',      type:'room'},
    {x:7,   y:11,   w:3.5, h:1.5, label:'Restroom',               type:'facility'},
    {x:7,   y:12.5, w:3.5, h:1.5, label:'MIS Department',         type:'office'},
    {x:7,   y:14,   w:3.5, h:1.5, label:"",                       type:'facility'},
    {x:7.5, y:15.5, w:3,   h:1,   label:'Stairs',                 type:'stairs'},
    {x:4.8, y:19.7, w:1.4, h:1.3, label:'Stairs',                 type:'stairs'},
    // Building 4 rooms
    { x:0.5, y:8,   w:1,   h:2,   label:'Restroom',                    type:'facility' },
    { x:5,   y:9,   w:1,   h:1,   label:'Elevator',                    type:'elevator' },
    { x:0.5, y:4,   w:4,   h:4,   label:'CISCO Room',                  type:'laboratory' },
    { x:0.5, y:0,   w:4,   h:4,   label:'Speech Laboratory',           type:'laboratory' },
    { x:6.5, y:5.2, w:4,   h:2.8, label:'DRM Laboratory',              type:'laboratory' },
    { x:6.5, y:2.5, w:4,   h:2.7, label:'E-Learning Hub',              type:'laboratory' },
    { x:6.5, y:0,   w:4,   h:2.5, label:'Senior High School Dept.',     type:'office' },
    { x:1.5, y:8,   w:2,   h:1.5, label:'Stairs',                      type:'stairs' },
    { x:8,   y:8,   w:2,   h:1.5, label:'Stairs',                      type:'stairs' },
  ],

  3: [
    // Building outlines
    { x:11.5, y:11, w:10, h:10, label:'Building 1', type:'building' },
    { x:11.5, y:0,  w:10, h:10, label:'Building 2', type:'building' },
    { x:0.5,  y:11, w:10, h:10, label:'Building 3', type:'building' },
    { x:0.5,  y:0,  w:10, h:10, label:'Building 4', type:'building' },
    { x:4.4,  y:9.5, w:2.3, h:0.5, label:'', type:'hallway' },
    { x:10.5, y:9.5, w:1,   h:0.5, label:'', type:'hallway' }, 
    // Hallways
    { x:0.5,  y:10, w:21, h:1,  label:'', type:'hallway' },
    { x:10.5, y:11, w:1,  h:10, label:'', type:'hallway' },
    {x:10.5,y:8, w:1, h:2,label:"",       type:'hallway'},
    {x:5, y:9, w:1, h:1, label:"Elevator",type:'elevator'},
    //Building 1 rooms
    {x:17,   y:18.5, w:4.5, h:2.5, label:'AHRO',   type:'office'},
    {x:11.5, y:18.5, w:4.1, h:2.5, label:'SPAMO',  type:'office'},
    {x:15.6, y:19.7, w:1.4, h:1.3, label:'Stairs', type:'stairs'},
    {x:10.5, y:18.5, w:1,   h:2.5, label:'Stairs', type:'stairs'},
    //Building 2 rooms
    {x:17.5, y:4, w:4,   h:2,   label:'Lecture Room',            type:'room'},
    {x:17.5, y:2, w:4,   h:2,   label:'Lecture Room',            type:'room'},
    {x:17.5, y:6, w:4,   h:2,   label:'Lecture Room',            type:'room'},
    {x:17.5, y:0, w:4,   h:2,   label:'Online Teaching Hub - A', type:'facility'},
    {x:11.5, y:4, w:4,   h:2,   label:'Lecture Room',            type:'room'},
    {x:11.5, y:6, w:4,   h:2,   label:'Lecture Room',            type:'room'},
    {x:11.5, y:2, w:4,   h:2,   label:'Lecture Room',            type:'room'},
    {x:11.5, y:0, w:4,   h:2,   label:'Online Teaching Hub - B', type:'facility'},
    {x:12,   y:8, w:2,   h:1.5, label:'Stairs',                  type:'stairs'},
    {x:18,   y:8, w:2,   h:1.5, label:'Stairs',                  type:'stairs'},
    {x:20,   y:8, w:1.5, h:2,   label:'Restroom',                type:'facility'},
    //Building 3 rooms
    {x:6.2, y:18.5, w:4.3, h:2.5, label:'Varsity Room For Female', type:'facility'},
    {x:0.5, y:18.5, w:4.3, h:2.5, label:'Varsity Room For Male',   type:'facility'},
    {x:4.8, y:19.7, w:1.4, h:1.3, label:'Stairs',                  type:'stairs'},
    //Building 4 rooms
    {x:6.5, y:4, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:6.5, y:2, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:6.5, y:0, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:6.5, y:6, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:0.5, y:4, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:0.5, y:6, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:0.5, y:2, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:0.5, y:0, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:1.5, y:8, w:2, h:1.5, label:'Stairs',       type:'stairs'},
    {x:8,   y:8, w:2, h:1.5, label:'Stairs',       type:'stairs'},
    {x:0.5, y:8, w:1, h:2,   label:'Restroom',     type:'facility'},
    {x:10,  y:8, w:2, h:1.5, label:'Restroom',     type:'facility'},
  ],

  4: [
    // Building outlines
    { x:11.5, y:11, w:10, h:10, label:'Building 1', type:'building' },
    { x:11.5, y:0,  w:10, h:10, label:'Building 2', type:'building' },
    { x:0.5,  y:11, w:10, h:10, label:'Building 3', type:'building' },
    { x:0.5,  y:0,  w:10, h:10, label:'Building 4', type:'building' },
    { x:4.4,  y:9.5, w:2.3, h:0.5, label:'', type:'hallway' },
    { x:10.5, y:9.5, w:1,   h:0.5, label:'', type:'hallway' },
    //Hallways
    {x:10.5, y:8, w:1, h:2,   label:'',         type:'hallway'},
    {x:5,    y:9, w:1, h:1,   label:'Elevator', type:'elevator'},
    {x:12,   y:8, w:2, h:1.5, label:'Stairs',   type:'stairs'},
    {x:18,   y:8, w:2, h:1.5, label:'Stairs',   type:'stairs'},
    {x:20,   y:8, w:1, h:2,   label:'Restroom', type:'facility'},
    {x:10,   y:8, w:2, h:1.5, label:'Restroom', type:'facility'},
    { x:0.5,  y:10, w:21, h:1,  label:'', type:'hallway' },
    { x:10.5, y:11, w:1,  h:10, label:'', type:'hallway' },
    //Building 1 rooms
    {x:11.5, y:18,   w:10, h:3,   label:'Study Hall', type:'facility'},
    {x:10.5, y:18.5, w:1,  h:2.5, label:'Stairs',     type:'stairs'},
    //Building 2 rooms
    {x:17.5, y:4, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:17.5, y:2, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:17.5, y:6, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:17.5, y:0, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:11.5, y:4, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:11.5, y:6, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:11.5, y:2, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:11.5, y:0, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:12,   y:8, w:2,   h:1.5, label:'Stairs',       type:'stairs'},
    {x:18,   y:8, w:2,   h:1.5, label:'Stairs',       type:'stairs'},
    {x:20,   y:8, w:1.5, h:2,   label:'Restroom',     type:'facility'},
    //Building 3 rooms
    {x:0.5, y:11, w:9, h:3, label:'Food Court', type:'facility'},
    //Building 4 rooms
    {x:6.5, y:4, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:6.5, y:2, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:6.5, y:0, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:6.5, y:6, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:0.5, y:4, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:0.5, y:6, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:0.5, y:2, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:0.5, y:0, w:4, h:2,   label:'Lecture Room', type:'room'},
    {x:1.5, y:8, w:2, h:1.5, label:'Stairs',       type:'stairs'},
    {x:8,   y:8, w:2, h:1.5, label:'Stairs',       type:'stairs'},
    {x:0.5, y:8, w:1, h:2,   label:'Restroom',     type:'facility'},
    {x:10,  y:8, w:2, h:1.5, label:'Restroom',     type:'facility'},
  ],

  5:[
    // Building outlines
    { x:11.5, y:0,  w:10, h:10, label:'Building 2', type:'building' },
    { x:0.5,  y:0,  w:10, h:10, label:'Building 4', type:'building' },
    { x:0.5,  y:10, w:21, h:1,  label:'',           type:'hallway' },
    //Hallways
    {x:4.4,  y:9.5, w:2.3, h:0.5, label:'',         type:'hallway' },
    {x:10.5, y:9.5, w:1,   h:0.5, label:'',         type:'hallway' },
    {x:10.5, y:8,   w:1,   h:2,   label:'',         type:'hallway'},
    {x:5,    y:9,   w:1,   h:1,   label:'Elevator', type:'elevator'},
    {x:12,   y:8,   w:2,   h:1.5, label:'Stairs',   type:'stairs'},
    {x:18,   y:8,   w:2,   h:1.5, label:'Stairs',   type:'stairs'},
    {x:20,   y:8,   w:1,   h:2,   label:'Restroom', type:'facility'},
    {x:10,   y:8,   w:2,   h:1.5, label:'Restroom', type:'facility'},
    //Building 2 rooms
    {x:17.5, y:4, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:17.5, y:2, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:17.5, y:6, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:17.5, y:0, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:11.5, y:4, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:11.5, y:6, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:11.5, y:2, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:11.5, y:0, w:4,   h:2,   label:'Lecture Room', type:'room'},
    {x:12,   y:8, w:2,   h:1.5, label:'Stairs',       type:'stairs'},
    {x:18,   y:8, w:2,   h:1.5, label:'Stairs',       type:'stairs'},
    {x:20,   y:8, w:1.5, h:2,   label:'Restroom',     type:'facility'},
    //Building 4 rooms
    {x:6.5, y:4, w:4, h:2,   label:"Lecture Room", type:'room'},
    {x:6.5, y:2, w:4, h:2,   label:"Lecture Room", type:'room'},
    {x:6.5, y:0, w:4, h:2,   label:"Lecture Room", type:'room'},
    {x:6.5, y:6, w:4, h:2,   label:"Lecture Room", type:'room'},
    {x:0.5, y:4, w:4, h:2,   label:"Lecture Room", type:'room'},
    {x:0.5, y:6, w:4, h:2,   label:"Lecture Room", type:'room'},
    {x:0.5, y:2, w:4, h:2,   label:"Lecture Room", type:'room'},
    {x:0.5, y:0, w:4, h:2,   label:"Lecture Room", type:'room'},
    {x:1.5, y:8, w:2, h:1.5, label:"Stairs",       type:'stairs'},
    {x:8,   y:8, w:2, h:1.5, label:"Stairs",       type:'stairs'},
    {x:0.5, y:8, w:1, h:2,   label:"Restroom",     type:'facility'},
    {x:10,  y:8, w:2, h:1.5, label:"Restroom",     type:'facility'},
  ],

  6:[
    // Building outlines
    { x:11.5, y:0,  w:10, h:10, label:'Building 2', type:'building' },
    { x:0.5,  y:0,  w:10, h:10, label:'Building 4', type:'building' },
    { x:0.5,  y:10, w:21, h:1,  label:'',           type:'hallway' },

    //Building 2 rooms
    {x:17.5, y:6, w:4,   h:2,   label:"P.E Faculty",          type:'facility'},
    {x:11.5, y:6, w:3.5, h:2,   label:"Storage Room",         type:'facility'},
    {x:11.5, y:0, w:10,  h:1.5, label:"Bleachers",            type:'chairs'},
    {x:12.5, y:8, w:2,   h:1,   label:"Stairs",               type:'stairs'},
    {x:18,   y:8, w:2,   h:1,   label:"Stairs",               type:'stairs'},
    {x:11.5, y:8, w:1,   h:2,   label:"Male Dressing Room",   type:'facility'},
    {x:20,   y:8, w:1.5, h:2,   label:"Female Dressing Room", type:'facility'},

    //Building 4 rooms
    {x:1.5, y:8,   w:2,   h:1.5, label:"Stairs",                            type:'stairs'},
    {x:8,   y:8,   w:2,   h:1.5, label:"Stairs",                            type:'stairs'},
    {x:0.5, y:8,   w:1,   h:2,   label:"",                                  type:'facility'},
    {x:10,  y:8,   w:0.5, h:2,   label:"",                                  type:'facility'},
    {x:3,   y:0,   w:5,   h:1.8, label:"Stage",                             type:'facility'},
    {x:8,   y:0,   w:2.5, h:1.5, label:"Back stage",                        type:'facility'},
    {x:0.5, y:0,   w:2.5, h:1.5, label:"Back stage",                        type:'facility'},
    {x:1.3, y:2.3, w:8.5, h:2.5, label:"Chairs",                            type:'chairs'},
    {x:1.3, y:4.8, w:8.5, h:2.5, label:"",                                  type:'facility'},
    {x:2.1, y:4.8, w:7,   h:2.5, label:"ISHTM Hotel Simulation Laboratory", type:'laboratory'},
  ],

  7: [
    //Building Blocks
    {x:0.5, y:0,   w:10,  h:10,  label:'Building 4', type:'building' },
    {x:1.3, y:2.3, w:8.5, h:2.5, label:"Chairs",     type:'chairs'},
    {x:0.5, y:4.5, w:10,  h:3.5, label:"",           type:'facility'},

    //Theatre
    {x:1.5, y:8, w:2,   h:1,  label:"Stairs",           type:'stairs'},
    {x:8,   y:8, w:2,   h:1,  label:"Stairs",           type:'stairs'},
    {x:0.5, y:8, w:1,   h:2,  label:"",                 type:'facility'},
    {x:10,  y:8, w:0.5, h:2,  label:"",                 type:'facility'},
    {x:3,   y:0, w:5,   h:1.8,label:"Stage",            type:'facility'},
    {x:8,   y:0, w:2.5, h:1.5,label:"Back stage",       type:'facility'},
    {x:0.5, y:0, w:2.5, h:1.5,label:"Back stage",       type:'facility'},
    {x:1.3, y:5, w:8.5, h:2,  label:"Chairs",           type:'chairs'},
    {x:4.2, y:7, w:3,   h:1,  label:"Theatre Operator", type:'facility'},
  ],
}

// ── Floor labels ─────────────────────────────────────────────
export const FLOOR_LABELS = {
  1: 'GROUND',
  2: 'SECOND',
  3: 'THIRD',
  4: 'FOURTH',
  5: 'FIFTH',
  6: 'SIXTH',
  7: 'SEVENTH',
}

// ── Type metadata (colors + icons) ───────────────────────────
export const TYPE_META = {
  entrance:  { color:'#34d399', icon:'🚪', fill:'#0c3028' },
  office:    { color:'#60a5fa', icon:'🏢', fill:'#112240' },
  Registrar: { color:'#60a5fa', icon:'🏢', fill:'#112240' },
  Accounting:{ color:'#60a5fa', icon:'🏢', fill:'#112240' },
  library:   { color:'#c084fc', icon:'📚', fill:'#1a0f2e' },
  laboratory:{ color:'#fbbf24', icon:'💻', fill:'#1a1500' },
  lecture:   { color:'#22d3ee', icon:'🎓', fill:'#0a1f2e' },
  lounge:    { color:'#fb923c', icon:'🛋️', fill:'#1a0f00' },
  clinic:    { color:'#f87171', icon:'🏥', fill:'#1a0505' },
  restroom:  { color:'#2dd4bf', icon:'🚻', fill:'#051a18' },
  hallway:   { color:'#1e3a5f', icon:'',   fill:'#070f1e' },
  stairs:    { color:'#334155', icon:'🪜', fill:'#0a1020' },
  elevator:  { color:'#0ea5e9', icon:'🛗', fill:'#0a2030' },
  building:  { color:'#1e3a5f', icon:'🏗️', fill:'#0d1b2e' },
  facility:  { color:'#475569', icon:'',   fill:'#111827' },
  exit:      { color:'#f87171', icon:'🚪', fill:'#1a0505' },
}

// ── Search — find location by name ───────────────────────────
export function findLocationByName(query, locs = LOCATIONS) {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return locs.filter(l =>
    l.name.toLowerCase().includes(q) ||
    l.type.toLowerCase().includes(q) ||
    (l.desc || '').toLowerCase().includes(q) ||
    `floor ${l.floor}`.includes(q) ||
    (l.building != null && `building ${l.building}`.includes(q))
  )
}

/* ─────────────────────────── A* ALGORITHM ──────────────────────────── */
function heuristic(a, b, locs) {
  const la = locs.find(l=>l.id===a), lb = locs.find(l=>l.id===b);
  if(!la||!lb) return Infinity;
  return Math.sqrt((la.x-lb.x)**2+(la.y-lb.y)**2);
}
function aStar(start, goal, locs, edges) {
  if(start===goal) return [start];
  const adj={};
  edges.forEach(([a,b])=>{ if(!adj[a])adj[a]=[]; if(!adj[b])adj[b]=[]; adj[a].push(b); adj[b].push(a); });
  const open=new Set([start]), came={};
  const g={}, f={};
  locs.forEach(l=>{ g[l.id]=Infinity; f[l.id]=Infinity; });
  g[start]=0; f[start]=heuristic(start,goal,locs);
  while(open.size>0){
    let cur=[...open].reduce((b,n)=>f[n]<f[b]?n:b);
    if(cur===goal){ const p=[]; let c=cur; while(c!==undefined){p.unshift(c);c=came[c];} return p; }
    open.delete(cur);
    for(const nb of (adj[cur]||[])){
      const t=g[cur]+heuristic(cur,nb,locs);
      if(t<g[nb]){ came[nb]=cur; g[nb]=t; f[nb]=t+heuristic(nb,goal,locs); open.add(nb); }
    }
  }
  return [];
}
function getDirections(pathIds, locs) {
  if (pathIds.length < 2) return [];
  const directions = [];
  for (let i = 0; i < pathIds.length; i++) {
    const curr = locs.find(l => l.id === pathIds[i]);
    const next = locs.find(l => l.id === pathIds[i + 1]);
    const prev = locs.find(l => l.id === pathIds[i - 1]);
    if (!curr) continue;

    if (i === 0) {
      directions.push({ icon:"🚶", text:`Start at ${curr.name}`, sub:`Floor ${curr.floor} · ${curr.type}` });
      continue;
    }
    if (i === pathIds.length - 1) {
      directions.push({ icon:"🏁", text:`Arrive at ${curr.name}`, sub:`Floor ${curr.floor} · ${curr.type}` });
      continue;
    }

    // Calculate angle between previous→current→next
    const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
    const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
    let turn = (angle2 - angle1) * (180 / Math.PI);
    if (turn > 180) turn -= 360;
    if (turn < -180) turn += 360;

    // Floor change detection
    const floorChange = next.floor !== curr.floor;
    const floorDiff = next.floor - curr.floor;

    let icon, text;
    if (floorChange) {
      icon = floorDiff > 0 ? "🔼" : "🔽";
      text = `${floorDiff > 0 ? "Go up" : "Go down"} to Floor ${next.floor} via stairs`;
    } else if (turn < -45) {
      icon = "↰"; text = `Turn left to ${next.name}`;
    } else if (turn > 45) {
      icon = "↱"; text = `Turn right to ${next.name}`;
    } else if (turn < -15) {
      icon = "↖"; text = `Turn left to ${next.name}`;
    } else if (turn > 15) {
      icon = "↗"; text = `Turn right to ${next.name}`;
    } else {
      icon = "⬆"; text = `Continue straight to ${next.name}`;
    }

    directions.push({ icon, text, sub:`Floor ${curr.floor} · ${curr.type}` });
  }
  return directions;
}

export async function fetchNavigation(destId) {

  const dest = LOCATIONS.find(l => l.id === destId)
  if (!dest) return { path: [], directions: [] }

  const path = aStar(KIOSK_NODE_ID, destId, LOCATIONS, EDGES)
  const directions = getDirections(path, LOCATIONS)

  return { path, directions }
}
