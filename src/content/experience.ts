import type { Role } from './types';

/**
 * Current role first. `end: null` renders as "Present".
 * `transfer` is the line that connects the job to engineering — keep it honest
 * and specific; it is the reason a non-linear resume reads as an advantage.
 */
export const roles: Role[] = [
  {
    company: 'Giant Communications LLC — Metro by T-Mobile',
    title: 'Retail Store Manager',
    location: 'Davie, FL',
    start: '2024-07-01',
    end: null,
    points: [
      'Lead daily operations for a mobile technology store: customer experience, sales performance, inventory accuracy, compliance and team execution.',
      'Translate phones, plans, account options and technical issues into language customers actually use, in English and Spanish.',
      'Coach the team on product knowledge, discovery questions and needs-based recommendations against daily goals.',
      'Own inventory controls, loss prevention and cost awareness alongside customer experience metrics.',
    ],
    transfer:
      'Two years of triaging device problems is two years of debugging with a user in the room: reproduce it, isolate what changed, and explain the fix without jargon. That is the same loop as reading a stack trace, with a shorter feedback cycle and a less patient tester.',
  },
  {
    company: 'Cellular Touch Wireless, Inc.',
    title: 'Retail Store Manager',
    location: 'Doral, FL',
    start: '2024-01-01',
    end: '2024-06-30',
    points: [
      'Supervised a three-person team across daily workflow, customer service standards, cash handling, inventory and sales execution.',
      'Identified account, device and service issues from customer descriptions, then resolved or escalated them through the available systems.',
      'Raised team consistency through coaching, follow-up and explicit expectations.',
    ],
  },
  {
    company: 'Cellular Touch Wireless, Inc.',
    title: 'Retail Sales Representative',
    location: 'Florida',
    start: '2023-07-01',
    end: '2023-12-31',
    points: [
      'Met or exceeded monthly goals by matching customers to devices, plans and services based on budget and real usage.',
      'Built trust by explaining device features, troubleshooting common issues and following up after the sale.',
    ],
  },
  {
    company: 'Design and Cabinets',
    title: 'Manager',
    location: 'Hialeah, FL',
    start: '2021-01-01',
    end: '2023-07-31',
    points: [
      'Managed order intake, production coordination, pricing estimates, client communication and work assignment across a team.',
      'Operated CNC and thermofoil machines, checked quality and supported production troubleshooting.',
      'Maintained the Excel systems tracking orders, inventory and production status.',
    ],
    transfer:
      'CNC work is programming with expensive undo: the tolerances are physical, the spec has to be exact before the machine moves, and a wrong assumption costs material. It is where the habit of specifying before executing came from.',
  },
];
