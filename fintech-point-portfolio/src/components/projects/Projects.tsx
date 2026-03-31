import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Code2, Loader2 } from 'lucide-react';
import { apiService } from '../../Service/api';
import { Project } from '../../types';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'Web Applications' | 'Mobile Apps'>('Web Applications');

  const handleEngagement = (action: string) => {
    apiService.post('/api/stats/engage', { action }).catch(() => {});
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiService.get<any[]>('/api/projects');
        // Handle techStack if it's a comma-separated string from SQL
        const formattedData = data.map(p => ({
          ...p,
          techStack: typeof p.techStack === 'string' ? p.techStack.split(',').map((s: string) => s.trim()) : p.techStack
        }));
        setProjects(formattedData);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          
          {/* Filter Bar */}
          <div className="flex p-1 bg-card border border-border rounded-xl">
            {(['Web Applications', 'Mobile Apps'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === cat 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-secondary hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-secondary animate-pulse">Loading amazing projects...</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80'} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <a href={project.githubUrl} onClick={() => handleEngagement(`github_click_${project.id}`)} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors">
                        <Code2 className="w-5 h-5" />
                      </a>
                      <a href={project.externalUrl} onClick={() => handleEngagement(`external_click_${project.id}`)} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="p-3 md:p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2 md:mb-4">
                      <div>
                        <div className="text-primary text-[10px] md:text-sm font-bold uppercase tracking-wider mb-0.5 md:mb-2">{project.category}</div>
                        <h3 className="text-sm md:text-2xl font-bold line-clamp-1">{project.title}</h3>
                      </div>
                    </div>
                    <p className="text-secondary text-[10px] md:text-base line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 flex-grow">{project.description}</p>
                    <div className="flex flex-wrap gap-1 md:gap-2 mt-auto">
                      {project.techStack?.slice(0, 3).map((tech: string, i: number) => (
                        <span key={i} className="px-1.5 md:px-3 py-0.5 md:py-1 bg-white/5 border border-white/10 rounded-full text-[8px] md:text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
