// 'use client';

// import { useAuth } from '@/contexts/AuthContext';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import { AppSidebar } from '@/components/dashboard/AppSidebar';
// import { SidebarProvider } from '@/components/ui/sidebar';

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, profile, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//     if (!loading && user && !profile?.onboarding_completed) {
//       router.push('/onboarding');
//     }
//   }, [user, profile, loading, router]);

//   if (loading || !user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full">
//         <AppSidebar />
//         <main className="flex-1 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </SidebarProvider>
//   );
// }