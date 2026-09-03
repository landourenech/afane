'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  User,
  Bell,
  Shield,
  Trash2,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const username = params?.username as string;
  
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const settingsItems = [
    {
      id: 'profile',
      title: 'Modifier le profil',
      description: 'Nom, téléphone, localisation',
      icon: User,
      href: `/${username}/settings/profile`,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Email, push, SMS',
      icon: Bell,
      href: `/${username}/settings/notifications`,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'security',
      title: 'Sécurité',
      description: 'Statut du compte',
      icon: Shield,
      href: `/${username}/settings/security`,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'danger',
      title: 'Zone dangereuse',
      description: 'Supprimer le compte',
      icon: Trash2,
      href: `/${username}/settings/danger`,
      color: 'bg-red-100 text-red-600',
    },
  ];

  // Déterminer la page active
  const activePage = settingsItems.find(item => 
    pathname === item.href || pathname.startsWith(item.href + '/')
  )?.id || '';

  return (
    <div className="min-h-full bg-gray-50">
      <div className="flex">
        {/* SIDEBAR DESKTOP */}
        <div className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
         
          
          <nav className="p-2">
            {settingsItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md mb-1 transition-colors ${
                  activePage === item.id
                    ? 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center">
                  <item.icon className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium">{item.title}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            ))}

         
          </nav>
        </div>

        {/* CONTENU */}
        <div className="flex-1 min-w-0">
          {/* HEADER MOBILE */}


          {/* CONTENU DE LA PAGE */}
          {children}
        </div>
      </div>
    </div>
  );
}