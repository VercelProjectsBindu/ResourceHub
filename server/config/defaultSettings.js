const defaultSettings = [
  { key: 'siteName', val: 'Fintech Point' },
  { key: 'logoDisplay', val: 'text' }, // 'text' | 'image'
  { key: 'logoImageUrl', val: '' },
  { key: 'heroTitle', val: 'Building the Future of Digital Finance' },
  { key: 'heroSubtitle', val: 'We specialize in creating robust, scalable, and innovative web applications for businesses aiming to thrive in the modern digital ecosystem.' },
  { key: 'heroPrimaryBtnLabel', val: 'Our Work' },
  { key: 'heroSecondaryBtnLabel', val: 'Contact Us' },
  { key: 'contactAddress', val: 'Fintech Point, Mymensingh, Bangladesh' },
  { key: 'contactEmail', val: 'admin@fintechpoint.com' },
  { key: 'contactPhone', val: '+880 1234 567890' },
  { key: 'socialLinkedin', val: 'https://linkedin.com/company/fintechpoint' },
  { key: 'socialGithub', val: 'https://github.com/fintechpoint' },
  { key: 'socialX', val: 'https://x.com/fintechpoint' },
  { key: 'copyrightText', val: 'Fintech Point. All rights reserved.' },
  { key: 'maintenanceMode', val: 'false' },
  { 
    key: 'coreCapabilities', 
    val: JSON.stringify([
      { id: '1', title: 'SaaS Development', description: 'Building scalable, multi-tenant software solutions with modern architectures.', icon: 'Layout' },
      { id: '2', title: 'Fintech Integrations', description: 'Seamless payment gateway integrations and secure financial data processing.', icon: 'CreditCard' },
      { id: '3', title: 'IoT & Biometrics', description: 'Expertise in ZKTeco integration and real-time hardware-software communication.', icon: 'Fingerprint' }
    ]) 
  }
];

module.exports = defaultSettings;
