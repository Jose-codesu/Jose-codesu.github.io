import type { Certification, Education } from './types';

/**
 * Newest first. Add a certificate the day you earn it — an empty `verifyUrl`
 * is fine, the credential ID still renders.
 */
export const certifications: Certification[] = [
  {
    name: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google · Coursera',
    issued: '2025-01-15',
    credentialId: 'L1C473ZFU50D',
    // TODO: paste the Coursera credential URL here to turn the ID into a link.
    verifyUrl: '',
    status: 'completed',
    summary:
      'Eight-course track covering security foundations, networking, Linux and SQL, threat and vulnerability analysis, detection and response, and Python automation for security tasks.',
    courses: [
      'Foundations of Cybersecurity',
      'Play It Safe: Manage Security Risks',
      'Connect and Protect: Networks and Network Security',
      'Tools of the Trade: Linux and SQL',
      'Assets, Threats, and Vulnerabilities',
      'Sound the Alarm: Detection and Response',
      'Automate Cybersecurity Tasks with Python',
      'Put It to Work: Prepare for Cybersecurity Jobs',
    ],
    skills: [
      'Linux command line',
      'SQL',
      'Networking & TCP/IP',
      'SIEM / IDS concepts',
      'Incident response',
      'Python automation',
      'Risk management',
    ],
  },
];

export const education: Education[] = [
  {
    school: 'Miami Dade College',
    credential: 'Bachelor of Science, Applied Artificial Intelligence',
    status: 'in-progress',
    focus: [
      'Machine learning foundations',
      'Python programming',
      'Data structures & algorithms',
      'Applied AI systems',
    ],
  },
  {
    school: 'Miami Dade College',
    credential: 'Associate in Science, Applied Artificial Intelligence',
    status: 'in-progress',
    focus: ['Programming fundamentals', 'Databases & SQL', 'AI concepts'],
  },
];

export const visibleCertifications = certifications.filter((c) => !c.draft);
