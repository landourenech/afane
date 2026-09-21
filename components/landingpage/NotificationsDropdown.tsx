'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell } from 'lucide-react';

export function NotificationsDropdown() {
  const { profile } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
    if (!profile) return;
    try {
      const response = await fetch(`/api/notifications?userId=${profile.id}&limit=20`);
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  }, [profile]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) loadNotifications();
        }}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
        title="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[350px] bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">
              {unreadCount > 0
                ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? 's' : ''}`
                : 'Aucune notification'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
