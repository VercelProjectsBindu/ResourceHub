import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { apiService } from '../../Service/api';
import { Save, Loader2, Link as LinkIcon, Smartphone, Mail, MapPin, Type, Image as ImageIcon, Layout, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function SiteSettings() {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('identity');

  const tabs = [
    { id: 'identity', label: 'Brand Identity', icon: Type },
    { id: 'hero', label: 'Landing Splash', icon: ImageIcon },
    { id: 'capabilities', label: 'Core Capabilities', icon: Layout },
    { id: 'contact', label: 'Contact Info', icon: MapPin },
    { id: 'social', label: 'Social & Footer', icon: LinkIcon }
  ];

  // Local state for capabilities array manipulation
  const [capabilities, setCapabilities] = useState<any[]>([]);

  // Sync when context finally loads
  useEffect(() => {
    setFormData(settings);
    try {
      if (settings.coreCapabilities) {
        setCapabilities(JSON.parse(settings.coreCapabilities));
      }
    } catch(e) {}
  }, [settings]);

  // Sync back to formData right before submit
  useEffect(() => {
    setFormData(prev => ({ ...prev, coreCapabilities: JSON.stringify(capabilities) }));
  }, [capabilities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMsg('');
      setSuccess('');
      await apiService.post('/api/settings', { settings: formData });
      await refreshSettings();
      setSuccess('Settings successfully updated globally!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">Global Site Settings</h2>
          <p className="text-secondary text-sm mt-1">Updates propagate immediately across the entire portfolio.</p>
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      {success && <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 text-green-500 rounded-xl font-bold text-sm">{success}</div>}
      {errorMsg && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl font-bold text-sm">{errorMsg}</div>}

      <div className="flex bg-white/5 p-1 rounded-xl mb-8 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex-1 justify-center ${
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-lg' 
                : 'text-secondary hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-10">
        
        {/* Core Identity */}
        {activeTab === 'identity' && (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4 flex items-center gap-2 text-primary">
            <Type className="w-5 h-5" /> Brand Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Site Full Name</label>
              <input type="text" name="siteName" value={formData.siteName} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2 hover:border-white/10 focus:border-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Logo Display Logic</label>
              <select name="logoDisplay" value={formData.logoDisplay} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2 hover:border-white/10 focus:border-primary/50">
                <option value="text">Render Stylized Text</option>
                <option value="image">Render Image URL</option>
              </select>
            </div>
            {formData.logoDisplay === 'image' && (
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Logo Absolute Image URL</label>
                <div className="flex items-center relative">
                  <ImageIcon className="absolute left-3 w-5 h-5 text-secondary" />
                  <input type="text" name="logoImageUrl" value={formData.logoImageUrl} onChange={handleChange} placeholder="https://..." className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2" />
                </div>
              </div>
            )}
          </div>
        </motion.section>
        )}

        {/* Hero Section */}
        {activeTab === 'hero' && (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4 text-primary">Landing Hero Splash</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Main Headline (H1)</label>
              <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2 font-bold text-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Subtitle / Mission Statement</label>
              <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} rows={3} className="w-full bg-background border border-border rounded-xl px-4 py-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Primary Button Text</label>
                <input type="text" name="heroPrimaryBtnLabel" value={formData.heroPrimaryBtnLabel} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Secondary Button Text</label>
                <input type="text" name="heroSecondaryBtnLabel" value={formData.heroSecondaryBtnLabel} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2" />
              </div>
            </div>
          </div>
        </motion.section>
        )}

        {/* Core Capabilities */}
        {activeTab === 'capabilities' && (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
              <Layout className="w-5 h-5" /> Core Capabilities Services
            </h3>
            <button
              onClick={() => setCapabilities([...capabilities, { id: Date.now().toString(), title: 'New Capability', description: 'Description', icon: 'Layout' }])}
              className="flex items-center gap-2 bg-primary/20 text-primary hover:bg-primary hover:text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
            >
              <Plus className="w-4 h-4" /> Add Capability
            </button>
          </div>
          <div className="space-y-6">
            {capabilities.map((cap, index) => (
              <div key={cap.id} className="p-4 bg-background border border-border rounded-xl relative group">
                <button
                  onClick={() => setCapabilities(capabilities.filter(c => c.id !== cap.id))}
                  className="absolute top-4 right-4 text-secondary hover:text-red-500 transition-colors opacity-50 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <h4 className="text-secondary font-bold mb-4 border-b border-border pb-2">Capability Card {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Title</label>
                    <input 
                      type="text" 
                      value={cap.title} 
                      onChange={(e) => {
                        const newCaps = [...capabilities];
                        newCaps[index].title = e.target.value;
                        setCapabilities(newCaps);
                      }}
                      className="w-full bg-card border border-border rounded-xl px-4 py-2 hover:border-white/10" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Description</label>
                    <input 
                      type="text" 
                      value={cap.description} 
                      onChange={(e) => {
                        const newCaps = [...capabilities];
                        newCaps[index].description = e.target.value;
                        setCapabilities(newCaps);
                      }}
                      className="w-full bg-card border border-border rounded-xl px-4 py-2 hover:border-white/10" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Icon ID</label>
                    <select 
                      value={cap.icon}
                      onChange={(e) => {
                        const newCaps = [...capabilities];
                        newCaps[index].icon = e.target.value;
                        setCapabilities(newCaps);
                      }}
                      className="w-full bg-card border border-border rounded-xl px-4 py-2 hover:border-white/10"
                    >
                      <option value="Layout">Layout</option>
                      <option value="CreditCard">CreditCard</option>
                      <option value="Fingerprint">Fingerprint</option>
                      <option value="Globe">Globe</option>
                      <option value="Code2">Code2</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
        )}

        {/* Footer & Contact */}
        {activeTab === 'contact' && (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4 text-primary">Contact & Footprint</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-1"><MapPin className="w-3 h-3"/> Address</label>
              <input type="text" name="contactAddress" value={formData.contactAddress} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-1"><Mail className="w-3 h-3"/> Primary Email</label>
              <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-1"><Smartphone className="w-3 h-3"/> Phone Number</label>
              <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2" />
            </div>
          </div>
        </motion.section>
        )}
        
        {/* Social Links */}
        {activeTab === 'social' && (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4 flex items-center gap-2 text-primary">
            <LinkIcon className="w-5 h-5" /> Social Media Destinations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">LinkedIn URL</label>
              <input type="text" name="socialLinkedin" value={formData.socialLinkedin} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">GitHub URL</label>
              <input type="text" name="socialGithub" value={formData.socialGithub} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">X (Twitter) URL</label>
              <input type="text" name="socialX" value={formData.socialX} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Copyright Disclaimer</label>
              <input type="text" name="copyrightText" value={formData.copyrightText} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2" />
            </div>
          </div>
        </motion.section>
        )}

      </div>
    </div>
  );
}
