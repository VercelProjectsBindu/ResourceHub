import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, FolderKanban, MessageSquare, LogOut, TrendingUp, Users, Eye, X, Globe, Settings as SettingsIcon } from 'lucide-react';
import ProjectManager from './ProjectManager';
import MessageViewer from './MessageViewer';
import SiteSettings from './SiteSettings';
import { apiService } from '../../Service/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'messages' | 'activity'>('overview');
  const [statsData, setStatsData] = useState({ projects: 0, messages: 0, views: 0, engagement: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartTimeframe, setChartTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [regionData, setRegionData] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [activitySearch, setActivitySearch] = useState('');

  useEffect(() => {
    const token = apiService.getToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchOverviewData = async () => {
      try {
        const [projects, messages, activityLogs, statsSummary, chartSummary, regions] = await Promise.all([
          apiService.get<any[]>('/api/projects'),
          apiService.get<any[]>('/api/contact'),
          apiService.get<any[]>('/api/activity'),
          apiService.get<any>('/api/stats/summary'),
          apiService.get<any[]>(`/api/stats/chart?timeframe=${chartTimeframe}`),
          apiService.get<any[]>('/api/stats/regions')
        ]);
        setStatsData({ 
          projects: projects.length, 
          messages: messages.length,
          views: statsSummary.views || 0,
          engagement: statsSummary.engagement || 0
        });
        if (chartSummary) setChartData(chartSummary);
        if (activityLogs) setLogs(activityLogs);
        if (regions) setRegionData(regions);
      } catch (err) {
        console.error('Failed to fetch overview stats');
      }
    };
    fetchOverviewData();
  }, [chartTimeframe]);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(activitySearch.toLowerCase()) || 
    log.entity.toLowerCase().includes(activitySearch.toLowerCase()) ||
    log.username?.toLowerCase().includes(activitySearch.toLowerCase()) ||
    log.ip_address?.includes(activitySearch)
  );

  const handleLogout = () => {
    apiService.clearAuth();
    window.location.href = '/login';
  };

  const user = apiService.getUser();

  const stats = [
    { label: 'Total Projects', value: statsData.projects.toString(), icon: FolderKanban, color: 'text-blue-500' },
    { label: 'Total Messages', value: statsData.messages.toString(), icon: MessageSquare, color: 'text-green-500' },
    { label: 'Profile Views', value: statsData.views.toString(), icon: Eye, color: 'text-purple-500' },
    { label: 'Engagement Clicks', value: statsData.engagement.toString(), icon: TrendingUp, color: 'text-orange-500' }
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'activity', label: 'Activity Logs', icon: TrendingUp },
    { id: 'settings', label: 'Site Settings', icon: SettingsIcon }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex w-64 border-r border-border bg-card/20 backdrop-blur-xl p-6 flex-col relative z-10">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold uppercase">
            {user?.username ? user.username.charAt(0) : 'F'}
          </div>
          <span className="font-bold text-lg capitalize">{user ? `${user.username} Panel` : 'Admin Panel'}</span>
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
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-white transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-50 flex justify-around p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center gap-1.5 transition-colors ${
              activeTab === item.id ? 'text-primary' : 'text-secondary hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'fill-primary/20' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-28 md:pb-10 relative z-0">
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
          <div className="space-y-6 md:space-y-8 pb-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

            {/* Main Graphs & Hit Map Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
              
              {/* Graphical Chart (Native SVG) */}
              <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-6 md:p-8 relative overflow-hidden group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <h2 className="text-xl font-bold">Graphical Growth</h2>
                  <div className="flex bg-white/5 rounded-lg p-1">
                  {['daily', 'weekly', 'monthly'].map((tf) => (
                    <button 
                      key={tf}
                      onClick={() => setChartTimeframe(tf as any)}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${chartTimeframe === tf ? 'bg-primary text-white shadow-lg' : 'text-secondary hover:text-white'}`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-72 relative w-full pt-4">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="views" name="Profile Views" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" activeDot={{ r: 6, strokeWidth: 0 }} />
                      <Area type="monotone" dataKey="engagements" name="Engagements" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorEngage)" activeDot={{ r: 6, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-secondary">Loading chart data...</div>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-8 text-sm font-bold bg-white/5 py-3 rounded-xl backdrop-blur-md border border-white/5">
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 rounded shadow-[0_0_15px_rgba(168,85,247,0.6)] bg-gradient-to-br from-purple-400 to-purple-600"></div> 
                   Profile Views
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 rounded shadow-[0_0_15px_rgba(249,115,22,0.6)] bg-gradient-to-br from-orange-400 to-orange-600"></div> 
                   Engagements
                 </div>
              </div>
            </div>

            {/* Regional Hit Map */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Regional Hit Map</h2>
                    <p className="text-secondary text-xs">Top locations by IP trace</p>
                  </div>
                </div>

                <div className="space-y-5 flex-grow">
                  {regionData.length === 0 ? (
                     <div className="h-full flex items-center justify-center text-secondary text-sm italic opacity-50">
                        Gathering geodata...
                     </div>
                  ) : (
                    regionData.map((reg, i) => {
                      const maxHits = Math.max(...regionData.map(r => r.hits), 1);
                      const pct = Math.max((reg.hits / maxHits) * 100, 5);
                      
                      // Convert country code to emoji flag
                      const getFlag = (cc: string) => {
                        if (!cc || cc.length !== 2) return '🌍';
                        const a = cc.toUpperCase().charCodeAt(0) + 127397;
                        const b = cc.toUpperCase().charCodeAt(1) + 127397;
                        return String.fromCodePoint(a, b);
                      };

                      return (
                        <div key={i} className="group">
                          <div className="flex justify-between items-end mb-2 text-sm font-bold">
                            <span className="flex items-center gap-3 group-hover:text-primary transition-colors">
                              <span className="text-lg leading-none shadow-sm">{getFlag(reg.countryCode)}</span>
                              <span className="truncate max-w-[120px] md:max-w-[150px]">{reg.region || 'Unknown'}</span>
                            </span>
                            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">{reg.hits} views</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                            <div 
                              className="bg-gradient-to-r from-primary/50 to-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Dedicated Activity Logs Tab --- */}
        {activeTab === 'activity' && (
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-2">Activity Timeline</h2>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <p className="text-secondary">A comprehensive history of all secure database events.</p>
              <input 
                type="text" 
                placeholder="Search logs by action, IP, username..." 
                value={activitySearch}
                onChange={e => setActivitySearch(e.target.value)}
                className="w-full md:w-64 bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-secondary bg-white/5 rounded-xl border border-dashed border-white/10">
                  No activity matches your search.
                </div>
              ) : (
                filteredLogs.map((log: any) => (
                  <button 
                    key={log.id} 
                    onClick={() => setSelectedLog(log)}
                    className="w-full text-left flex items-center justify-between p-4 border border-transparent hover:border-white/10 hover:bg-white/5 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                         <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                         <div className="font-medium text-xs md:text-sm flex items-center gap-2 flex-wrap mb-1">
                           <span className="font-black text-white">{log.username || 'System Guest'}</span> 
                           <span className="text-secondary opacity-70">executed</span> 
                           <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-md text-[10px] md:text-xs tracking-wider">{log.action}</span>
                           <span className="text-secondary opacity-70 hidden md:inline">on table</span>
                           <span className="uppercase text-[10px] md:text-xs font-black tracking-widest text-slate-300">{log.entity}</span>
                         </div>
                         <div className="text-[10px] md:text-xs text-secondary font-mono flex items-center gap-3">
                           <span>{new Date(log.created_at).toLocaleString()}</span>
                           <span className="w-1 h-1 bg-white/20 rounded-full hidden md:block"></span>
                           <span className="hidden md:block">IP: {log.ip_address}</span>
                         </div>
                      </div>
                    </div>
                    <div className="text-xs text-secondary group-hover:text-primary font-black transition-colors flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full border border-white/5">
                      View Payload <Eye className="w-3 h-3 hidden md:block" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'projects' && <ProjectManager />}
        {activeTab === 'messages' && <MessageViewer />}
        {activeTab === 'settings' && <SiteSettings />}
      </main>

      {/* Activity Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-6" onClick={() => setSelectedLog(null)}>
          <div className="bg-card/95 backdrop-blur-xl border border-border w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedLog(null)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6 text-secondary hover:text-white" />
            </button>
            
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
               <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary"><Eye className="w-5 h-5" /></div>
               Activity Log
            </h3>
            
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-secondary text-sm">Target</span>
                <span className="uppercase font-black tracking-widest text-sm">{selectedLog.entity}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-secondary text-sm">Command</span>
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded font-mono text-xs">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-secondary text-sm">Actor / Identity</span>
                <span className="font-bold text-sm">{selectedLog.username || 'Automated System'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-secondary text-sm">Network Origin</span>
                <span className="font-mono text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">{selectedLog.ip_address}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-secondary text-sm">Timestamp</span>
                <span className="text-sm font-medium">{new Date(selectedLog.created_at).toLocaleString()}</span>
              </div>
              
              <div className="pt-6">
                <span className="text-secondary block mb-3 font-bold text-xs uppercase tracking-widest">Payload Intercept</span>
                <pre className="bg-black/60 p-4 rounded-xl text-[10px] md:text-xs font-mono overflow-x-auto border border-white/5 text-slate-300 shadow-inner">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
