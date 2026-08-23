// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import {
//   Sidebar,
//   SidebarHeader,
//   SidebarContent,
//   SidebarFooter,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
// } from "@/components/ui/sidebar";

// import { Settings, CircleQuestionMark, LogOut, User } from "lucide-react";

// import { SidebarMenuByRole } from "@/components/dashboard/SidebarMenuByRole";
// import { useAuth } from "@/contexts/AuthContext";

// export function AppSidebar() {
//   const { user, profile, logout } = useAuth();
//   const router = useRouter();

//   const handleLogout = async () => {
//     await logout();
//     router.push('/login');
//   };

//   return (
//     <Sidebar collapsible="icon">
//       <SidebarHeader className="bg-[var(--color-primary)] p-0">
//         <div className="flex h-16 items-center justify-center">
//           <Image 
//             src="/logo.png" 
//             width={80} 
//             height={50} 
//             alt="AFANE" 
//             priority 
//           />
//         </div>
//       </SidebarHeader>

//       <SidebarContent className="border-t-5 border-[var(--color-secondary)] pt-5">
//         <SidebarMenuByRole 
//           username={profile?.id || user?.uid || ''} 
//           role={profile?.role || 'user'} 
//         />
//       </SidebarContent>

//       <SidebarFooter>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <Link href="/settings" className="block w-full">
//               <SidebarMenuButton tooltip="Paramètres">
//                 <Settings />
//                 <span>Paramètres</span>
//               </SidebarMenuButton>
//             </Link>
//           </SidebarMenuItem>

//           <SidebarMenuItem>
//             <Link href="/help" className="block w-full">
//               <SidebarMenuButton tooltip="Aide">
//                 <CircleQuestionMark />
//                 <span>Aide</span>
//               </SidebarMenuButton>
//             </Link>
//           </SidebarMenuItem>

//           <SidebarMenuItem>
//             <Link href="/profile" className="block w-full">
//               <SidebarMenuButton tooltip="Mon profil">
//                 {user?.photoURL ? (
//                   // Utiliser <img> au lieu de <Image> pour les URLs externes
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img
//                     src={user.photoURL}
//                     alt={user.displayName || 'User'}
//                     width={24}
//                     height={24}
//                     className="rounded-full object-cover h-6 w-6"
//                   />
//                 ) : (
//                   <User className="h-6 w-6" />
//                 )}
//                 <span className="truncate">
//                   {profile?.display_name || user?.displayName || 'Profil'}
//                 </span>
//               </SidebarMenuButton>
//             </Link>
//           </SidebarMenuItem>

//           <SidebarMenuItem>
//             <button 
//               onClick={handleLogout}
//               className="w-full"
//             >
//               <SidebarMenuButton tooltip="Déconnexion">
//                 <LogOut />
//                 <span>Déconnexion</span>
//               </SidebarMenuButton>
//             </button>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   );
// }