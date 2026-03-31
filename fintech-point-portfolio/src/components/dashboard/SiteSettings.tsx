import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { apiService } from '../../Service/api';
import { Save, Loader2, Link as LinkIcon, Smartphone, Mail, MapPin, Type, Image as ImageIcon } from 'lucide-react';

export default function SiteSettings() {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync when context finally loads
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

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

      <div className="space-y-10">
        
        {/* Core Identity */}
        <section>
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
        </section>

        {/* Hero Section */}
        <section>
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
        </section>

        {/* Footer & Contact */}
        <section>
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
        </section>
        
        {/* Social Links */}
        <section>
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
        </section>

      </div>
    </div>
  );
}
