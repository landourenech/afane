'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  User,
  Lock,
  Bell,
  Cookie,
  Palette,
  Globe,
  HelpCircle,
  FileText,
  LogOut,
  Shield,
  MessageCircle,
  Info,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  SettingsItem,
  SettingsSection,
  SettingsProfileCard,
} from '@/features/settings';

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (!confirm('Voulez-vous vraiment vous déconnecter ?')) return;
    await logout();
    router.push('/login');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Paramètres
        </h1>
      </div>

      <SettingsProfileCard username={username} />

      <SettingsSection title="Compte">
        <SettingsItem
          icon={User}
          label="Profil"
          description="Nom, photo, bio"
          href={`/${username}/settings/profile`}
        />
        <SettingsItem
          icon={Lock}
          label="Sécurité"
          description="Mot de passe, 2FA, sessions"
          href={`/${username}/settings/security`}
        />
        <SettingsItem
          icon={Bell}
          label="Notifications"
          description="Push, email, sons"
          href={`/${username}/settings/notifications`}
        />
        <SettingsItem
          icon={Shield}
          label="Confidentialité"
          description="Qui peut voir mon profil"
          href={`/${username}/settings/privacy`}
        />
      </SettingsSection>

      <SettingsSection title="Préférences">
        <SettingsItem
          icon={Palette}
          label="Apparence"
          description="Thème clair / sombre"
          href={`/${username}/settings/appearance`}
        />
        <SettingsItem
          icon={Globe}
          label="Langue et région"
          description="Français · Gabon"
          href={`/${username}/settings/language`}
        />
        <SettingsItem
          icon={MessageCircle}
          label="Discussions"
          description="Fond d'écran, taille de police"
          href={`/${username}/settings/chats`}
        />
        <SettingsItem
          icon={Cookie}
          label="Cookies"
          description="Préférences de consentement"
          href={`/${username}/settings/cookies`}
        />
      </SettingsSection>

      <SettingsSection title="Aide et informations">
        <SettingsItem
          icon={HelpCircle}
          label="Centre d'aide"
          description="FAQ, guides, tutoriels"
          href="/help"
        />
        <SettingsItem
          icon={FileText}
          label="Conditions d'utilisation"
          href="/terms"
        />
        <SettingsItem
          icon={Cookie}
          label="Politique cookies"
          href="/cookie-policy"
        />
        <SettingsItem
          icon={Info}
          label="À propos d'AFANE"
          description="Version 2.0.0-beta.9"
          href="/about"
        />
      </SettingsSection>

      <SettingsSection>
        <SettingsItem
          icon={LogOut}
          label="Déconnexion"
          variant="danger"
          onClick={handleLogout}
          iconBg="bg-red-100"
        />
      </SettingsSection>

      <p className="text-center text-[11px] text-[var(--text-tertiary)] mt-6">
        AFANE 2.0 · Made with 💚 in Gabon
      </p>
    </div>
  );
}
