'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Edit3, 
  Save,
  User as UserIcon,
  BadgeCheck,
  Shield,
  Package,
  ShoppingCart,
  TrendingUp,
  Activity,
} from 'lucide-react';
import Image from 'next/image';

// Types
interface EditableProfile {
  display_name: string;
  phone: string;
  bio: string;
  region: string;
  city: string;
}

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string;
  const supabase = createClient();

  // États
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Données du profil
  const [editableData, setEditableData] = useState<EditableProfile>({
    display_name: profile?.display_name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    region: profile?.region || '',
    city: profile?.city || '',
  });

  useEffect(() => {
    if (profile) {
      setEditableData({
        display_name: profile.display_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        region: profile.region || '',
        city: profile.city || '',
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
          display_name: editableData.display_name,
          phone: editableData.phone,
          bio: editableData.bio,
          region: editableData.region,
          city: editableData.city,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      await refreshProfile();
    } catch (error) {
      console.error('Erreur upload:', error);
      setUploadError('Erreur lors du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* COVER */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-[var(--color-quaternary)] via-[var(--color-quaternary)] to-[var(--color-secondary)]" />
        
     {/* Avatar */}
<div className="absolute -bottom-16 left-6">
  <div className="relative">
    {(profile.avatar_url || user?.photoURL) ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={(profile.avatar_url || user?.photoURL) as string}
        alt={profile.display_name || 'Avatar'}
        width={128}
        height={128}
        className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
      />
    ) : (
      <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center shadow-lg">
        <UserIcon className="w-16 h-16 text-gray-500" />
      </div>
    )}
    
    <button
      onClick={() => fileInputRef.current?.click()}
      disabled={isUploading}
      className="absolute bottom-0 right-0 p-2 bg-[var(--color-secondary)] text-white rounded-full hover:opacity-90 shadow-lg disabled:opacity-50"
    >
      {isUploading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
      ) : (
        <Camera className="w-4 h-4" />
      )}
    </button>
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />
  </div>
</div>

        {/* Actions */}
        <div className="absolute top-4 right-4">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Modifier
            </button>
          )}
        </div>
      </div>

      {/* INFO PRINCIPALE */}
      <div className="px-6 pt-20 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {profile.display_name || user?.displayName || 'Utilisateur'}
              {profile.verification_status === 'verified' && (
                <BadgeCheck className="w-5 h-5 text-blue-500" />
              )}
            </h1>
            <p className="text-gray-500">@{profile.username}</p>
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                Enregistrer
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 text-sm"
              >
                Annuler
              </button>
            </div>
          )}
        </div>

        {/* Bio */}
        {isEditing ? (
          <textarea
            value={editableData.bio}
            onChange={(e) => setEditableData({ ...editableData, bio: e.target.value })}
            placeholder="Parlez de vous..."
            className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            rows={3}
          />
        ) : (
          <p className="mt-3 text-gray-700">
            {profile.bio || 'Aucune biographie pour le moment.'}
          </p>
        )}

        {/* Infos rapides */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          {profile.city && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {profile.city}{profile.region ? `, ${profile.region}` : ''}
            </span>
          )}
          {profile.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {profile.phone}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {profile.email}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Membre depuis {new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* TABS */}
      <div className="border-t border-gray-200 mt-4">
        <div className="flex overflow-x-auto">
          {[
            { id: 'overview', label: 'Aperçu', icon: Activity },
            { id: 'products', label: 'Produits', icon: Package },
            { id: 'orders', label: 'Commandes', icon: ShoppingCart },
            { id: 'activity', label: 'Activité', icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[var(--color-secondary)] text-[var(--color-secondary)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU DES TABS */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Badges */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Badges</h3>
              <div className="flex gap-3">
                {profile.verification_status === 'verified' && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    <BadgeCheck className="w-4 h-4" />
                    Vérifié
                  </span>
                )}
                <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  <Shield className="w-4 h-4" />
                  {profile.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            Aucun produit pour le moment.
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            Aucune commande pour le moment.
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            Aucune activité récente.
          </div>
        )}
      </div>

      {/* SECTION ÉDITION */}
      {isEditing && (
        <div className="p-6 bg-white border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Modifier le profil</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                value={editableData.display_name}
                onChange={(e) => setEditableData({ ...editableData, display_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={editableData.phone}
                onChange={(e) => setEditableData({ ...editableData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Région
                </label>
                <input
                  type="text"
                  value={editableData.region}
                  onChange={(e) => setEditableData({ ...editableData, region: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  value={editableData.city}
                  onChange={(e) => setEditableData({ ...editableData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}