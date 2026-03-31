import { Github, Linkedin, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-secondary hover:text-white transition-colors">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-sm">Fintech Point, Mymensingh, Bangladesh</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://linkedin.com/company/fintechpoint" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://github.com/fintechpoint" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors">
              <Github className="w-6 h-6" />
            </a>
          </div>
          
          <p className="text-secondary text-sm">
            © {new Date().getFullYear()} Fintech Point. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
