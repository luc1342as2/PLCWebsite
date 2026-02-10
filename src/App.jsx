import './App.css'
import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useParams } from 'react-router-dom'

const stages = [
  {
    id: 1,
    title: 'Stage 1 – Industrial Automation & Electrical Basics',
    slug: 'stage-1',
    summary:
      'Build a solid foundation in voltage, current, resistance, sensors, actuators, safety, and how automation systems are wired.',
    topics: [
      'Basic electrical concepts: voltage, current, resistance, AC/DC and Ohm’s Law',
      'Reading electrical schematics and wiring diagrams',
      'Sensors and actuators: inductive, capacitive, photoelectric, relays, motors, valves',
      'Industrial safety: lockout/tagout, grounding, protections, PPE and standards',
      'Automation systems and control panels: from sensor to PLC to actuator',
      'Cable types, wire sizing and protection devices for control circuits',
      'Best practices for panel layout, labeling and documentation',
    ],
    examples: [
      'Calculate the resistor needed for a 24VDC circuit where the load current is 0.2A.',
      'Interpret a simple wiring diagram that connects a photoelectric sensor to PLC input I0.0.',
      'Design an emergency stop loop with safety relays and contactors.',
      'Propose a control-panel layout for a small machine including power supply, PLC and terminal blocks.',
      'Select appropriate cable and fuses for a 24VDC digital I/O wiring task.',
      'Sketch a simple one-line diagram for a small control panel and label all protective devices.',
      'Map every physical device in a small system (sensors, actuators, power supply) to its symbol on a wiring diagram.',
    ],
    programs: [
      'If inductive_sensor = TRUE then cylinder_extend := TRUE;',
      'IF PhotoSensor AND NOT EStop THEN Motor := TRUE; END_IF;',
      '(* Interlock example: prevent forward and reverse from energizing together *) IF FwdCmd AND NOT RevCmd THEN MotorFwd := TRUE; END_IF;',
    ],
    skills: [
      'Applying Ohm’s law and basic electrical calculations',
      'Reading and understanding industrial wiring diagrams',
      'Selecting and wiring common industrial sensors and actuators',
      'Understanding basic safety concepts like E-Stop and lockout/tagout',
      'Communicating effectively with electricians and maintenance technicians',
      'Documenting simple industrial circuits in a professional, reusable format',
    ],
  },
  {
    id: 2,
    title: 'Stage 2 – PLC Automation Fundamentals',
    slug: 'stage-2',
    summary:
      'Learn how PLC hardware works, how to program it using IEC 61131-3 languages, and how to debug real systems.',
    topics: [
      'PLC hardware architecture: CPU, power supply, I/O modules and the scan cycle',
      'PLC programming languages: Ladder Diagram (LD), Structured Text (ST), Function Block Diagram (FBD)',
      'Digital and analog I/O handling with scaling to engineering units',
      'Timers, counters, comparators and basic logic design',
      'Debugging, online monitoring, forcing I/O and systematic fault finding',
      'Addressing schemes and tag naming conventions in real projects',
      'Good coding style, comments and versioning habits for PLC logic',
    ],
    examples: [
      'Implement a start/stop circuit for a motor using a start pushbutton, stop pushbutton and seal-in contact.',
      'Scale a 4–20 mA analog input representing 0–100 °C into engineering units in your PLC.',
      'Use online monitoring to trace why an output coil never energizes in a ladder rung.',
      'Refactor a long ladder network into reusable rungs or function blocks with clear naming.',
      'Create a simple state machine for an automatic cycle using a few internal bits or an integer step counter.',
      'Draw a timing diagram that shows inputs and outputs for a simple start/stop sequence.',
      'Design and implement a three-step traffic light sequence with timers and clear internal state bits.',
    ],
    programs: [
      '(* Simple motor start/stop in ST *) IF Start_PB AND NOT Stop_PB THEN Motor := TRUE; END_IF; IF Stop_PB THEN Motor := FALSE; END_IF;',
      '(* TON timer example: start conveyor after 5s delay *) TON_Conveyor(IN := StartCmd, PT := T#5S); IF TON_Conveyor.Q THEN Conveyor := TRUE; END_IF;',
      '(* Simple step sequence using an integer step variable *) CASE Step OF 0: IF Start THEN Step := 10; END_IF; 10: IF Sensor1 THEN Step := 20; END_IF; 20: IF Sensor2 THEN Step := 0; END_IF; END_CASE;',
    ],
    skills: [
      'Understanding PLC scan cycle and I/O update',
      'Programming in Ladder and Structured Text',
      'Using timers, counters and comparators in logic',
      'Troubleshooting PLC programs with online monitoring and forcing',
      'Structuring PLC programs into clear networks, blocks and routines',
      'Writing professional comments and naming tags for long-term maintainability',
    ],
  },
  {
    id: 3,
    title: 'Stage 3 – HMI, PLC & SCADA Fundamentals',
    slug: 'stage-3',
    summary:
      'Design user-friendly HMIs, connect them to PLCs with tags, and understand how SCADA systems log and visualize data.',
    topics: [
      'HMI fundamentals and screen navigation design for operators and maintenance',
      'HMI–PLC communication using tags, variables and industrial protocols',
      'Alarms, trends and data visualization best practices',
      'User management, roles and basic security on HMIs',
      'Introduction to SCADA systems, centralized monitoring and data logging',
      'Human factors: designing for clarity, speed and error reduction',
      'Best practices for alarm philosophy and alarm rationalization',
    ],
    examples: [
      'Create an overview screen that shows the status of three motors with color-coded lamps.',
      'Configure an alarm that triggers when Tank_Level > 80% and resets below 70%.',
      'Design a trend screen that plots temperature and flow rate over the last 60 minutes.',
      'Redesign a crowded HMI screen into a clearer layout with fewer colors and better grouping.',
      'Define a small set of alarm priorities and demonstrate how they appear in an alarm banner.',
      'Sketch wireframes for an HMI navigation structure (overview, detail, alarms, trends).',
      'Design a faceplate concept for a motor that can be reused across multiple screens.',
    ],
    programs: [
      '(* Alarm bit in PLC for high tank level *) IF Tank_Level > 80.0 THEN Alarm_TankHigh := TRUE; ELSIF Tank_Level < 70.0 THEN Alarm_TankHigh := FALSE; END_IF;',
      '(* HMI tag example *) Motor_Start_Cmd : BOOL; (* bound to HMI start button *)',
      '(* Simple alarm summary bits for HMI *) Any_Alarm := Alarm_TankHigh OR Alarm_PumpFault OR Alarm_SensorError;',
    ],
    skills: [
      'Designing HMI navigation and screen hierarchy',
      'Defining and mapping HMI tags to PLC memory',
      'Configuring alarms, trends and status indicators',
      'Planning user roles and basic HMI security',
      'Applying usability principles to HMI layouts and workflows',
      'Collaborating with operators to capture real information needs and feedback',
    ],
  },
  {
    id: 4,
    title: 'Stage 4 – Industrial Communication & Networking',
    slug: 'stage-4',
    summary:
      'Understand how PLCs, HMIs and field devices talk over Fieldbus and Industrial Ethernet, and how to troubleshoot networks.',
    topics: [
      'Fieldbus basics: Modbus RTU and Modbus TCP frames and use cases',
      'Industrial Ethernet: Profinet and EtherNet/IP concepts and applications',
      'Network topology and IP addressing for automation systems',
      'PLC-to-PLC communication patterns and data exchange',
      'Troubleshooting communication errors and calculating error rates',
      'Managed vs unmanaged switches and when to use each',
      'Basic network diagnostics with ping, port scanners and vendor tools',
    ],
    examples: [
      'Define a Modbus TCP client that reads holding registers from a remote energy meter.',
      'Choose a star or line topology for a small production cell and justify the choice.',
      'Calculate the update time for a 512-byte cyclic packet on a 100 Mbps network.',
      'Simulate a communication fault and design a safe fallback behavior in the PLC.',
      'Propose an IP addressing plan for a small plant with PLCs, HMIs and remote I/O.',
      'Draw a simple network diagram for a cell with PLC, HMI, drives and a SCADA server.',
      'Identify which signals should be exchanged between two PLCs and document their data types.',
    ],
    programs: [
      '(* Example of copying data from a Modbus input register array to internal tags *) FOR i := 0 TO 9 DO Temperature_Array[i] := REAL(Modbus_In[i]) * 0.1; END_FOR;',
      '(* Simple heartbeat between PLCs *) Heartbeat_Out := NOT Heartbeat_Out; (* sent cyclically over a communication block *)',
      '(* Basic comms watchdog *) IF NOT Comms_OK THEN Line_Stop := TRUE; END_IF;',
    ],
    skills: [
      'Understanding Modbus RTU/TCP and basic frame structure',
      'Working with industrial Ethernet concepts (Profinet, EtherNet/IP)',
      'Choosing topologies and IP addressing schemes for small networks',
      'Troubleshooting communication issues and evaluating error rates',
      'Collaborating effectively with IT/OT network specialists',
      'Designing communication architectures that are robust to faults and future expansion',
    ],
  },
  {
    id: 5,
    title: 'Stage 5 – Motion Control & Drives',
    slug: 'stage-5-motion',
    summary:
      'Dive into motion control systems, from variable frequency drives to servo axes, and understand how speed and position are controlled.',
    topics: [
      'Motion control basics: inverters (VFDs), servo drives and feedback devices',
      'Motor speed calculations and slip in induction motors',
      'Typical motion applications: conveyors, pick-and-place, packaging lines',
      'Parameterizing drives and basic commissioning steps',
      'Coordinating multiple axes in automation systems',
      'Safety concepts around motion, safe torque off (STO) and safe speeds',
      'Mechanical considerations: inertia, load types and basic sizing ideas',
    ],
    examples: [
      'Compute the synchronous speed of a 4-pole motor at 50 Hz and estimate actual speed with slip.',
      'Configure a VFD to ramp a conveyor from 0 to set speed in 3 seconds.',
      'Program a simple homing sequence for a servo axis before automatic mode.',
      'Compare two different acceleration ramps for a conveyor and explain the effect on the mechanical system.',
      'Create a simple jogging function for manual positioning with safety interlocks.',
      'Sketch a motion profile (position vs time) for a pick-and-place operation.',
      'Identify which interlocks should be shown on an HMI faceplate for a critical axis.',
    ],
    programs: [
      '(* Motor speed calculation example as comment *) (* Speed_rpm := (Frequency_Hz * 60) / PolePairs; *)',
      '(* Simple motion command pseudo-code *) IF Start_Move THEN Axis0.Command := MC_MoveAbsolute(Position := 1000.0, Velocity := 200.0); END_IF;',
      '(* Basic homing flag logic *) IF Home_Sensor THEN Homed := TRUE; END_IF;',
    ],
    skills: [
      'Understanding VFDs, servos and feedback devices',
      'Calculating motor speeds and interpreting drive parameters',
      'Designing simple motion sequences and homing routines',
      'Coordinating motion with PLC logic and safety functions',
      'Discussing motion requirements with mechanical engineers and vendors',
      'Commissioning drives and simple motion axes in a structured, low-risk way',
    ],
  },
  {
    id: 6,
    title: 'Stage 6 – PID & Process Control',
    slug: 'stage-6-pid',
    summary:
      'Learn how PID controllers keep process variables like temperature, pressure and flow stable in industrial plants.',
    topics: [
      'PID control law: proportional, integral and derivative terms',
      'Tuning concepts and the effect of each parameter',
      'Examples: temperature, level and speed control loops',
      'Anti-windup, filtering and practical implementation notes',
      'Integrating PID blocks into PLC programs safely',
      'Feedforward, cascade and ratio control at an introductory level',
      'Using trends and data logging to evaluate and refine tuning',
    ],
    examples: [
      'Describe how increasing Kp affects overshoot and response speed in a temperature loop.',
      'Implement a manual/auto switch for a PID controller with bumpless transfer.',
      'Log setpoint, process value and output to trend the performance of a loop.',
      'Tune a simple level loop using a structured trial-and-error method, documenting each change.',
      'Compare the behavior of a PI versus PID controller on the same simulated process.',
      'Sketch typical trend plots for an underdamped, overdamped and well-tuned loop.',
      'Define a basic checklist for commissioning a new PID loop safely.',
    ],
    programs: [
      '(* PID function block call example *) PID_Temp( SP := 80.0, PV := Temp_PV, Kp := 2.0, Ti := 30.0, Td := 0.0, CV => Heater_Output );',
      '(* Manual/auto selection *) IF PID_Manual THEN Heater_Output := Manual_Output; ELSE Heater_Output := PID_Temp.CV; END_IF;',
      '(* Simple anti-windup clamp *) IF PID_Temp.CV > 100.0 THEN PID_Temp.CV := 100.0; ELSIF PID_Temp.CV < 0.0 THEN PID_Temp.CV := 0.0; END_IF;',
    ],
    skills: [
      'Interpreting PID parameters and their effect on loops',
      'Integrating PID controllers into PLC programs',
      'Implementing manual/auto control with bumpless transfer',
      'Evaluating loop performance using trends and logged data',
      'Communicating with process engineers about loop performance and tuning goals',
      'Designing basic control strategies that balance stability and responsiveness',
    ],
  },
  {
    id: 7,
    title: 'Stage 7 – Structured Programming & Diagnostics',
    slug: 'stage-7-structure',
    summary:
      'Structure PLC programs into reusable, well-documented modules with strong diagnostics and availability monitoring.',
    topics: [
      'Functions, function blocks and data blocks for modular design',
      'Standardized motor and valve control blocks',
      'Error handling, alarm classes and diagnostic codes',
      'Availability calculations and performance KPIs',
      'Best practices for documentation and versioning',
      'Coding standards and naming conventions for large projects',
      'Introduction to libraries, templates and reusable project structures',
    ],
    examples: [
      'Create a reusable motor control function block with start, stop, fault and reset inputs.',
      'Store all alarm bits and texts in a structured data block for HMI integration.',
      'Calculate machine availability over a week using operating time and downtime.',
      'Refactor a small PLC program into separate modules for safety, motion and diagnostics.',
      'Design a simple alarm code table that can be used both in PLC and HMI/SCADA.',
      'Draw a high-level architecture block diagram showing major PLC program modules and their interfaces.',
      'Prepare a short “programming standard” document for a small team project.',
    ],
    programs: [
      '(* Motor FB instance example *) Motor_01( Start := Start_M1, Stop := Stop_M1, FaultIn := Overload_M1, RunFb => M1_Run, FaultFb => M1_Fault );',
      '(* Availability calculation as comment *) (* Availability := OperatingTime / (OperatingTime + Downtime); *)',
      '(* Simple alarm code mapping example *) IF M1_Fault THEN Alarm_Code := 101; END_IF;',
    ],
    skills: [
      'Designing reusable PLC function blocks and data blocks',
      'Standardizing motor and valve control patterns',
      'Implementing structured error handling and alarm codes',
      'Calculating and interpreting equipment availability KPIs',
      'Organizing PLC projects so that teams can work in parallel',
      'Writing documentation that supports commissioning and long-term maintenance',
    ],
  },
  {
    id: 8,
    title: 'Stage 8 – Industrial Cybersecurity',
    slug: 'stage-8-cyber',
    summary:
      'Protect PLCs, HMIs and industrial networks against cyber threats by applying layered defenses and secure architectures.',
    topics: [
      'Network segmentation (zones and conduits) in OT environments',
      'Firewalls, VPNs and secure remote access to machines',
      'User authentication, role management and logging',
      'Patch management and firmware updates for PLCs and HMIs',
      'Designing secure-by-default automation architectures',
      'Defence-in-depth principles applied to industrial automation',
      'Incident response basics for OT environments and post-incident learning',
    ],
    examples: [
      'Segment a plant network into production, DMZ and office zones and define allowed traffic.',
      'Define password policies and role-based access for operators, maintenance and engineers.',
      'Plan a maintenance window to safely apply firmware updates to PLCs and HMIs.',
      'Draft a simple hardening checklist for a new PLC/HMI installation.',
      'Describe how you would respond if you suspected a PLC program had been modified without authorization.',
      'Draw a simple zone-and-conduit diagram for a small OT network.',
      'List typical security events that should be logged on a PLC/HMI system.',
    ],
    programs: [
      '(* Example log entry generation in PLC *) IF Config_Changed THEN Log_Event := TRUE; Log_Code := 1001; END_IF;',
      '(* Simple lockout based on too many failed login attempts, implemented via HMI/PLC cooperation *)',
      '(* Basic “configuration changed” flag based on checksum comparison – pseudo-code comment only *)',
    ],
    skills: [
      'Segmenting industrial networks into security zones',
      'Defining roles, permissions and password policies',
      'Planning safe firmware and software update strategies',
      'Designing secure-by-default architectures for PLC/HMI systems',
      'Collaborating with cybersecurity specialists and following plant security policies',
      'Thinking in terms of risk, threats and mitigations when designing automation systems',
    ],
  },
]

