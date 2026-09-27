'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => Promise<void> | void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, [text]);

  const handleSend = async () => {
    if (!text.trim() || sending || disabled) return;

    const content = text;
    setText('');
    setSending(true);

    try {
      await onSend(content);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 bg-white border-t border-gray-200">
      <button
        type="button"
        className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors flex-shrink-0"
        aria-label="Joindre un fichier"
        disabled={disabled}
      >
        <Paperclip className="h-5 w-5" />
      </button>

      <div className="flex-1 bg-gray-100 rounded-2xl">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrire un message..."
          rows={1}
          disabled={disabled || sending}
          className="w-full bg-transparent px-4 py-2.5 text-sm resize-none focus:outline-none placeholder-gray-400 max-h-32"
        />
      </div>

      <button
        type="button"
        onClick={handleSend}
        disabled={!text.trim() || sending || disabled}
        className={`p-2.5 rounded-full flex-shrink-0 transition-all ${
          text.trim() && !sending
            ? 'bg-gradient-to-br from-[#e86c00] to-[#d16000] text-white hover:shadow-lg active:scale-95'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Envoyer"
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
}
