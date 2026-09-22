import { requireOwnership } from '@/lib/auth/server-auth';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

export default async function UserDashboardLayout({
  children,
  params,
}: LayoutProps) {
  const { username } = await params;

  // ✅ Vérification sécurité côté serveur
  await requireOwnership(username);

  return (
    <SidebarProvider>
      <AppSidebar username={username} />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b border-gray-200 bg-white px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
