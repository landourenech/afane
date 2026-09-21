'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  showBackToHome?: boolean;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  showBackToHome = true,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-afane py-12 px-4">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

      <div className="relative max-w-md w-full space-y-6 z-10">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="AFANE"
              width={140}
              height={50}
              priority
              className="mx-auto brightness-0 invert"
            />
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-white/70 text-base">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          {children}
        </div>

        {/* Back to home */}
        {showBackToHome && (
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
