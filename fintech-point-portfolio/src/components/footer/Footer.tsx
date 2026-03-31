import { Code, X, MapPin } from 'lucide-react';
import { apiService } from '../../Service/api';
import { useSettings } from '../../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  const handleEngagement = (action: string) => {
    try {
      apiService.post('/api/stats/engage', { action });
    } catch(e) {}
  };

  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-secondary hover:text-white transition-colors">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-sm">{settings.contactAddress}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href={settings.socialLinkedin || '#'} onClick={() => handleEngagement('footer_linkedin')} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors">
              <X className="w-6 h-6" />
            </a>
            <a href={settings.socialGithub || '#'} onClick={() => handleEngagement('footer_github')} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors">
              <Code className="w-6 h-6" />
            </a>
          </div>
          
          <p className="text-secondary text-sm">
            © {new Date().getFullYear()} {settings.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
