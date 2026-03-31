import React, { useState, useEffect } from 'react';
import { Mail, User, Clock, Trash2 } from 'lucide-react';
import { apiService } from '../../Service/api';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function MessageViewer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await apiService.get<Message[]>('/api/contact');
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Submissions</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {messages.map((m) => (
          <div key={m.id} className="bg-card border border-border rounded-2xl p-6 group hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{m.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-secondary">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {m.email}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-secondary hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-background/50 rounded-xl p-4">
              <div className="text-xs uppercase font-black text-primary mb-2">{m.subject || 'Inquiry'}</div>
              <p className="text-secondary leading-relaxed">{m.message}</p>
            </div>
          </div>
        ))}

        {messages.length === 0 && !loading && (
          <div className="py-20 text-center text-secondary">
            No messages found yet.
          </div>
        )}
      </div>
    </div>
  );
}
