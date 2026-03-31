import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, FolderKanban, MessageSquare, LogOut, TrendingUp, Users, Eye } from 'lucide-react';
import ProjectManager from './ProjectManager';
import MessageViewer from './MessageViewer';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'messages'>('overview');

  const stats = [
    { label: 'Total Projects', value: '12', icon: FolderKanban, color: 'text-blue-500' },
    { label: 'Total Messages', value: '24', icon: MessageSquare, color: 'text-green-500' },
    { label: 'Profile Views', value: '1.2k', icon: Eye, color: 'text-purple-500' },
    { label: 'Engagement', value: '+15%', icon: TrendingUp, color: 'text-orange-500' }
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Project Manager', icon: FolderKanban },
    { id: 'messages', label: 'Messages', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/20 backdrop-blur-xl p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold">FP</div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-secondary hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-white transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2 capitalize">{activeTab}</h1>
            <p className="text-secondary">Welcome back to your portfolio management.</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="bg-card border border-border px-4 py-2 rounded-lg text-sm hover:border-primary/50 transition-colors">
                Refresh Data
             </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={stat.label}
                  className="bg-card border border-border p-6 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-background border border-border ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-secondary text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <FolderKanban className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">New project "SaaS Platform" added</div>
                        <div className="text-xs text-secondary">2 hours ago</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && <ProjectManager />}
        {activeTab === 'messages' && <MessageViewer />}
      </main>
    </div>
  );
}
