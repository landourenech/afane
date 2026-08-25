'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { 
  ArrowLeft,
  Bell,
  Mail,
  Smartphone,
  Save,
  CheckCircle,
} from 'lucide-react';

export default function NotificationsSettingsPage() {
  const { profile, refreshProfile } = useAuth();
  const params = useParams();
  const username = params?.username as string;
  const supabase = createClient();

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  useEffect(() => {
    if (profile?.notification_preferences) {
      setNotifications({
        email: profile.notification_preferences.email ?? true,
        push: profile.notification_preferences.push ?? true,
        sms: profile.notification_preferences.sms ?? false,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_preferences: notifications,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      setSuccess('Préférences enregistrées !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const NotificationToggle = ({ 
    icon: Icon, 
    title, 
    description, 
    checked, 
    onChange 
  }: { 
    icon: any; 
    title: string; 
    description: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
      <div className="flex items-center">
        <Icon className="h-5 w-5 text-gray-500 mr-3" />
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-secondary)]"></div>
      </label>
    </div>
  );

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/${username}/settings`}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <p className="text-xl font-bold text-gray-900">Notifications</p>
            <p className="text-sm text-gray-500 mt-1">Gérez vos préférences</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {success}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6 space-y-3">
            <NotificationToggle
              icon={Mail}
              title="Notifications par email"
              description="Recevoir des emails pour les commandes et messages"
              checked={notifications.email}
              onChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />

            <NotificationToggle
              icon={Bell}
              title="Notifications push"
              description="Recevoir des notifications sur le navigateur"
              checked={notifications.push}
              onChange={(checked) => setNotifications({ ...notifications, push: checked })}
            />

            <NotificationToggle
              icon={Smartphone}
              title="Notifications SMS"
              description="Recevoir des SMS pour les alertes importantes"
              checked={notifications.sms}
              onChange={(checked) => setNotifications({ ...notifications, sms: checked })}
            />

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}