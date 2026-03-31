import { Project, Capability } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'LocalLink',
    category: 'Web Applications',
    techStack: ['Laravel', 'React', 'MySQL'],
    description: 'A comprehensive local services marketplace connecting users with verified professionals.',
    image: 'https://picsum.photos/seed/locallink/600/400',
    githubUrl: 'https://github.com/fintechpoint/locallink',
    externalUrl: 'https://locallink.example.com'
  },
  {
    id: '2',
    title: 'SANAD',
    category: 'Web Applications',
    techStack: ['Next.js', 'Tailwind', 'Firebase'],
    description: 'An innovative platform for social welfare and community support management.',
    image: 'https://picsum.photos/seed/sanad/600/400',
    githubUrl: 'https://github.com/fintechpoint/sanad',
    externalUrl: 'https://sanad.example.com'
  },
  {
    id: '3',
    title: 'Fintech Point POS',
    category: 'Web Applications',
    techStack: ['PHP', 'React', 'IoT'],
    description: 'A robust Point of Sale system integrated with biometric authentication and real-time analytics.',
    image: 'https://picsum.photos/seed/pos/600/400',
    githubUrl: 'https://github.com/fintechpoint/pos',
    externalUrl: 'https://pos.fintechpoint.com'
  },
  {
    id: '4',
    title: 'SecurePay Mobile',
    category: 'Mobile Apps',
    techStack: ['React Native', 'Node.js', 'MongoDB'],
    description: 'A secure mobile wallet application for seamless cross-border transactions.',
    image: 'https://picsum.photos/seed/securepay/600/400',
    githubUrl: 'https://github.com/fintechpoint/securepay',
    externalUrl: 'https://securepay.example.com'
  },
  {
    id: '5',
    title: 'HealthTrack App',
    category: 'Mobile Apps',
    techStack: ['React Native', 'Firebase', 'HealthKit'],
    description: 'Personalized health monitoring app with real-time data synchronization.',
    image: 'https://picsum.photos/seed/healthtrack/600/400',
    githubUrl: 'https://github.com/fintechpoint/healthtrack',
    externalUrl: 'https://healthtrack.example.com'
  },
  {
    id: '6',
    title: 'AgriTech Dashboard',
    category: 'Web Applications',
    techStack: ['Laravel', 'Vue.js', 'IoT'],
    description: 'Smart farming dashboard for monitoring soil health and automated irrigation.',
    image: 'https://picsum.photos/seed/agritech/600/400',
    githubUrl: 'https://github.com/fintechpoint/agritech',
    externalUrl: 'https://agritech.example.com'
  }
];

export const CAPABILITIES: Capability[] = [
  {
    title: 'SaaS Development',
    description: 'Building scalable, multi-tenant software solutions with modern architectures.',
    icon: 'Layout'
  },
  {
    title: 'Fintech Integrations',
    description: 'Seamless payment gateway integrations and secure financial data processing.',
    icon: 'CreditCard'
  },
  {
    title: 'IoT & Biometrics',
    description: 'Expertise in ZKTeco integration and real-time hardware-software communication.',
    icon: 'Fingerprint'
  }
];
