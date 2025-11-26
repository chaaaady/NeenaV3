"use client";

import { Home, Building2, Heart, Users, BookOpen, User, LogIn, Church } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  icon: React.ElementType;
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { icon: Home, label: "Accueil", href: "/" },
  { icon: Church, label: "Mosquées", href: "/mosquees" },
  { icon: Building2, label: "Projets", href: "/constructions" },
  { icon: Heart, label: "Faire un don", href: "/step-amount-v26" },
  { icon: BookOpen, label: "Duaa", href: "/duaa" },
  { icon: Users, label: "Bénévolat", href: "/benevolat" },
  { icon: User, label: "Qui sommes-nous", href: "/qui-sommes-nous" },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col z-50">
      {/* Glassmorphism background - légèrement plus transparent pour correspondre visuellement aux cartes */}
      <div className="absolute inset-0 border-r border-white/15 bg-gradient-to-br from-white/[0.15] to-white/[0.10] backdrop-blur-xl" />
      
      {/* Content */}
      <div className="relative flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center px-4">
          <Link href="/" className="text-[20px] font-[900] text-white hover:opacity-80 transition-opacity" style={{ fontFamily: "'American Grotesk Black', sans-serif", letterSpacing: '0.08em' }}>
            Neena
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-[500] transition-all
                    ${isActive 
                      ? "bg-white/15 text-white backdrop-blur-sm" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 space-y-2">
          <Link
            href="/auth/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-[500] text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogIn size={18} />
            <span>Se connecter</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

