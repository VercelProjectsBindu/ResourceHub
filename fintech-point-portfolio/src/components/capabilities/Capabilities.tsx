import React from 'react';
import { motion } from 'motion/react';
import { Layout, CreditCard, Fingerprint } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const ICON_MAP = {
  Layout: Layout,
  CreditCard: CreditCard,
  Fingerprint: Fingerprint,
};

export default function Capabilities() {
  const { settings } = useSettings();
  
  // Safely parse the coreCapabilities array from Context
  const dynamicCapabilities = React.useMemo(() => {
    try {
      const parsed = JSON.parse(settings.coreCapabilities);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
    } catch {
      return [
        { title: 'SaaS Development', description: 'Building scalable solutions.', icon: 'Layout' },
        { title: 'Fintech Integrations', description: 'Integration management.', icon: 'CreditCard' },
        { title: 'IoT & Biometrics', description: 'Hardware communications.', icon: 'Fingerprint' }
      ];
    }
  }, [settings.coreCapabilities]);

  return (
    <section className="py-24 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
          <p className="text-secondary max-w-xl mx-auto">
            Specialized services designed to drive digital transformation in the financial sector.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {dynamicCapabilities.map((cap, index) => {
            const Icon = ICON_MAP[cap.icon as keyof typeof ICON_MAP];
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{cap.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">
                  {cap.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
