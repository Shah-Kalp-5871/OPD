'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { socket } from '@/lib/socket';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'SEVERE' | 'CRITICAL';
  isRead: boolean;
  createdAt: string;
}

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    setupSocket();
    return () => {
      socket.off('new-notification');
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications/in-app');
      setNotifications(data as any);
      setUnreadCount((data as any).filter((n: any) => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const setupSocket = () => {
    socket.on('new-notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      // Optional: Play sound or show toast
    });
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/in-app/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/in-app/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read');
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'SUCCESS': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'SEVERE':
      case 'CRITICAL': return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-500" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[60]" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[70]"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-700">Notifications</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="h-8 text-[10px] uppercase tracking-wider font-bold text-slate-400 hover:text-indigo-600"
                  >
                    Mark all read
                  </Button>
                  <button onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => !n.isRead && markAsRead(n.id)}
                      className={`p-4 border-b border-slate-50 transition-colors cursor-pointer flex gap-4 ${!n.isRead ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}`}
                    >
                      <div className="mt-1">
                        {getSeverityIcon(n.severity)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm ${!n.isRead ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {n.message}
                        </p>
                        {!n.isRead && (
                          <div className="flex justify-end pt-1">
                            <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Mark as read
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-sm font-medium text-slate-400">All caught up!</p>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                <Button variant="ghost" className="w-full h-8 text-xs font-bold text-slate-500 hover:text-indigo-600">
                  View All Activity
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
