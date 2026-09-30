'use client';

import { useState } from 'react';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { updateGroupName } from '../services/group-chat.service';

interface EditableGroupNameProps {
  conversationId: string;
  initialName: string;
  canEdit: boolean;
  onUpdate?: (newName: string) => void;
  className?: string;
}

export function EditableGroupName({
  conversationId,
  initialName,
  canEdit,
  onUpdate,
  className = '',
}: EditableGroupNameProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setName(initialName);
      setEditing(false);
      return;
    }
    if (trimmed === initialName) {
      setEditing(false);
      return;
    }

    setLoading(true);
    const ok = await updateGroupName(conversationId, trimmed);
    setLoading(false);

    if (ok) {
      onUpdate?.(trimmed);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setName(initialName);
    setEditing(false);
  };

  if (!canEdit) {
    return <span className={className}>{initialName}</span>;
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          autoFocus
          maxLength={80}
          className="flex-1 min-w-0 px-2 py-1 bg-[var(--bg-tertiary)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--afane-orange)]/30"
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="p-1.5 rounded-full bg-[var(--afane-green)] text-white hover:bg-[var(--afane-orange)] disabled:opacity-50"
          aria-label="Enregistrer"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
        </button>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="p-1.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-red-100 hover:text-red-600"
          aria-label="Annuler"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={`group flex items-center gap-1.5 hover:text-[var(--afane-orange)] transition-colors ${className}`}
    >
      <span className="truncate">{name}</span>
      <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </button>
  );
}