function RoadmapIllustration({ onStageHover, onStageLeave }) {
  return (
    <svg
      viewBox="0 0 320 140"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Roadmap timeline illustration"
    >
      <defs>
        <linearGradient id="roadmap-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="140" rx="16" fill="url(#roadmap-bg)" />
      <path
        d="M24 80 L296 80"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="2"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
      {[40, 72, 104, 136, 168, 200, 232, 264].map((x, i) => {
        const stage = stages[i]
        if (!stage) return null
        return (
          <g
            key={x}
            onMouseEnter={() => onStageHover && onStageHover(i)}
            onMouseLeave={() => onStageLeave && onStageLeave()}
          >
            <circle cx={x} cy={80} r={10} fill="#020617" stroke="#a5b4fc" strokeWidth="2" />
            <text
              x={x}
              y={84}
              textAnchor="middle"
              fontSize="8"
              fill="#e5e7eb"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            >
              {i + 1}
            </text>
            <title>
              {stage.title} — {stage.summary}
            </title>
          </g>
        )
      })}
    </svg>
  )
}

function StagesIllustration() {
  return (
    <svg
      viewBox="0 0 320 160"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Grouped learning stages illustration"
    >
      <defs>
        <linearGradient id="stages-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="60%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="160" rx="18" fill="url(#stages-bg)" />
      {[0, 1, 2].map((row) => {
        const y = 30 + row * 40
        const color = row === 0 ? '#22c55e' : row === 1 ? '#38bdf8' : '#f97316'
        const title =
          row === 0 ? 'Stages 1–3' : row === 1 ? 'Stages 4–6' : 'Stages 7–8'
        const subtitle =
          row === 0
            ? 'Foundations & safety'
            : row === 1
              ? 'Control, HMI & networks'
              : 'Advanced, diagnostics, security'
        return (
          <g key={row} transform={`translate(28, ${y})`}>
            <rect x="0" y="0" width="92" height="26" rx="9" fill="#020617" stroke={color} />
            <text
              x="46"
              y="12"
              textAnchor="middle"
              fontSize="9"
              fill={color}
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            >
              {title}
            </text>
            <rect
              x="108"
              y="0"
              width="156"
              height="26"
              rx="9"
              fill="#020617"
              stroke="#1f2937"
            />
            <text
              x="186"
              y="12"
              textAnchor="middle"
              fontSize="8"
              fill="#e5e7eb"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            >
              {subtitle}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function ExercisesIllustration() {
  return (
    <svg
      viewBox="0 0 320 160"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Exercises and checklists illustration"
    >
      <defs>
        <linearGradient id="exercises-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#020617" />
          <stop offset="60%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="160" rx="18" fill="url(#exercises-bg)" />

      {/* Left: checklist of tasks */}
      <rect x="26" y="26" width="132" height="104" rx="10" fill="#020617" stroke="#1f2937" />
      <rect x="36" y="36" width="76" height="10" rx="5" fill="#0f172a" />
      {[0, 1, 2].map((i) => {
        const y = 62 + i * 22
        const color = ['#22c55e', '#eab308', '#38bdf8'][i]
        return (
          <g key={i}>
            <rect x="36" y={y - 7} width="14" height="14" rx="4" fill="#020617" stroke={color} />
            <polyline
              points={`${39},${y} ${43},${y + 3} ${49},${y - 4}`}
              fill="none"
              stroke={color}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="56" y={y - 6} width="90" height="10" rx="5" fill="#0f172a" />
          </g>
        )
      })}

      {/* Right top: ladder logic / PLC snippet */}
      <rect x="176" y="28" width="116" height="54" rx="12" fill="#020617" stroke="#1f2937" />
      <line x1="188" y1="42" x2="274" y2="42" stroke="#38bdf8" strokeWidth="2" />
      <rect x="202" y="36" width="32" height="12" rx="6" fill="#0f172a" stroke="#22c55e" />
      <line x1="188" y1="60" x2="274" y2="60" stroke="#38bdf8" strokeWidth="2" />
      <rect x="198" y="54" width="24" height="12" rx="6" fill="#0f172a" stroke="#eab308" />
      <rect x="230" y="54" width="24" height="12" rx="6" fill="#0f172a" stroke="#eab308" />
      <circle cx="284" cy="51" r="9" stroke="#38bdf8" strokeWidth="2" fill="#020617" />

      {/* Right bottom: progress / practice streak */}
      <rect x="176" y="94" width="116" height="44" rx="12" fill="#020617" stroke="#1f2937" />
      <rect x="186" y="104" width="40" height="8" rx="4" fill="#1e293b" />
      <rect x="186" y="118" width="72" height="8" rx="4" fill="#1e293b" />
      <rect x="186" y="118" width="46" height="8" rx="4" fill="#22c55e" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={246 + i * 12} cy={106} r="3" fill={i < 2 ? '#22c55e' : '#4b5563'} />
      ))}
    </svg>
  )
}

const ASSET_BASE = import.meta.env.BASE_URL ?? '/'

const projectVideos = [
  {
    id: 'requirements',
    title: 'Project 1 – Requirements & Specifications',
    file: `${ASSET_BASE}videos/requirements.mp4`,
    duration: '~5 min',
    description:
      'Follow a real example of gathering information from a customer, capturing process details and safety constraints, and turning this into a structured automation brief.',
  },
  {
    id: 'io-architecture',
    title: 'Project 2 – I/O List & Control Architecture',
    file: `${ASSET_BASE}videos/io-architecture.mp4`,
    duration: '~6 min',
    description:
      'See how to transform requirements into a complete I/O list, choose PLC hardware and design a robust control architecture for a small automation cell.',
  },
  {
    id: 'plc-hmi',
    title: 'Project 3 – PLC Program & HMI/SCADA',
    file: `${ASSET_BASE}videos/plc-hmi.mp4`,
    duration: '~7 min',
    description:
      'Watch a full walkthrough of implementing PLC logic, structuring code into reusable blocks, and building HMI and SCADA screens that match the project requirements.',
  },
  {
    id: 'testing-commissioning',
    title: 'Project 4 – Testing, Commissioning & Maintenance',
    file: `${ASSET_BASE}videos/testing-commissioning.mp4`,
    duration: '~6 min',
    description:
      'Follow the complete testing and commissioning sequence, from offline simulation to on-site startup, and see how to set up diagnostics and KPIs for long-term reliability.',
  },
]

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 320 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Stylized PLC control panel illustration"
    >
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#6366f1" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="200" fill="url(#hero-bg)" rx="18" />
      <rect x="22" y="26" width="276" height="120" rx="10" fill="#020617" stroke="#1f2937" />
      <rect x="36" y="40" width="70" height="96" rx="6" fill="#0b1120" stroke="#38bdf8" />
      <rect x="50" y="52" width="42" height="10" rx="3" fill="#22c55e" />
      <rect x="50" y="70" width="42" height="10" rx="3" fill="#eab308" />
      <rect x="50" y="88" width="42" height="10" rx="3" fill="#f97316" />
      <rect x="50" y="106" width="42" height="10" rx="3" fill="#ef4444" />
      <rect x="124" y="40" width="70" height="96" rx="6" fill="#020617" stroke="#4f46e5" />
      <circle cx="140" cy="60" r="6" fill="#22c55e" />
      <circle cx="162" cy="60" r="6" fill="#f97316" />
      <circle cx="184" cy="60" r="6" fill="#ef4444" />
      <rect x="138" y="78" width="40" height="6" rx="3" fill="#38bdf8" />
      <rect x="138" y="92" width="40" height="6" rx="3" fill="#e5e7eb" opacity="0.6" />
      <rect x="138" y="106" width="28" height="6" rx="3" fill="#e5e7eb" opacity="0.4" />
      <rect x="212" y="40" width="70" height="96" rx="6" fill="#020617" stroke="#22c55e" />
      <rect x="224" y="52" width="46" height="8" rx="4" fill="#22c55e" opacity="0.7" />
      <rect x="224" y="68" width="46" height="8" rx="4" fill="#22c55e" opacity="0.5" />
      <rect x="224" y="84" width="46" height="8" rx="4" fill="#22c55e" opacity="0.3" />
      <polyline
        points="40,160 80,140 140,150 190,132 240,138 282,124"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="80" cy="140" r="3" fill="#38bdf8" />
      <circle cx="140" cy="150" r="3" fill="#38bdf8" />
      <circle cx="190" cy="132" r="3" fill="#38bdf8" />
      <circle cx="240" cy="138" r="3" fill="#38bdf8" />
    </svg>
  )
}

function LadderIllustration() {
  return (
    <svg
      viewBox="0 0 320 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Stylized ladder logic diagram"
    >
      <rect x="0" y="0" width="320" height="200" rx="18" fill="#020617" />
      <rect x="16" y="20" width="288" height="160" rx="12" fill="#020617" stroke="#1e293b" />
      <line x1="70" y1="40" x2="70" y2="160" stroke="#e5e7eb" strokeWidth="3" />
      <line x1="250" y1="40" x2="250" y2="160" stroke="#e5e7eb" strokeWidth="3" />
      <line x1="70" y1="60" x2="250" y2="60" stroke="#38bdf8" strokeWidth="2.5" />
      <rect x="105" y="52" width="50" height="16" rx="8" fill="#0f172a" stroke="#38bdf8" />
      <line x1="70" y1="95" x2="250" y2="95" stroke="#38bdf8" strokeWidth="2.5" />
      <rect x="92" y="87" width="40" height="16" rx="8" fill="#0f172a" stroke="#22c55e" />
      <rect x="142" y="87" width="40" height="16" rx="8" fill="#0f172a" stroke="#22c55e" />
      <line x1="70" y1="130" x2="250" y2="130" stroke="#38bdf8" strokeWidth="2.5" />
      <rect x="110" y="122" width="40" height="16" rx="8" fill="#0f172a" stroke="#facc15" />
      <circle cx="260" cy="95" r="14" stroke="#38bdf8" strokeWidth="3" fill="#020617" />
      <path d="M254 95h12" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
      <rect x="190" y="52" width="44" height="16" rx="4" fill="#0f172a" stroke="#e5e7eb" />
      <rect x="190" y="122" width="44" height="16" rx="4" fill="#0f172a" stroke="#e5e7eb" />
    </svg>
  )
}

function QuizIllustration() {
  return (
    <svg
      viewBox="0 0 320 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Quiz and checklist illustration"
    >
      <rect x="0" y="0" width="320" height="200" rx="18" fill="#020617" />
      <rect x="40" y="28" width="240" height="144" rx="16" fill="#020617" stroke="#1f2937" />
      <rect x="62" y="44" width="196" height="20" rx="10" fill="#0f172a" />
      <rect x="70" y="50" width="56" height="8" rx="4" fill="#38bdf8" />
      <circle cx="196" cy="54" r="3" fill="#22c55e" />
      <circle cx="206" cy="54" r="3" fill="#eab308" />
      <circle cx="216" cy="54" r="3" fill="#ef4444" />
      {[
        { y: 80, color: '#22c55e' },
        { y: 108, color: '#eab308' },
        { y: 136, color: '#38bdf8' },
      ].map(({ y, color }) => (
        <g key={y}>
          <rect x="64" y={y - 8} width="16" height="16" rx="4" fill="#020617" stroke={color} />
          <polyline
            points={`${68},${y} ${72},${y + 4} ${78},${y - 4}`}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="90" y={y - 5} width="140" height="10" rx="5" fill="#1f2937" />
          <rect x="90" y={y - 5} width="80" height="10" rx="5" fill={color} opacity="0.7" />
        </g>
      ))}
    </svg>
  )
}

function LibraryIllustration() {
  return (
    <svg
      viewBox="0 0 320 160"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Bookshelf of automation books"
    >
      <rect x="0" y="0" width="320" height="160" rx="16" fill="#020617" />
      <rect x="20" y="30" width="280" height="100" rx="10" fill="#020617" stroke="#1f2937" />
      <rect x="40" y="50" width="22" height="70" rx="3" fill="#38bdf8" />
      <rect x="68" y="46" width="22" height="74" rx="3" fill="#6366f1" />
      <rect x="96" y="52" width="22" height="68" rx="3" fill="#22c55e" />
      <rect x="124" y="48" width="22" height="72" rx="3" fill="#f97316" />
      <rect x="152" y="54" width="22" height="66" rx="3" fill="#eab308" />
      <rect x="190" y="52" width="32" height="68" rx="4" fill="#0f172a" stroke="#38bdf8" />
      <rect x="230" y="52" width="32" height="68" rx="4" fill="#0f172a" stroke="#22c55e" />
      <rect x="190" y="60" width="24" height="6" rx="3" fill="#38bdf8" />
      <rect x="190" y="72" width="20" height="6" rx="3" fill="#e5e7eb" opacity="0.7" />
      <rect x="230" y="60" width="24" height="6" rx="3" fill="#22c55e" />
      <rect x="230" y="72" width="20" height="6" rx="3" fill="#e5e7eb" opacity="0.7" />
    </svg>
  )
}

function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo">PLC</span>
          <div className="app-brand-text">
            <span className="app-brand-title">PLC Programming Hub</span>
            <span className="app-brand-subtitle">From Beginner to Pro</span>
          </div>
      </div>
        <nav className="app-nav">
          <NavLink to="/" end className="nav-link">
            Overview
          </NavLink>
          <NavLink to="/roadmap" className="nav-link">
            Roadmap
          </NavLink>
          <NavLink to="/stages" className="nav-link">
            Stages
          </NavLink>
          <NavLink to="/exercises" className="nav-link">
            Exercises
          </NavLink>
          <NavLink to="/library" className="nav-link">
            Library
          </NavLink>
          <NavLink to="/projects" className="nav-link">
            Real Projects
          </NavLink>
        </nav>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <p>
          Based on the PLC Programming Hub roadmap – Industrial Automation learning path. © 2023
          All Rights Lucas Ghigli
        </p>
      </footer>
    </div>
  )
}

function HomePage() {
  return (
    <Layout>
      <section className="hero">
        <div className="hero-text">
          <p className="hero-kicker">Industrial Automation Learning Path</p>
          <h1>Become a Professional PLC Engineer</h1>
          <p>
            A structured roadmap from electrical basics all the way to advanced PLC, HMI, SCADA,
            networking, motion control and cybersecurity. Designed for students, technicians and
            engineers who want hands-on industrial automation skills.
          </p>
          <div className="hero-actions">
            <NavLink to="/roadmap" className="btn btn-primary">
              View Learning Roadmap
            </NavLink>
            <NavLink to="/stages" className="btn btn-outline">
              Explore Stages
            </NavLink>
          </div>
        </div>
        <div className="hero-highlight">
          <div className="hero-image">
            <HeroIllustration />
          </div>
          <div className="hero-metric">
            <span className="hero-metric-label">Learning Path</span>
            <span className="hero-metric-value">{stages.length} Stages</span>
          </div>
          <div className="hero-metric">
            <span className="hero-metric-label">Focus Areas</span>
            <span className="hero-metric-value">PLC • HMI • SCADA • Networking • Motion</span>
          </div>
          <div className="hero-note">
            From foundational theory to real-world project workflows: requirements, I/O lists,
            programming, commissioning and maintenance.
          </div>
        </div>
      </section>

      <section className="section">
        <h2>What You Will Master</h2>
        <div className="grid grid-3">
          <article className="feature-card">
            <h3>Industrial Electrical & Safety</h3>
            <p>
              Understand how real automation panels are powered, protected and wired. Learn to read
              schematics, size components and work safely.
            </p>
            <ul>
              <li>Ohm’s law and industrial DC/AC power</li>
              <li>Sensors, actuators and control circuits</li>
              <li>Lockout/tagout, grounding and protections</li>
            </ul>
          </article>
          <article className="feature-card">
            <h3>PLC Programming & HMI/SCADA</h3>
            <p>
              Write reliable PLC programs, design intuitive HMIs and connect everything through
              robust industrial communication.
            </p>
            <ul>
              <li>Ladder, Structured Text and FBD basics</li>
              <li>HMI navigation, alarms and trends</li>
              <li>SCADA and data logging principles</li>
            </ul>
          </article>
          <article className="feature-card">
            <h3>Advanced Automation Skills</h3>
            <p>
              Move into advanced motion, PID, diagnostics and cybersecurity to build systems that
              are fast, safe and maintainable.
            </p>
            <ul>
              <li>VFDs, servo systems and feedback</li>
              <li>PID control strategies and tuning concepts</li>
              <li>Network segmentation and OT security</li>
            </ul>
          </article>
          <article className="feature-card">
            <h3>Real Projects & Career</h3>
            <p>
              Learn how to combine all of these skills into complete industrial projects, from the
              first requirements meeting to commissioning and ongoing optimization.
            </p>
            <ul>
              <li>Translating customer needs into technical solutions</li>
              <li>Building clear documentation, I/O lists and test plans</li>
              <li>Developing a portfolio of PLC, HMI and SCADA projects</li>
            </ul>
          </article>
        </div>
      </section>
      <section className="section section-alt">
        <h2>Visualize Real PLC Logic</h2>
        <div className="stage-visual-grid">
          <div className="stage-visual-card">
            <LadderIllustration />
            <p>
              Ladder diagrams make control logic intuitive for electricians and technicians. Use this
              hub alongside your PLC software to reproduce and experiment with rungs.
            </p>
          </div>
          <div className="stage-visual-card">
            <QuizIllustration />
            <p>
              Test your understanding with exercises and quizzes that cover everything from electrical
              basics to complex PID and motion scenarios.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}

function RoadmapPage() {
  const [hoveredStageIndex, setHoveredStageIndex] = useState(null)
  const hoveredStage =
    typeof hoveredStageIndex === 'number' && stages[hoveredStageIndex] ? stages[hoveredStageIndex] : null

  return (
    <Layout>
      <section className="section">
        <h1>PLC Engineer Roadmap – From Beginner to Pro</h1>
        <p className="section-intro">
          This roadmap is built directly from the PLC Programming Hub documents. Progress through
          each stage in order, reinforcing fundamentals before moving into more advanced topics.
        </p>
        <div className="section-illustration">
          <RoadmapIllustration
            onStageHover={(index) => setHoveredStageIndex(index)}
            onStageLeave={() => setHoveredStageIndex(null)}
          />
        </div>
        <div className="roadmap-hover-info">
          {hoveredStage ? (
            <>
              <h2>
                Stage {hoveredStageIndex + 1}: {hoveredStage.title}
              </h2>
              <p>{hoveredStage.summary}</p>
            </>
          ) : (
            <p>Move your cursor over the roadmap numbers to see what each stage is about.</p>
          )}
        </div>
        <ol className="roadmap-list">
          {stages.map((stage, index) => (
            <li key={stage.id} className="roadmap-item">
              <div className="roadmap-index">Stage {index + 1}</div>
              <div className="roadmap-content">
                <h2>{stage.title}</h2>
                <p>{stage.summary}</p>
                <NavLink to={`/stages/${stage.slug}`} className="link-inline">
                  View detailed curriculum →
                </NavLink>
      </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section section-alt">
        <h2>From Theory to Real Projects</h2>
        <p className="section-intro">
          The roadmap ends with real project clarification: analyzing customer requirements,
          designing I/O lists, developing and testing PLC logic, configuring HMI/SCADA and
          commissioning the system.
        </p>
        <div className="section-cta-center">
          <NavLink to="/projects" className="btn btn-outline">
            See project workflow
          </NavLink>
        </div>
      </section>
    </Layout>
  )
}

function StagesOverviewPage() {
  return (
    <Layout>
      <section className="section">
        <h1>Stages Overview</h1>
        <p className="section-intro">
          Choose a stage to dive into a focused set of topics. Each stage summarizes the key
          content from the PLC Programming Hub PDFs.
        </p>
        <div className="section-illustration">
          <StagesIllustration />
        </div>
        <div className="grid grid-3">
          {stages.map((stage) => (
            <article key={stage.id} className="stage-card">
              <div className="stage-card-header">
                <h2>{stage.title}</h2>
                <p className="stage-card-summary">{stage.summary}</p>
              </div>
              <div className="stage-card-body">
                <div className="stage-card-skills">
                  <span>Skills you will gain:</span>
                  <ul>
                    {(stage.skills || []).slice(0, 4).map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div className="stage-card-topics">
                  <span>Key topics:</span>
                  <ul>
                    {stage.topics.slice(0, 3).map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="stage-card-footer">
                <NavLink to={`/stages/${stage.slug}`} className="btn btn-small btn-primary">
                  View details
                </NavLink>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  )
}

function StageDetailPage() {
  const { slug } = useParams()
  const currentIndex = stages.findIndex((s) => s.slug === slug)
  const stage = currentIndex >= 0 ? stages[currentIndex] : null
  const nextStage = currentIndex >= 0 && currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  if (!stage) {
    return (
      <Layout>
        <section className="section">
          <h1>Stage not found</h1>
          <p>We couldn&apos;t find this stage. Please go back to the stages overview.</p>
          <NavLink to="/stages" className="btn btn-primary">
            Back to Stages
          </NavLink>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="section">
        <h1>{stage.title}</h1>
        <p className="section-intro">{stage.summary}</p>
        <div className="stage-detail-layout">
          <div className="stage-detail-main">
            <h2>Key Topics</h2>
            <ul className="stage-topics">
              {stage.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>

            {stage.examples && stage.examples.length > 0 && (
              <>
                <h2 className="stage-subheading">Practical Examples</h2>
                <ul className="stage-topics">
                  {stage.examples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
              </>
            )}

            {stage.programs && stage.programs.length > 0 && (
              <>
                <h2 className="stage-subheading">Sample PLC Programs</h2>
                <div className="stage-code-list">
                  {stage.programs.map((program, index) => (
                    <pre key={index} className="stage-code">
                      <code>{program}</code>
                    </pre>
                  ))}
                </div>
              </>
            )}
          </div>
          <aside className="stage-detail-side">
            <h3>How to Study This Stage</h3>
            <ul>
              <li>Start with the theory document and highlight key formulas and diagrams.</li>
              <li>Recreate the examples in your preferred PLC or HMI software.</li>
              <li>Summarize each topic as if you had to explain it to a junior technician.</li>
              <li>Implement at least one of the sample PLC programs on a simulator or training kit.</li>
            </ul>
            <p className="stage-detail-note">
              Once you are comfortable with all topics and examples in this stage, move to the next
              one in the roadmap to keep building your skills step by step.
            </p>
          </aside>
        </div>
        {nextStage && (
          <div className="section-cta-center">
            <NavLink to={`/stages/${nextStage.slug}`} className="btn btn-primary">
              Go to Stage {currentIndex + 2}
            </NavLink>
          </div>
        )}
      </section>
    </Layout>
  )
}

function ExercisesPage() {
  return (
    <Layout>
      <section className="section">
        <h1>Exercises & Practice Scenarios</h1>
        <p className="section-intro">
          Apply what you have learned with progressive exercises. Start with simple logic and finish
          with multi-stage automation projects.
        </p>
        <div className="section-illustration">
          <ExercisesIllustration />
        </div>
        <div className="exercises-grid">
          <article className="stage-card exercises-card">
            <header className="exercises-card-header">
              <div className="exercises-pill">Field fundamentals</div>
              <h2>Electrical & Sensor Basics</h2>
              <p className="exercises-card-summary">
                Practice the kind of checks and small modifications you will perform every day on a
                plant floor.
              </p>
            </header>
            <ul>
              <li>
                Calculate current, voltage or resistance using Ohm’s law in sample circuits, then
                check your results against a multimeter reading on a real or simulated panel.
              </li>
              <li>
                Identify correct wiring for NO/NC sensors into PLC inputs on a machine drawing, then
                label each I/O point with the address and expected field device.
              </li>
              <li>
                Design a simple start/stop circuit with interlocks for a small conveyor, including
                an E‑Stop circuit and a maintenance mode, and draw the wiring diagram as you would
                for an electrician.
              </li>
            </ul>
          </article>
          <article className="stage-card exercises-card">
            <header className="exercises-card-header">
              <div className="exercises-pill">Logic in practice</div>
              <h2>PLC Logic & Timers</h2>
              <p className="exercises-card-summary">
                Build small, realistic sequences that mirror how machines actually start, run and
                stop.
              </p>
            </header>
            <ul>
              <li>
                Create a conveyor start sequence using TON timers and interlocks that mimics a real
                packaging line (e.g. start main conveyor, then feeder conveyor, then diverter).
              </li>
              <li>
                Build a piece counter with total and batch counts using CTU for a filling station,
                and generate an alarm when the batch target is not reached in time.
              </li>
              <li>
                Implement a fault latch and reset using set/reset logic for a motor with overload
                and guard-door interlocks, as you would in a factory safety scenario.
              </li>
            </ul>
          </article>
          <article className="stage-card exercises-card">
            <header className="exercises-card-header">
              <div className="exercises-pill">Operator view</div>
              <h2>HMI, SCADA & Networking</h2>
              <p className="exercises-card-summary">
                Design screens and small networks the way a controls engineer would for a new cell.
              </p>
            </header>
            <ul>
              <li>
                Design an HMI overview screen for a bottling line with navigation, alarm banner and
                production KPIs that an operator would use during a shift.
              </li>
              <li>
                Map PLC tags to HMI objects and test read/write operations for a start/stop station,
                including status lamps and a maintenance bypass switch.
              </li>
              <li>
                Define an IP addressing scheme for a small automation cell with one PLC, two HMIs, a
                drive and a SCADA server, and sketch the network layout as if presenting it to IT.
              </li>
            </ul>
          </article>
          <article className="stage-card exercises-card">
            <header className="exercises-card-header">
              <div className="exercises-pill">On‑call reality</div>
              <h2>Troubleshooting & Diagnostics</h2>
              <p className="exercises-card-summary">
                Recreate realistic fault-finding sessions and capture how you communicate findings.
              </p>
            </header>
            <ul>
              <li>
                Trace why a motor or valve does not start on a simulated production line, using
                online monitoring, forcing and diagnostic bits exactly as you would during a plant
                call‑out.
              </li>
              <li>
                Systematically test sensors and cabling with multimeters and status bits on a
                troubleshooting worksheet, recording symptoms, tests performed and conclusions.
              </li>
              <li>
                Create a simple fault log to record and review common issues (time, equipment,
                cause, fix) and use it to propose one improvement to reduce repeat failures.
              </li>
            </ul>
          </article>
        </div>
      </section>
      <section className="section section-alt">
        <h2>How to Turn Exercises into Portfolio Pieces</h2>
        <div className="exercises-routine">
          <ol>
            <li>
              <span>Pick one scenario and one real or simulated platform.</span>
            </li>
            <li>
              <span>Implement the logic, wiring or HMI exactly as you would for a customer.</span>
            </li>
            <li>
              <span>Capture screenshots, ladder prints or photos of your setup.</span>
            </li>
            <li>
              <span>Write a short one‑page summary: objective, solution, tests and lessons learned.</span>
            </li>
            <li>
              <span>Repeat and group 2–3 mini‑projects into a single, professional case study.</span>
            </li>
          </ol>
        </div>
      </section>
    </Layout>
  )
}

function LibraryPage() {
  return (
    <Layout>
      <section className="section">
        <h1>PLC & Automation Library</h1>
        <p className="section-intro">
          A curated collection of learning resources related to PLCs, HMIs, SCADA, industrial
          networking, motion control and cybersecurity.
        </p>
        <div className="library-layout">
          <div className="library-hero">
            <LibraryIllustration />
            <div className="library-hero-meta">
              <span className="library-pill">Reference hub</span>
              <p>Use these documents alongside the roadmap to go deeper on specific topics.</p>
            </div>
          </div>
          <div className="library-grid">
            <article className="library-card">
              <h2>Core PLC & Electrical</h2>
              <p className="library-card-summary">
                Foundations you will reference again and again when designing or reviewing systems.
              </p>
              <ul>
                <li>
                  <span>Industrial Automation Fundamentals – Electrical Basics and Components (PDF)</span>
                  <a
                    href={`${ASSET_BASE}Stage 1 - Industrial_Automation_Electrical_Basics.pdf`}
                    className="btn btn-small btn-outline library-download"
                    download
                  >
                    Download
                  </a>
                </li>
                <li>
                  <span>PLC Automation Fundamentals – Hardware, Programming and Troubleshooting (PDF)</span>
                  <a
                    href={`${ASSET_BASE}Stage 2 - PLC_Automation_Fundamentals.pdf`}
                    className="btn btn-small btn-outline library-download"
                    download
                  >
                    Download
                  </a>
                </li>
                <li>
                  <span>PLC Roadmap – From Beginner to Pro (PDF)</span>
                  <a
                    href={`${ASSET_BASE}PLC_Roadmap_Beginner_to_Pro.pdf`}
                    className="btn btn-small btn-outline library-download"
                    download
                  >
                    Download
                  </a>
                </li>
              </ul>
            </article>
            <article className="library-card">
              <h2>HMI, SCADA & Communication</h2>
              <p className="library-card-summary">
                Resources to design clear operator interfaces and robust communication architectures.
              </p>
              <ul>
                <li>
                  <span>HMI, PLC and SCADA Fundamentals for Industrial Automation (PDF)</span>
                  <a
                    href={`${ASSET_BASE}Stage 3 - HMI_PLC_SCADA_Fundamentals.pdf`}
                    className="btn btn-small btn-outline library-download"
                    download
                  >
                    Download
                  </a>
                </li>
                <li>
                  <span>Industrial Communication Systems for Automation (PDF)</span>
                  <a
                    href={`${ASSET_BASE}Stage 4 - Industrial_Communication_Fieldbus_Ethernet.pdf`}
                    className="btn btn-small btn-outline library-download"
                    download
                  >
                    Download
                  </a>
                </li>
                <li>Vendor manuals for your specific PLC/HMI platform</li>
              </ul>
            </article>
            <article className="library-card">
              <h2>Advanced Topics & Security</h2>
              <p className="library-card-summary">
                Go beyond basics with motion, PID, cybersecurity and performance case studies.
              </p>
              <ul>
                <li>
                  <span>Advanced Automation Fundamentals: Motion Control, PID and Cybersecurity (PDF)</span>
                  <a
                    href={`${ASSET_BASE}Stage 5 - Motion_Control_PID_Programming_Cybersecurity.pdf`}
                    className="btn btn-small btn-outline library-download"
                    download
                  >
                    Download
                  </a>
                </li>
                <li>Standards and best practices for industrial cybersecurity</li>
                <li>Case studies on plant optimization and availability improvement</li>
              </ul>
            </article>
            <article className="library-card">
              <h2>Standards, Safety & Best Practice</h2>
              <p className="library-card-summary">
                Formal guidance that underpins safe, compliant and maintainable automation projects.
              </p>
              <ul>
                <li>Collections of IEC/EN standards relevant to machinery and PLC safety.</li>
                <li>Guides on risk assessment, SIL/PL and safety lifecycle concepts.</li>
                <li>Recommended vendor application notes and example projects.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>
      <section className="section">
        <h2>Suggested Study Routine</h2>
        <p className="section-intro">
          Combine the documents in this library with the stages and exercises. Read, implement,
          measure and iterate — that&apos;s how you build real expertise.
        </p>
      </section>
    </Layout>
  )
}

function ProjectsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <Layout>
      <section className="section">
        <h1>Real Project Workflow</h1>
        <p className="section-intro">
          The final objective of the roadmap is to prepare you for real industrial automation
          projects, from the first customer meeting to long-term maintenance.
        </p>
        <div className="project-flow">
          <div className="project-step">
            <h2>1. Requirements & Specifications</h2>
            <p>
              Analyze customer requirements, process descriptions and safety constraints. Clarify
              signals, cycles, alarms and performance expectations.
            </p>
            <p>
              At this stage you practice turning informal conversations, P&amp;IDs or machine sketches
              into a clear written specification that an automation team can execute and a customer
              can sign off.
            </p>
          </div>
          <div className="project-step">
            <h2>2. I/O List & Control Architecture</h2>
            <p>
              Build a detailed I/O list, define hardware (PLCs, I/O cards, drives, HMIs) and choose
              the right communication networks.
            </p>
            <p>
              You learn to think systematically about every signal in the plant, how it is grouped
              into panels and networks, and which hardware and topology best support future
              expansion and maintenance.
            </p>
          </div>
          <div className="project-step">
            <h2>3. PLC Program & HMI/SCADA</h2>
            <p>
              Develop structured PLC code, reusable function blocks and intuitive HMI/SCADA screens
              with alarms, trends and diagnostics.
            </p>
            <p>
              Here the focus is on writing readable logic, exposing the right diagnostics and giving
              operators clear, safe controls so that day‑to‑day production runs smoothly.
            </p>
          </div>
          <div className="project-step">
            <h2>4. Testing, Commissioning & Maintenance</h2>
            <p>
              Test logic offline, then commission on site. Document the system, train operators and
              implement diagnostics to support long-term operation.
            </p>
            <p>
              You learn how to plan tests, manage changes during start‑up and leave behind
              documentation and tools that make future troubleshooting and improvements efficient.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Project Walkthrough Videos</h2>
        <p className="section-intro">
          Watch these short walkthroughs to see how the complete automation workflow comes together,
          from the first requirement to final commissioning.
        </p>
        <div className="project-videos-grid">
          {projectVideos.map((video) => (
            <article key={video.id} className="project-video-card">
              <div className="project-video-header">
                <h3>{video.title}</h3>
                <span className="project-video-duration">{video.duration}</span>
              </div>
              <p className="project-video-description">{video.description}</p>
              <div className="project-video-wrapper">
                <video
                  className="project-video"
                  controls
                  preload="metadata"
                  src={video.file}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="cta-ready">
          <h2>Ready to Start?</h2>
          <p className="cta-ready-text">
            Begin with Stage 1 and progress at your own pace. Use this hub as a companion while you
            move from fundamentals to advanced PLC, HMI and SCADA projects.
          </p>
          <ul className="cta-ready-list">
            <li>Stage 1: build your electrical and automation foundation.</li>
            <li>Stages 2–4: master PLC programming, HMI/SCADA and communication.</li>
            <li>Stages 5–8: grow into motion, PID, diagnostics and cybersecurity.</li>
          </ul>
          <div className="cta-ready-actions">
            <NavLink to="/stages/stage-1" className="btn btn-primary">
              Start with Stage 1
            </NavLink>
          </div>
        </div>
      </section>
    </Layout>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/roadmap" element={<RoadmapPage />} />
      <Route path="/stages" element={<StagesOverviewPage />} />
      <Route path="/stages/:slug" element={<StageDetailPage />} />
      <Route path="/exercises" element={<ExercisesPage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route
        path="*"
        element={
          <Layout>
            <section className="section">
              <h1>Page not found</h1>
              <p>The page you are looking for does not exist.</p>
              <NavLink to="/" className="btn btn-primary">
                Back to overview
              </NavLink>
            </section>
          </Layout>
        }
      />
    </Routes>
  )
}

export default App
