'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderTree,
  PlayCircle,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  CreditCard,
  LogOut,
  User,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Test Suites', href: '/suites', icon: FolderTree },
  { name: 'Executions', href: '/executions', icon: PlayCircle },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen, user, signOut } = useStore();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (!profileMenuOpen) return;
      const target = event.target as Node | null;
      if (profileRef.current && target && !profileRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [profileMenuOpen]);

  useEffect(() => {
    setProfileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      setProfileMenuOpen(false);
      await signOut();
    } finally {
      router.replace('/login');
    }
  };

  const handleBilling = () => {
    setProfileMenuOpen(false);
    router.push('/billing');
  };

  if (!sidebarOpen) {
    return (
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-[#0f0f10] border border-zinc-800 p-2 hover:bg-[#1a1a1c] transition-colors"
      >
        <FolderTree className="size-5 text-zinc-400" />
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-[#0f0f10] border-r border-zinc-800 flex flex-col hidden md:flex">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-zinc-800">
        <h1 className="text-xl font-medium text-zinc-200">TestFlow</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg p-1.5 hover:bg-[#1a1a1c] transition-colors"
        >
          <ChevronLeft className="size-4 text-zinc-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-[#1a1a1c] text-zinc-200 border border-zinc-700'
                  : 'text-zinc-400 hover:bg-[#1a1a1c] hover:text-zinc-200'
                }
              `}
            >
              <item.icon className="size-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="border-t border-zinc-800 p-4 space-y-2">
        {/* Profile (dropdown list) */}
        {user && (
          <div ref={profileRef} className="relative">
            {profileMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#0f0f10] border border-zinc-800 rounded-lg overflow-hidden shadow-xl z-50">
                <button
                  onClick={handleBilling}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-[#1a1a1c] hover:text-zinc-200 transition-colors"
                >
                  <CreditCard className="size-4" />
                  Billing
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </button>
              </div>
            )}

            <button
              onClick={() => setProfileMenuOpen((v) => !v)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-[#1a1a1c] hover:bg-[#252527] transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <User className="size-4 text-zinc-300" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-zinc-200">Profile</p>
                <p className="text-xs text-zinc-400 truncate">{user.email}</p>
              </div>
              <ChevronDown
                className={`size-4 text-zinc-500 transition-transform ${
                  profileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
