'use client';

import { MessageCircle } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
          <MessageCircle className="h-10 w-10 text-gray-400" />
        </div>
        <p className="text-gray-500">Aucun message pour le moment</p>
      </div>
    </div>
  );
}
