import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Globe, Code, X } from 'lucide-react';
import { apiService } from '../../Service/api';
import { Project } from '../../types';

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Applications',
    description: '',
    techStack: '',
    image: '',
    githubUrl: '',
    externalUrl: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await apiService.get<any[]>('/api/projects');
      const formattedData = data.map(p => ({
        ...p,
        techStack: typeof p.techStack === 'string' 
          ? p.techStack.split(',').map((s: string) => s.trim()).filter(Boolean)
          : (p.techStack || [])
      }));
      setProjects(formattedData);
    } catch (error) {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        category: project.category,
        description: project.description || '',
        techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : (project.techStack || ''),
        image: project.image,
        githubUrl: project.githubUrl,
        externalUrl: project.externalUrl
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        category: 'Web Applications',
        description: '',
        techStack: '',
        image: '',
        githubUrl: '',
        externalUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await apiService.put(`/api/projects/${editingProject.id}`, formData);
      } else {
        await apiService.post('/api/projects', formData);
      }
      fetchProjects();
      setIsModalOpen(false);
    } catch (error) {
      alert('Action failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this project?')) {
      await apiService.delete(`/api/projects/${id}`);
      fetchProjects();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Projects</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" /> Add Project
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-x-auto w-full">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-white/5 text-secondary text-sm">
            <tr>
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Links</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={p.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80'} className="w-12 h-12 rounded-lg object-cover bg-background" alt="" />
                    <div className="font-bold">{p.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">{p.category}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3 text-secondary">
                    <a href={p.externalUrl} target="_blank" rel="noopener noreferrer">
                      <X className="w-4 h-4" />
                    </a>
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Code className="w-4 h-4" />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(p)} className="p-2 hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">{editingProject ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-secondary uppercase font-bold mb-2 block">Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3" />
              </div>
              <div>
                <label className="text-xs text-secondary uppercase font-bold mb-2 block">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3">
                  <option>Web Applications</option>
                  <option>Mobile Apps</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-secondary uppercase font-bold mb-2 block">Tech Stack (comma separated)</label>
                <input value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3" />
              </div>
              <div className="col-span-2">
                 <label className="text-xs text-secondary uppercase font-bold mb-2 block">Description</label>
                 <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3" />
              </div>
              <div>
                <label className="text-xs text-secondary uppercase font-bold mb-2 block">Image URL</label>
                <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3" />
              </div>
              <div>
                <label className="text-xs text-secondary uppercase font-bold mb-2 block">Github URL</label>
                <input value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3" />
              </div>
              <div className="col-span-2 flex justify-end gap-4 mt-6">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-border hover:bg-white/5">Cancel</button>
                 <button type="submit" className="px-8 py-3 rounded-xl bg-primary font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
