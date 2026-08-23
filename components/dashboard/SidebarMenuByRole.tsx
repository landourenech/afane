// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// import {
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
// } from "@/components/ui/sidebar";

// import { menuItems } from "@/components/dashboard/Sidebar-data";
// import type { UserRole } from "@/types/user";

// interface SidebarMenuByRoleProps {
//   username: string;
//   role: UserRole;
// }

// export function SidebarMenuByRole({ username, role }: SidebarMenuByRoleProps) {
//   const pathname = usePathname();

//   const menuItemsForUser = menuItems.filter((item) => {
//     if (!item.roles || item.roles.length === 0) {
//       return true;
//     }
//     return item.roles.includes(role);
//   });

//   return (
//     <SidebarMenu>
//       {menuItemsForUser.map((item) => {
//         const href = item.url ? `/dashboard${item.url}` : '/dashboard';
//         const isActive = pathname === href || pathname.startsWith(href + '/');

//         return (
//           <SidebarMenuItem key={item.title}>
//             <Link href={href} className="w-full">
//               <SidebarMenuButton
//                 tooltip={item.title}
//                 className={
//                   isActive
//                     ? "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]"
//                     : ""
//                 }
//               >
//                 <item.icon />
//                 <span>{item.title}</span>
//               </SidebarMenuButton>
//             </Link>
//           </SidebarMenuItem>
//         );
//       })}
//     </SidebarMenu>
//   );
// }